/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.AuditFlowTaskBind.AuditFLowTaskBindList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.auditFLowTaskBindList',
    requires: [
        'OrientTdm.BackgroundMgr.AuditFlowTaskBind.Model.AuditFlowTaskBindExtModel',
        'OrientTdm.BackgroundMgr.CustomForm.CustomFormDashBord'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    usePage: false,
    config: {
        belongAuditBind: ''
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [];
        retVal.push({
            xtype: 'tbtext',
            text: '<span style="color:red;">★所在列可双击编辑</span>'
        });
        return retVal;
    },
    createColumns: function () {
        var me = this;
        return [
            {
                header: '任务名称',
                sortable: true,
                width: 150,
                dataIndex: 'taskName'
            },
            {
                header: '绑定freemarker表单(★)',
                sortable: true,
                width: 150,
                dataIndex: 'formId_display'
            },
            {
                header: '自定义路径（★）',
                sortable: true,
                width: 290,
                dataIndex: 'customPath',
                editor: {
                    xtype: 'textfield'
                }
            },
            {
                xtype: 'checkcolumn',
                header: '是否可选择额外的审批人（★）',
                sortable: true,
                width: 200,
                dataIndex: 'canAssignOther',
                listeners: {
                    'checkchange': function (column, rowIndex, checked) {
                        var record = me.getStore().getAt(rowIndex);
                        record.set('canAssignOther', checked == true ? 1 : 0);
                        me.saveRecord(function () {
                            record.commit();
                        });
                    }
                }
            }
        ];
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.AuditFlowTaskBind.Model.AuditFlowTaskBindExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/AuditFlowTaskSetting/init.rdm',
                    "create": serviceName + '/AuditFlowTaskSetting/create.rdm',
                    "update": serviceName + '/AuditFlowTaskSetting/update.rdm',
                    "destroy": serviceName + '/AuditFlowTaskSetting/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    belongAuditBind: me.belongAuditBind
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
        me.mon(me, 'celldblclick', me.celldblclick, me);
    },
    celldblclick: function (view, td, cellIndex, record, tr, rowIndex) {
        var me = this;
        var belongGrid = view.up('grid');
        //存在checkbox
        var clickedColumn = belongGrid.columns[cellIndex - 1];
        var clickedcolumnIndex = clickedColumn.dataIndex;
        if ('formId_display' == clickedcolumnIndex) {
            //类型选择器
            var item = Ext.create('OrientTdm.BackgroundMgr.CustomForm.CustomFormDashBord', {});
            OrientExtUtil.WindowHelper.createWindow(item, {
                title: '绑定表单',
                buttons: [
                    {
                        text: '关闭',
                        iconCls: 'icon-close',
                        handler: function () {
                            this.up('window').close();
                        }
                    },
                    {
                        text: '清空选择',
                        iconCls: 'icon-clear',
                        handler: function () {
                            record.set('formId_display', '');
                            record.set('formId', '');
                            me.saveRecord();
                        }
                    },
                    {
                        text: '保存',
                        iconCls: 'icon-save',
                        handler: function () {
                            var currWin = this.up('window');
                            var grid = currWin.down('modelFormExtList');
                            if (OrientExtUtil.GridHelper.hasSelectedOne(grid)) {
                                var selectedRecord = OrientExtUtil.GridHelper.getSelectedRecord(grid)[0];
                                var formId = selectedRecord.get('id');
                                var formName = selectedRecord.get('name');
                                if(formId != record.get('formId')){
                                    record.set('formId_display', formName);
                                    record.set('formId', formId);
                                    me.saveRecord(function () {
                                        currWin.close();
                                    });
                                }else{
                                    currWin.close();
                                }
                            }
                        }
                    }
                ]
            },600, 800);
        }
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