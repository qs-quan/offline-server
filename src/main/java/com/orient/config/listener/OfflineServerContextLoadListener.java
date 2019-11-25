package com.orient.config.listener;

import com.orient.system.InitLoadStart;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;

/**
 * ${DESCRIPTION}
 *
 * @author User
 * @create 2019-11-21 10:55
 */
@Service
public class OfflineServerContextLoadListener implements ApplicationListener {

    private static boolean doSyn = true;

    @Override
    public void onApplicationEvent(ApplicationEvent event) {

        if (event instanceof ApplicationReadyEvent) {
            if (doSyn) {
                //系统启动后加载的执行的bean
                InitLoadStart initLoadStart = (InitLoadStart) ((ApplicationReadyEvent) event).
                        getApplicationContext().getBean("initLoadStart");
                initLoadStart.loadModules();
                doSyn = false;
            }

        }

    }

}
