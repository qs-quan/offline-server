package com.orient.login.controller;

import com.orient.dao.pojo.User;
import com.orient.login.business.UserBusiness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

/**
 * ${DESCRIPTION}
 *
 * @author User
 * @create 2019-07-11 16:15
 */
@Controller
public class LoginController {

    @Autowired
    UserBusiness userBusiness;

    @Autowired
    private ConfigurableApplicationContext context;


    @RequestMapping("/login")
    public ModelAndView login(Model model, HttpServletRequest request) {
        ModelAndView retVal = new ModelAndView();
        String portal = "portal";
        String index = "index";
        String username = request.getParameter("userName");
        String password = request.getParameter("password");
        if (username == null || password == null) {
            retVal.addObject("msg", "用户名或密码错误！");
            retVal.setViewName(index);
            return retVal;
        }
        User user = userBusiness.login(username, password);
        if (user != null) {
            retVal.addObject("userAllName", user.getAllname());
            retVal.addObject("userId", user.getId());
//            retVal.addObject("deptName", user.getDepid());
            retVal.setViewName(portal);
        } else {
            retVal.addObject("errorMsg", "用户名或密码错误！");
            retVal.setViewName(index);
        }
        return retVal;
    }

}
