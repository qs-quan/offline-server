package com.orient.config;

import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

/**
 * ${DESCRIPTION}
 *
 * @author User
 * @create 2019-08-11 14:29
 */
@Configuration
public class SpringMVCConfig extends WebMvcConfigurationSupport {


    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.setUseSuffixPatternMatch(true).setUseTrailingSlashMatch(true);
    }

    /**
     * -该设置指定匹配后缀*.rdm;
     *
     * @param dispatcherServlet servlet调度器
     * @return ServletRegistrationBean
     */
    @Bean
    public ServletRegistrationBean servletRegistrationBean(DispatcherServlet dispatcherServlet) {
        ServletRegistrationBean servletServletRegistrationBean = new ServletRegistrationBean(dispatcherServlet);
        servletServletRegistrationBean.addUrlMappings("*.rdm");
        return servletServletRegistrationBean;
    }


    private static final String VIEW_PREFIX = "/";
    private static final String VIEW_SUFFIX = ".jsp";
    private static final String VIEW_CONTENT_TYPE = "text/html;charset=UTF-8";

    /**
     * 配置 视图解析器
     * 继成了 WebMvcConfigurationSupport application中配置的视图解析路径会失效 原因不明
     *
     * @return
     */
    @Bean
    public ViewResolver viewResolver() {

        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setCache(true);
        resolver.setPrefix(VIEW_PREFIX);
        resolver.setSuffix(VIEW_SUFFIX);
        resolver.setExposeContextBeansAsAttributes(true);
        resolver.setContentType(VIEW_CONTENT_TYPE);
        return resolver;
    }
}
