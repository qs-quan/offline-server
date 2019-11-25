/**
 *
 * @author QXS
 * @create 2018-09-28 17:05
 */
Ext.define('OrientTdm.TestBomBuild.Panel.TabPanel.ImageNoGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.imageNoGrid',
    config: {
        imageNoId: ""
    },
    initComponent: function () {
        var me = this;
        me.beforeInitComponent.call(me);
        Ext.apply(me, {
            layout: 'border'
        });
        me.callParent(arguments);
        me.afterInitComponent.call(me);
    },
    createColumns: function () {
        var me = this;
        var retVal = [];
        retVal.push({
            header: '产品图号',
            flex: 1,
            sortable: true,
            dataIndex: 'CPTH'
        }, {
            header: "产品编号",
            flex: 1,
            sortable: true,
            dataIndex: 'CPBH'
        });
        return retVal;
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            fields: [
                'CPTH',
                'CPBH'
            ],
            autoLoad: true,
            remoteSort: true,
            proxy: {
                type: 'ajax',
                actionMethods: {
                    create: 'POST',
                    read: 'POST',
                    update: 'POST',
                    destroy: 'POST'
                },
                api: {
                    "read": serviceName + "/PdmController/getAllChildRwInfoByThDataId.rdm"
                },
                extraParams: {
                    thDataId: me.imageNoId
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    totalProperty: 'totalProperty',
                    idProperty: 'ID',
                    messageProperty: 'msg'
                },
                listeners: {}
            }
        });

        return retVal;
    }
});
