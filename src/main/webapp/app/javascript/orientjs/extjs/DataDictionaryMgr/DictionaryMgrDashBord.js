/**
 * 数据字典管理
 * Created by dailin on 2019/5/18 11:05.
 */

Ext.define('OrientTdm.DataDictionaryMgr.DictionaryMgrDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.dictionaryMgrDashBord',

    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            title: '',
            iconCls: 'icon-basicInfo',
            html: '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" ' +
                'src = "' + serviceName + '/app/views/introduction/DataManage.jsp?"></iframe>'
        });
        this.callParent(arguments);
    }
});