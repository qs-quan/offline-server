package com.orient.model;

import java.util.HashSet;
import java.util.Set;

/**
 * Department entity. @author MyEclipse Persistence Tools
 */
public class Department implements java.io.Serializable{

    // Fields
    /**
     * 部门编号
     */
    private String id;

    /**
     * 部门code
     */
    private String code;

    /**
     * 供方主键值ID
     */
    private String sId;

    /**
     * 上级部门
     */
    private String pid;

    private Department parentDept;

    /** 子部门 */
    private Set childDepts=new HashSet(0);

    /**
     * 部门名称
     */
    private String name;

    /**
     * 部门职能
     */
    private String function;

    /**
     * 备注
     */
    private String notes;

    /**
     * 新增标志
     */
    private String addFlg;

    /**
     * 删除标志
     */
    private String delFlg;

    /**
     * 编辑标志
     */
    private String editFlg;

    /**
     * 排序
     */
    private Long order;

    /**
     * 部门用户
     */
    private Set users=new HashSet(0);

    /**
     * 用户登录信息
     */
    private Set userLoginHistorys=new HashSet(0);

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getsId() {
        return sId;
    }

    public void setsId(String sId) {
        this.sId = sId;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public Department getParentDept() {
        return parentDept;
    }

    public void setParentDept(Department parentDept) {
        this.parentDept = parentDept;
    }

    public Set getChildDepts() {
        return childDepts;
    }

    public void setChildDepts(Set childDepts) {
        this.childDepts = childDepts;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFunction() {
        return function;
    }

    public void setFunction(String function) {
        this.function = function;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getAddFlg() {
        return addFlg;
    }

    public void setAddFlg(String addFlg) {
        this.addFlg = addFlg;
    }

    public String getDelFlg() {
        return delFlg;
    }

    public void setDelFlg(String delFlg) {
        this.delFlg = delFlg;
    }

    public String getEditFlg() {
        return editFlg;
    }

    public void setEditFlg(String editFlg) {
        this.editFlg = editFlg;
    }

    public Long getOrder() {
        return order;
    }

    public void setOrder(Long order) {
        this.order = order;
    }

    public Set getUsers() {
        return users;
    }

    public void setUsers(Set users) {
        this.users = users;
    }

    public Set getUserLoginHistorys() {
        return userLoginHistorys;
    }

    public void setUserLoginHistorys(Set userLoginHistorys) {
        this.userLoginHistorys = userLoginHistorys;
    }
}
