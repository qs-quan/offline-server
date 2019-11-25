package com.orient.model;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * ${DESCRIPTION}
 *
 * @author Administrator
 * @create 2017-05-03 8:18
 */
public class LightWeightDepartment implements Serializable{

    // Fields
    /**
     * 部门编号
     */
    private String id;

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
     * 部门用户
     */
    private Set users=new HashSet(0);


    // Property accessors

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
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
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFunction() {
        return this.function;
    }

    public void setFunction(String function) {
        this.function = function;
    }

    public String getNotes() {
        return this.notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getAddFlg() {
        return this.addFlg;
    }

    public void setAddFlg(String addFlg) {
        this.addFlg = addFlg;
    }

    public String getDelFlg() {
        return this.delFlg;
    }

    public void setDelFlg(String delFlg) {
        this.delFlg = delFlg;
    }

    public String getEditFlg() {
        return this.editFlg;
    }

    public void setEditFlg(String editFlg) {
        this.editFlg = editFlg;
    }

    /**
     * users
     *
     * @return  the users
     * @since   CodingExample Ver 1.0
     */

    public Set getUsers() {
        return users;
    }

    /**
     * users
     *
     * @param   users    the users to set
     * @since   CodingExample Ver 1.0
     */

    public void setUsers(Set users) {
        this.users = users;
    }

}
