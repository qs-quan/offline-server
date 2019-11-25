package com.orient.model;

import java.io.Serializable;

public class NodeResult implements Serializable {

    // nodeId
    private String id = "";
    // 唯一标识
    private String rel = "";
    // 显示值
    private String text = "";
    // 页面上呈现的值
    private String displayText = "";
    // 父id
    private String fid = "";
    // 节点类型
    private String type = "";
    // 根节点ID
    private String rid = "";
    // 判断是否是用户创建
    private String gs = "";
    // 数据库表名
    private String tableName = "";
    // 数据库表 ID
    private String tableId = "";
    // 数据库表 ID
    private String dataId = "";
    // 层级
    private String cj = "";
    // 密级
    private String mj = "";
    // 节点标记
    private String bj = "";
    // 节点图标
    private String iconCls = "";
    private String qtip;
    private boolean leaf;
    private String ids;

    public NodeResult() {
    }

    public NodeResult(String id, String rel, String text, String fid, String type, String rid, String gs, String tableName, String tableId, String dataId, String cj, String mj, String bj, String iconCls) {
        this.id = id;
        this.rel = rel;
        this.text = text;
        this.fid = fid;
        this.type = type;
        this.rid = rid;
        this.gs = gs;
        this.tableName = tableName;
        this.tableId = tableId;
        this.dataId = dataId;
        this.cj = cj;
        this.mj = mj;
        this.bj = bj;
        this.iconCls = iconCls;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRel() {
        return rel;
    }

    public void setRel(String rel) {
        this.rel = rel;
    }

    public String getText() {
        return text;
    }

    public String getDisplayText() {
        return displayText;
    }

    public void setDisplayText(String displayText) {
        this.displayText = displayText;
    }

    public boolean isLeaf() {
        return leaf;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getFid() {
        return fid;
    }

    public void setFid(String fid) {
        this.fid = fid;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRid() {
        return rid;
    }

    public void setRid(String rid) {
        this.rid = rid;
    }

    public String getGs() {
        return gs;
    }

    public void setGs(String gs) {
        this.gs = gs;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getTableId() {
        return tableId;
    }

    public void setTableId(String tableId) {
        this.tableId = tableId;
    }

    public String getDataId() {
        return dataId;
    }

    public void setDataId(String dataId) {
        this.dataId = dataId;
    }

    public String getCj() {
        return cj;
    }

    public void setCj(String cj) {
        this.cj = cj;
    }

    public String getMj() {
        return mj;
    }

    public void setMj(String mj) {
        this.mj = mj;
    }

    public String getBj() {
        return bj;
    }

    public void setBj(String bj) {
        this.bj = bj;
    }

    public String getIconCls() {
        return iconCls;
    }

    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }

    public String getQtip() {
        return qtip;
    }

    public void setQtip(String qtip) {
        this.qtip = qtip;
    }

    public boolean getLeaf() {
        return leaf;
    }

    public void setLeaf(boolean leaf) {
        this.leaf = leaf;
    }

    public String getIds() {
        return ids;
    }

    public void setIds(String ids) {
        this.ids = ids;
    }
}
