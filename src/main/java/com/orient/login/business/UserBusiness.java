package com.orient.login.business;

import com.orient.dao.mapper.UserMapper;
import com.orient.dao.pojo.User;
import com.orient.dao.pojo.UserExample;
import com.orient.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * ${DESCRIPTION}
 *
 * @author User
 * @create 2019-08-08 13:22
 */
@Service
@Transactional
public class UserBusiness {

    @Autowired
    private UserMapper userMapper;


    public User login(String username, String password) {
        UserExample example = new UserExample();
        UserExample.Criteria criteria = example.createCriteria();
        String pwd = PasswordUtil.generatePassword(password);
        criteria.andNameEqualTo(username);
        List<User> users = userMapper.selectByExample(example);
        if(users.size() > 0){
            User ret = null;
            for (int i = 0; i < users.size(); i++) {
                User u = users.get(0);
                if(pwd.equalsIgnoreCase(u.getPassword())){
                    ret = u;
                    break;
                }
            }
            return ret;
        }
        else return null;
    }
}
