/**
 * Created by Administrator on 2016/7/4 0004.
 */
Ext.define('OrientTdm.SysMgr.ModelRightsMgr.Center.ModelRightsDetail', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.modelRightsDetail',
    autoScroll: true,
    requires: [
        'OrientTdm.SysMgr.ModelRightsMgr.Model.ModelRightsExtModel',
        'OrientTdm.SysMgr.ModelRightsMgr.Common.ModelRightForm',
        'OrientTdm.Common.Extend.Form.Field.OrientCheckCombo'
    ],
    initComponent: function () {
        var me = this;
        var toolItems = me._createToolItems();
        var toolBar = Ext.create('Ext.toolbar.Toolbar', {
            items: toolItems
        });
        Ext.apply(me, {
            dockedItems: [toolBar]
        });
        me.callParent(arguments);
        me.addEvents('initModelRightsContent');
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'initModelRightsContent', me._initModelRightsContent, me);
    },
    _createToolItems: function () {
        var me = this;
        return [{
            xtype: 'orientCheckCombo',
            fieldLabel: '选择角色',
            labelAlign: "left",
            labelWidth: 60,
            width: 350,
            displayField: 'name',
            valueField: 'id',
            initFirstRecord: false,
            listeners: {
                afterrender: function(combo) {
                    var store = combo.getStore();
                    store.load(function (records) {
                        if (records.length > 0) {
                            combo.setValue(records[0]);
                            combo.fireEvent('select', combo, records[0]);
                        }
                    });
                },
                select: function (combo, record) {
                    var treePanel = me.ownerCt.westPanel;
                    var nodes = treePanel.getSelectionModel().getSelection();
                    me.fireEvent('initModelRightsContent', nodes[0]);
                }
            },
            store: Ext.create('Ext.data.Store', {
                fields: ['id', 'name'],
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    api: {
                        "read": serviceName + '/role/list.rdm'
                    },
                    reader: {
                        type: 'json',
                        successProperty: 'success',
                        root: 'results',
                        totalProperty:'totalProperty',
                        messageProperty: 'msg'
                    },
                    extraParams: {
                        page: 1,
                        limit: 100
                    }
                }
            })
        }];
    },
    _initModelRightsContent: function (node) {
        var me = this;
        //获取模型权限信息
        var nodeId = node.get('id');
        if ('0' != nodeId && '1' != nodeId) {
            var parentNodeId = node.parentNode.get('id');
            //0：模型；1：视图
            var roleCombobox = me.down('orientCheckCombo[fieldLabel=选择角色]');
            var vals = roleCombobox.getValue();
            if(vals && vals.length>0) {
                var roleId = vals[0];
            }
            else {
                OrientExtUtil.Common.err(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
                return;
            }
            //获取选中模型的权限信息
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ModelRights/getModelRights.rdm', {
                modelId: nodeId,
                roleId: roleId
            }, true, function (resp) {
                //加载面板信息
                var modelRight,
                    modelRightData;
                if (!Ext.isEmpty(resp.decodedData.results)) {
                    modelRightData = resp.decodedData.results;
                } else {
                    modelRightData = {
                        tableId: nodeId,
                        isTable: '0' == parentNodeId ? '1' : '0',
                        roleInfo: roleId
                    }
                }
                modelRight = Ext.create('OrientTdm.SysMgr.ModelRightsMgr.Model.ModelRightsExtModel', modelRightData);
                modelRight.set('tableName', node.getData().text);
                //转化
                var formPanel = me.down('modelRightForm');
                if (formPanel == null) {
                    formPanel = me._createModelRightsContentByRight(roleId, modelRight);
                    me.add(formPanel);
                }
                formPanel.loadRecord(modelRight);
            });
        }
    },
    _createModelRightsContentByRight: function (roleId, modelRight) {
        var me = this;
        var btnTypes;
        //加载操作信息
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelBtnType/list.rdm', {
            page: null,
            limit: null
        }, false, function (resp) {
            btnTypes = resp.decodedData.results;
        });
        var formPanel = Ext.create('OrientTdm.SysMgr.ModelRightsMgr.Common.ModelRightForm', {
            modelRightData: modelRight,
            btnTypes: btnTypes
        });
        return formPanel;
    }
});