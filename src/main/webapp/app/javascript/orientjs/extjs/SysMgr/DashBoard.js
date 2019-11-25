/**
 * Created by enjoy on 2016/3/15 0015.
 * 系统管理首页
 */
Ext.define('OrientTdm.SysMgr.DashBoard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.sysMgrDashBord',
    initComponent: function () {
        Ext.apply(this, {
            title: '简介',
            iconCls: 'icon-basicInfo',
            //html: '<h1>系统管理...此处可也添加HTML，介绍功能点主要用途</h1>'
            html:'<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" src = "' + serviceName +
            '/app/views/introduction/SystemManage.jsp?"></iframe>'
        });
        this.callParent(arguments);
    }
});