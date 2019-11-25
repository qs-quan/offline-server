/**
 * Created by qjs on 2016/11/8.
 */
Ext.define('OrientTdm.SysMgr.CheckModelMgr.CheckModelList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.CheckModelList',
    requires: [
        'OrientTdm.SysMgr.CheckModelMgr.Model.CheckModelExtModel'
        //'OrientTdm.BackgroundMgr.AuditFlowTaskBind.AuditFLowTaskBindList'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    usePage: false,
    //视图初始化
    createToolBarItems: function () {
        var retVal = [];
        retVal.push({
            xtype: 'tbtext',
            text: '<span style="color:red;">★所在列可双击编辑</span>'
        });
        return retVal;
    },
    createColumns: function () {
        var datas = [{checkType:'0',checkTypeName:'任意格式'},{checkType:'1',checkTypeName:'字符串'},{checkType:'2',checkTypeName:'勾选'},{checkType:'3',checkTypeName:'字符串加勾选'}];
        var store = {
            fields:['checkType','checkTypeName'],
            proxy:{
                type:'memory',
                data:datas,
                reader:'json'
            },
            autoLoad:true
        };
        var checkTypeEditor = {
            xtype:'combo',
            editable:false,
            triggerAction:'all',
            displayField:'checkTypeName',
            valueField:'checkTypeName',
            store:store
        };

        var isRequiredData = [{isRequired:'0',isRequiredName:'必填'},{isRequired:'1',isRequiredName:'非必填'}];
        var requireStore = {
            fields:['isRequired','isRequiredName'],
            proxy:{
                type:'memory',
                data:isRequiredData,
                reader:'json'
            },
            autoLoad:true
        };
        var isRequiredEditor = {
            xtype:'combo',
            editable:false,
            triggerAction:'all',
            displayField:'isRequiredName',
            valueField:'isRequiredName',
            store:requireStore
        };

        var isBindPhotoData = [{isBindPhoto:'0',isBindPhotoName:'绑定'},{isBindPhoto:'1',isBindPhotoName:'不绑定'}];
        var bindPhotoStore = {
            fields:['isBindPhoto','isBindPhotoName'],
            proxy:{
                type:'memory',
                data:isBindPhotoData,
                reader:'json'
            },
            autoLoad:true
        };
        var isBindPhotoEditor = {
            xtype:'combo',
            editable:false,
            triggerAction:'all',
            displayField:'isBindPhotoName',
            valueField:'isBindPhotoName',
            store:bindPhotoStore
        };

        return [
            {
                header: '名称',
                sortable: true,
                flex: 1,
                dataIndex: 'columnName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '检查格式(★)',
                dataIndex: 'checkTypeName',
                filter: {
                    type: 'string'
                },
                flex:1,
                editor:checkTypeEditor
            },
            {
                header:'是否必填(★)',
                dataIndex:'isRequiredName',
                filter: {
                    type: 'string'
                },
                flex:1,
                editor:isRequiredEditor
            },
            {
                header:'绑定照片(★)',
                dataIndex:'isBindPhotoName',
                filter: {
                    type: 'string'
                },
                flex:1,
                editor:isBindPhotoEditor
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.CheckModelMgr.Model.CheckModelExtModel',
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/CheckModelManage/CheckModelColumns.rdm',
                    //"create": serviceName + '/AuditFlowModelBind/create.rdm',
                    "update": serviceName + '/CheckModelManage/updateCheckModelColumns.rdm'
                    //"delete": serviceName + '/AuditFlowModelBind/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                writer: {
                    type: 'json',
                    allowSingle: true
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    initComponent: function () {
        var me = this;
        me.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2,
            listeners: {
                edit: function (editor, e) {
                    if (e.record.dirty) {
                        me.saveRecord(function () {
                            e.record.commit();
                        });
                    }
                },
                validateedit: function (editor, e) {

                }
            }
        });
        Ext.apply(me, {
            plugins: [me.cellEditing]
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    saveRecord: function (successCallback) {
        var me = this;
        me.getStore().sync(
            {
                success: successCallback
            }
        );
    }

});