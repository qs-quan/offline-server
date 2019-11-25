package com.orient.system;

import com.github.pagehelper.util.StringUtil;
import com.google.gson.Gson;
import com.orient.baseinfo.annnotion.InfoType;
import com.orient.baseinfo.business.ISynBusiness;
import com.orient.util.HttpClientUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Map;

/**
 * ${DESCRIPTION}
 *
 * @author User
 * @create 2019-11-21 10:23
 */
@Service
public class InfoSynRunner implements IContextLoadRun {

    @Value("${spring.tdm.ip}")
    private String ip;

    @Value("${spring.tdm.port}")
    private String port;

    @Value("${spring.tdm.name}")
    private String name;

    @Value("${spring.tdm.synUrl}")
    private String synUrl;

    private Boolean isUpdate = false;


    @Override
    public boolean modelLoadRun(ConfigurableApplicationContext contextLoad) {

        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                while (true) {
                    //判断网络状态
                    //网络一直连着只更新一次 isUpdate控制更新次数否则会一直重复更新
                    System.out.println("判断网络状态");
                    if (isConnect() && isUpdate == false) {
                        System.out.println("网络通畅，更新数据");
                        //获取同步数据
                        Map<String, String> info = getSynInfo();
                        //执行同步
                        Map<String, ISynBusiness> startLoadBeans = contextLoad.getBeansOfType(ISynBusiness.class);
                        startLoadBeans.forEach((key, bean) -> {
                            String jsonStr = info.get(bean.getClass().getAnnotation(InfoType.class).type());
                            if(StringUtil.isNotEmpty(jsonStr)){
                                isUpdate = bean.doSyn(jsonStr);
                            }else {
                                isUpdate = false;
                            }

                        });
                    } else {
                        //网络断开，更新状态改变保证第一网络连接进入更新分支
                        if (!isConnect()) {
                            System.out.println("网络断开");
                            isUpdate = false;
                        }
                    }
                }
            }
        });
        thread.start();
        return true;
    }


    /**
     * 测试网络连接状态
     *
     * @return
     */
    private boolean isConnect() {
        boolean connect = false;
        Runtime runtime = Runtime.getRuntime();
        Process process;
        try {
            process = runtime.exec("ping " + ip);
            InputStream is = process.getInputStream();
            InputStreamReader isr = new InputStreamReader(is, "GBK");
            BufferedReader br = new BufferedReader(isr);
            String line = null;
            StringBuffer sb = new StringBuffer();
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
            //System.out.println("返回值为:"+sb);
            is.close();
            isr.close();
            br.close();

            if (null != sb && !sb.toString().equals("")) {
                String logString = "";
                if (sb.toString().indexOf("TTL") > 0) {
                    // 网络畅通
                    connect = true;
                } else {
                    // 网络不畅通
                    connect = false;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return connect;
    }

    /**
     * 获取所有同步信息
     *
     * @return
     */
    private Map<String, String> getSynInfo() {
        Gson gson = new Gson();
        String url = "http://" + this.ip + ":" + this.port + "/" + this.name + this.synUrl;
        String result = HttpClientUtil.doGet(url);
        Map<String, String> info = gson.fromJson(result, Map.class);
        return info;
    }
}
