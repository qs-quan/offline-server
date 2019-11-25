package com.orient.system;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Component;

import java.util.Map;


/**
 * ${DESCRIPTION}
 *
 * @author User
 * @create 2019-08-11 14:39
 */
@Component
public class InitLoadStart {

    Logger logger = LoggerFactory.getLogger(InitLoadStart.class);

    @Autowired
    private ConfigurableApplicationContext context;

    public boolean loadModules() {
        Map<String, IContextLoadRun> startLoadBeans = context.getBeansOfType(IContextLoadRun.class);
        startLoadBeans.forEach((key, bean) -> {
            logger.info("加载运行" + bean.getClass().getName());
            bean.modelLoadRun(context);
        });
        return true;
    }
}
