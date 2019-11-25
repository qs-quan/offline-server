/**
 * Created by dailin on 2019/7/3 15:40.
 */

Ext.define('OrientTdm.knowledge.KnowledgeMgr', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.knowledgeMgr',

    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            // title: '',
            iconCls: 'icon-basicInfo',
            html: '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" ' +
                // 'src = "' + serviceName + '/app/views/introduction/DataManage.jsp?"></iframe>'
                'src = "' + serviceName + '/app/views/test/test.jsp?"></iframe>'
        });
        this.callParent(arguments);
    }
});