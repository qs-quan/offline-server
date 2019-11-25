package com.orient.baseinfo.annnotion;

import java.lang.annotation.*;

/**
 * ${DESCRIPTION}
 *
 * @author User
 * @create 2019-10-11 16:18
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface InfoType {

    public String type();
}
