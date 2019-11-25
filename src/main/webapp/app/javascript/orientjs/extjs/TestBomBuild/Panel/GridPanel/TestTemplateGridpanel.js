/**
 * Created by dailin on 2019/7/9 16:51.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.TestTemplateGridpanel',{
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.testTemplateGridpanel',

    initComponent: function () {
        var me = this;
        me.customerFilter = me.getCustomFilter();
        // me.testTypeDataId = me.getTestTypeDataId();
        me.callParent(arguments);
    },

    getCustomFilter: function () {
        var me = this;
        var customFilter = [];
        var existIds = "";
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TemplateController/getDataIdsByTestTaskId.rdm',{
            dataId: me.dataId
        },false,function (response) {
            if (response.decodedData.success) {
                existIds = response.decodedData.results;
            }
        });
        if(me.hasToolbar) {
            if (existIds == "") {
                customFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.IsNull, "", ""));
            } else {
                customFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", existIds));
            }

        } else {
            // sylx节点的dataId，再加existId
            customFilter.push(new CustomerFilter("T_SYLX_" + OrientExtUtil.FunctionHelper.getSYZYSchemaId() + "_ID",
                CustomerFilter.prototype.SqlOperation.Equal, "", me.testTypeDataId));
            if (existIds != "") {
                customFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.NotIn, "", existIds));
            }
        }

        return customFilter;
    },

    createToolBarItems: function () {
        var me = this;
        var retV = [];
        if (me.hasToolbar) {
            retV.push({
                xtype: "button",
                text: "选择",
                iconCls: 'icon-saveAndClose',
                handler: function () {
                    me._chooseFunction();
                }
            });
            retV.push({
                xtype: "button",
                text: "删除",
                iconCls: 'icon-delete',
                handler: function () {
                    me._deleteFunction();
                }
            });
        }

        return retV;
    },

    _chooseFunction: function () {
        var me = this;
        var panel = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TestTemplateGridpanel', {
            hasToolbar: false,
            dataId: me.dataId,
            treeNode: me.treeNode,
            testTypeDataId: me.testTypeDataId,
            modelName: me.modelName,
            padding: '0 0 0 5',
            modelId: me.modelId
        });

        var chooseWindow = OrientExtUtil.WindowHelper.createWindow(panel, {
            title: '选择试验模板',
            layout: "fit",
            width: 0.8 * globalWidth,
            height: 0.8 * globalHeight,
            buttonAlign: 'center',
            buttons:[{
                xtype: "button",
                text: "确定",
                iconCls: 'icon-saveAndClose',
                handler: function () {
                    var grid = this.up('window').down('gridpanel');
                    if (!OrientExtUtil.GridHelper.hasSelected(grid)) {
                        return;
                    } else {
                        var recordIds = OrientExtUtil.GridHelper.getSelectRecordIds(grid);
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TemplateController/insertTemplateIdsAndTestTaskIdRelation.rdm',{
                            templateIds: recordIds,
                            testTaskId: me.dataId
                        }, false, function (response) {
                            OrientExtUtil.Common.tip('提示', response.decodedData.results);
                        });
                        me.customerFilter = me.getCustomFilter();
                        me.store.getProxy().setExtraParam("customerFilter",Ext.encode(me.customerFilter));
                        me.fireEvent("refreshGrid");
                        this.up('window').close();
                    }
                }
            }],
        }).show();
    },

    // 删除
    _deleteFunction: function () {
        var me = this;
        var me = this;
        if (OrientExtUtil.GridHelper.hasSelected(me)) {
            // 删除前进行确认
            Ext.Msg.confirm('提示', '是否删除?',
                function (btn, text) {
                    if (btn == 'yes') {

                        var recordIds = OrientExtUtil.GridHelper.getSelectRecordIds(me).join(',');
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TemplateController/deleteTemplateIdsAndTestTaskIdRelation.rdm',{
                            templateIds: recordIds,
                            testTaskId: me.dataId
                        }, false, function (response) {
                            OrientExtUtil.Common.tip('提示', response.decodedData.results);
                            me.customerFilter = me.getCustomFilter();
                            me.store.getProxy().setExtraParam("customerFilter",Ext.encode(me.customerFilter));
                            me.fireEvent("refreshGrid");
                        });
                    }
                }
            );
        }  else {
            OrientExtUtil.Common.info('选择','请至少选择一条记录');
            return;
        }
    }

});
