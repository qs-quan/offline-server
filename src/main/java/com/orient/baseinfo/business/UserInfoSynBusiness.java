package com.orient.baseinfo.business;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.orient.baseinfo.annnotion.InfoType;
import com.orient.dao.mapper.UserMapper;
import com.orient.dao.pojo.User;
import com.orient.dao.pojo.UserExample;
import com.orient.model.LightweightUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


/**
 * ${DESCRIPTION}
 *
 * @author User
 * @create 2019-08-12 10:37
 */
@Service
@InfoType(type = "user")
public class UserInfoSynBusiness implements ISynBusiness {

    @Autowired
    private UserMapper userMapper;


    @Override
    public Boolean doSyn(String info) {
        Gson gson = new Gson();
        List<LightweightUser> lightweightUserList = gson.fromJson(info, new TypeToken<List<LightweightUser>>() {
        }.getType());
        UserExample Example = new UserExample();
        List<User> userList = getDpt(Example);
        long ret = selectCount(Example);

        //本地数据表中的id集合
        List<String> localIdList = new ArrayList();
        for (int i = 0; i < userList.size(); i++) {
            User u = userList.get(i);
            localIdList.add(u.getId().toString());
        }

        //服务器数据表中的id集合
        List<String> lightWeightUserIdList = new ArrayList();
        for (int i = 0; i < lightweightUserList.size();i++){
            LightweightUser l = lightweightUserList.get(i);
            lightWeightUserIdList.add(l.getId());
        }

        List<String> newList = new ArrayList<>(localIdList);

        if (ret == 0) {
            lightweightUserList.forEach(lightweightUser -> {
                insert(lightweightUser);
            });
        } else {
            for (int i = 0; i < userList.size(); i++) {
                User u = userList.get(i);
                lightweightUserList.forEach(lightweightUser -> {
                    if (Integer.parseInt(lightweightUser.getId()) == u.getId()) {
                        update(lightweightUser);
                    }
                });
            }


            //本地数据表中存在的，服务器数据表中不存在的，删除
            localIdList.removeAll(lightWeightUserIdList);
            if (localIdList != null && !localIdList.isEmpty()) {
                localIdList.forEach(item -> {
                    delete(Integer.parseInt(item));
                });
            }

            //本地数据表中不存在的，服务器数据表中存在的，添加
            lightWeightUserIdList.removeAll(newList);
            if (lightWeightUserIdList != null && !lightWeightUserIdList.isEmpty()){
                lightWeightUserIdList.forEach(item_id ->{
                    lightweightUserList.forEach(lightweightUser ->{
                        if (item_id == lightweightUser.getId()){
                            insert(lightweightUser);
                        }
                    });
                });
            }
        }
        return true;
    }

    private long selectCount(UserExample userExample) {
        long ret = 0;
        ret = userMapper.countByExample(userExample);
        return ret;
    }

    private List<User> getDpt(UserExample userExample) {
        List<User> users = userMapper.selectByExample(userExample);
        return users;
    }

    private void insert(LightweightUser lightweightUser) {
        User user = new User();
        user.setId(Integer.parseInt(lightweightUser.getId()));
        user.setName(lightweightUser.getUserName());
        user.setAllname(lightweightUser.getAllName());
        user.setPassword(lightweightUser.getPassword());
        user.setDepid(Integer.valueOf(lightweightUser.getDept().getId()));
        user.setGrade(lightweightUser.getGrade());
        userMapper.insertSelective(user);
    }

    private int delete(Integer id) {
        int ret = userMapper.deleteByPrimaryKey(id);
        return ret;
    }

    private void update(LightweightUser lightweightUser) {
        User user = new User();
        UserExample userExample = new UserExample();
        userExample.createCriteria().andIdEqualTo(Integer.parseInt(lightweightUser.getId()));
        user.setName(lightweightUser.getUserName());
        user.setAllname(lightweightUser.getAllName());
        user.setPassword(lightweightUser.getPassword());
        user.setDepid(Integer.valueOf(lightweightUser.getDept().getId()));
        user.setGrade(lightweightUser.getGrade());
        userMapper.updateByExampleSelective(user, userExample);
    }

}



