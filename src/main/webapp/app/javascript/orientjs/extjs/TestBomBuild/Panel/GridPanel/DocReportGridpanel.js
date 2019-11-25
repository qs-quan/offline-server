/**
 * Created by dailin on 2019/6/27 8:56.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.DocReportGridpanel', {
    extend: 'OrientTdm.BackgroundMgr.DocReport.DocReportList',
    alias: 'widget.docReportList',

    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    //视图初始化
    createToolBarItems: function () {
        return [];
    },

    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.DocReport.Model.DocReportExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/DocReports/list.rdm',
                    'create': serviceName + '/DocReports/create.rdm',
                    'update': serviceName + '/DocReports/update.rdm',
                    'delete': serviceName + '/DocReports/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    limit: null,
                    operate: me.operate,
                    modelId:me.modelId

                }
            }
        });
        this.store = retVal;
        return retVal;
    }

});