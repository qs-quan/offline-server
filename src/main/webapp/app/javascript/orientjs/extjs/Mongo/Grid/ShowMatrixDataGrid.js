/**
 * 显示矩阵数据的grid
 *
 * Created by GNY on 2018/5/30
 */
Ext.define('OrientTdm.Mongo.Grid.ShowMatrixDataGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.showMatrixDataGrid',
    requires: [
        'OrientTdm.Mongo.Handler.GridDataHandler',
        'OrientTdm.Mongo.Version.VersionModel'
    ],
    selType: 'checkboxmodel',
    multiSelect: true,
    pageSize: 25,
    config: {
        modelId: null,
        dataId: null,
        tabName: null,
        versionStore: null,
        showVersionId: null,
        filterJson: null,
        queryUrl: null,
        canEditData: false,  //是否可编辑数据
        canSwitchVersion: true,
        canRollbackData: false,
        modifyDataArray: [],
        girdFields: null
    },
    initComponent: function () {
        var me = this;

        var params = {modelId: me.modelId, dataId: me.dataId, tabName: me.tabName};
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/mongoService/judgeCanEditData.rdm', params, false, function (resp) {
            var result = resp.decodedData.results;
            switch (result['responseCode']) {
                case '0':    //mongo修改日志记录为空，可以修改编辑数据
                    me.queryUrl = '/mongoService/getCurrentVersionGridData.rdm';
                    me.canEditData = true;
                    me.canSwitchVersion = true;
                    me.canRollbackData = false;
                    me.showVersionId = result['versionNumber'];
                    break;
                case '1':  //mongo修改日志记录的用户id就是当前用户id,可以修改编辑数据
                    me.queryUrl = '/mongoService/getTempVersionGridData.rdm';
                    me.canEditData = true;
                    me.canSwitchVersion = false;
                    me.canRollbackData = true;
                    break;
                case '2':  //mongo修改日志记录的用户id不是当前用户id,不可以修改编辑数据
                    me.queryUrl = '/mongoService/getCurrentVersionGridData.rdm';
                    me.canEditData = false;
                    me.canSwitchVersion = true;
                    me.showVersionId = result['versionNumber'];
                    me.canRollbackData = false;
                    break;
                default:
                    break;
            }
        });

        Ext.apply(me, {
            plugins: [
                new Ext.grid.plugin.CellEditing({
                    clicksToEdit: 2,
                    listeners: {
                        beforeedit: function (editor, e) {
                            return me.canEditData;  //只有处于编辑状态，单元格才能编辑
                        },
                        edit: function (editor, ctx) {
                            //当编辑单元格的时候，把column,objId和修改值封装为一个对象,push到modifyDataArray
                            if (ctx.value == '') {
                                OrientExtUtil.Common.err(OrientLocal.prompt.info, '修改值不能为空');
                            }
                            if (ctx.value != ctx.originalValue) {
                                var modifyObj = {
                                    changeValue: ctx.value,
                                    column: ctx.field,
                                    objId: ctx.record.data['_id']
                                };
                                me.modifyDataArray.push(modifyObj);
                            }
                        }
                    }
                })
            ]
        });

        me.versionStore = me.createVersionStore();
        //定义Columns
        me.columns = me.createColumns();
        //定义Store
        me.store = me.createStore();
        //定义顶部按钮
        me.tbar = me.createToolBarItems();
        //底部分页栏
        me.dockedItems = me.createFootBar();
        me.callParent(arguments);
    },
    createVersionStore: function () {
        var me = this;
        return Ext.create(
            'Ext.data.Store', {
                autoLoad: true,
                model: 'OrientTdm.Mongo.Version.VersionModel',
                proxy: {
                    type: 'ajax',
                    url: serviceName + '/mongoService/queryVersionList.rdm?',
                    reader: {
                        type: 'json',
                        successProperty: 'success',
                        totalProperty: 'totalProperty',
                        root: 'results',
                        messageProperty: 'message'
                    },
                    extraParams: {
                        modelId: me.modelId,
                        dataId: me.dataId,
                        tabName: me.tabName
                    }
                }
            }
        );
    },
    createColumns: function () {
        var me = this;
        var columns = [];
        me.girdFields = ["_id"];
        var params = {modelId: me.modelId, dataId: me.dataId, tabName: me.tabName};
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/mongoService/getColumns.rdm', params, false, function (resp) {
            var columnNames = resp.decodedData.results;
            Ext.each(columnNames, function (columnName) {
                var col = {
                    header: columnName,
                    flex: 1,
                    dataIndex: columnName,
                    editor: {
                        xtype: 'textfield'
                    },
                    renderer: function (value, meta, record) {
                        value = value || '';
                        meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                };
                columns.push(col);
                me.girdFields.push(columnName);
            });
        });
        return columns;
    },
    createStore: function () {
        var me = this;
        return Ext.create('Ext.data.Store', {
            fields: me.girdFields,
            autoLoad: true,
            remoteSort: false,
            proxy: {
                type: 'ajax',
                url: serviceName + me.queryUrl,
                extraParams: {
                    modelId: me.modelId,
                    dataId: me.dataId,
                    tabName: me.tabName
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'message'
                }
            }
        });
    },
    createToolBarItems: function () {
        var me = this;
        var toolBarItems = [
            {
                iconCls: 'icon-search',
                text: '查询',
                itemId: 'query',
                handler: function () {
                    me.queryData();
                }
            },
            {
                iconCls: 'icon-queryAll',
                text: '显示全部',
                itemId: 'showAll',
                handler: function () {
                    me.showAllData();
                }
            },
            {
                iconCls: 'icon-analysis',
                text: '数据分析',
                itemId: 'dataAnalysis',
                handler: function () {
                    me.dataAnalysis();
                }
            },
            {
                iconCls: 'icon-update',
                text: '保存更新',
                itemId: 'updateData',
                handler: function () {
                    me.updateData();
                }
            },
            {
                iconCls: 'icon-up',
                text: '版本升级',
                itemId: 'updateVersion',
                handler: function () {
                    me.updateVersion();
                }
            },
            {
                iconCls: 'icon-back',
                text: '数据回滚',
                disabled: !me.canRollbackData,
                itemId: 'rollbackLastVersion',
                handler: function () {
                    me.rollbackLastVersion();
                }
            },
            {
                xtype: 'combo',
                itemId: 'switchVersion',
                fieldLabel: '版本切换',
                labelAlign: 'right',
                labelSeparator: '',
                editable: false,
                disabled: !me.canSwitchVersion,
                margin: '0 5 0 -40',
                displayField: 'versionName',
                valueField: 'versionId',
                store: me.versionStore,
                listeners: {
                    select: function (combo, record, index) {
                        var params = {
                            modelId: me.modelId,
                            dataId: me.dataId,
                            tabName:me.tabName,
                            versionId: record[0].data.versionId
                        };

                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/mongoService/switchVersion.rdm', params, false, function (resp) {
                            if (!resp.decodedData.success) {
                                OrientExtUtil.Common.err(OrientLocal.prompt.info, '版本切换失败');
                            } else {
                                me.reloadGridData(serviceName + '/mongoService/getCurrentVersionGridData.rdm');
                                me.showVersionId = record[0].data.versionId;
                                OrientExtUtil.Common.tip(OrientLocal.prompt.info, '版本切换成功');
                            }
                        });
                    },
                    afterRender: function (combo) {
                        //combo选中显示版本
                        combo.setValue(me.showVersionId);
                    }
                }
            }
        ];
        return toolBarItems;
    },
    createFootBar: function () {
        var me = this;
        return {
            xtype: 'pagingtoolbar',
            store: me.store,
            dock: 'bottom',
            displayInfo: true,
            items: [
                {
                    xtype: 'tbseparator'
                },
                {
                    xtype: 'numberfield',
                    labelWidth: 30,
                    width: 100,
                    fieldLabel: '每页',
                    enableKeyEvents: true,
                    value: me.pageSize,
                    listeners: {
                        keydown: function (field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER && !Ext.isEmpty(field.getValue())) {
                                var newPageSize = field.getValue();
                                var store = me.getStore();
                                store.pageSize = newPageSize;
                                store.loadPage(1);
                            }
                        }
                    }
                }, '条'

            ]
        };
    },
    updateVersion: function () {
        var me = this;
        var params = {
            modelId: me.modelId,
            dataId: me.dataId,
            tabName: me.tabName
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/mongoService/updateVersion.rdm', params, false, function (resp) {
            if (resp.decodedData.success) {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, '版本升级成功');
                //me.refreshGrid();
                me.reloadGridData(serviceName + '/mongoService/getCurrentVersionGridData.rdm');
                var combo = me.down('#switchVersion');
                //设置combo可用
                combo.setDisabled(false);
                //重新加载combo的数据
                combo.store.reload();
                //设置combo选中默认显示版本
                me.showVersionId = resp.decodedData.results;
                combo.setValue(me.showVersionId);
                //数据回滚不可用
                me.down('#rollbackLastVersion').setDisabled(true);
                //设置当前数据可编辑
                me.canEditData = true;
            } else {
                OrientExtUtil.Common.err(OrientLocal.prompt.info, '版本升级失败');
            }
        });
    },
    updateData: function () {
        var me = this;
        //更新数据前判断现在是否有更新数据的权限，因为可能已经有其他用户修改了数据
        var params = {
            modelId: me.modelId,
            dataId: me.dataId,
            tabName: me.tabName,
            versionId: me.showVersionId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/mongoService/beginEdit.rdm', params, false, function (resp) {
            switch (resp.decodedData.results) {
                case '0':  //获取了修改权限
                    me.doUpdate();
                    break;
                default :
                    OrientExtUtil.Common.info(OrientLocal.prompt.info, resp.decodedData.msg);
                    break;
            }
        });
    },
    doUpdate: function () {
        var me = this;
        if (me.modifyDataArray.length == 0) {
            OrientExtUtil.Common.info(OrientLocal.prompt.info, '未修改任何数据');
            return;
        }
        var params = {
            modelId: me.modelId,
            dataId: me.dataId,
            tabName: me.tabName,
            modifyDataList: JSON.stringify(me.modifyDataArray)
        };

        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/mongoService/modifyData.rdm', params, false, function (resp) {
            if (resp.decodedData.success) {
                me.reloadGridData(serviceName + '/mongoService/getTempVersionGridData.rdm');
                //me.refreshGridByTempData(); //把temp表里的数据显示到grid中
                me.down('#switchVersion').setDisabled(true);  //数据修改完后，需要把切换版本的功能禁止掉，等升级版本后再开放
                me.down('#switchVersion').setValue('');
                me.down('#rollbackLastVersion').setDisabled(false);
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, '数据修改成功');
            }
        });
    },
    reloadGridData: function (queryUrl) {
        var me = this;
        var store = me.getStore();
        store.proxy.url = queryUrl;
        store.load();
    },
    queryData: function () {
        var me = this;
        var win = Ext.create('Ext.Window', Ext.apply({
            plain: true,
            height: 0.5 * globalHeight,
            width: 0.5 * globalWidth,
            layout: 'fit',
            maximizable: true,
            modal: true,
            title: '查询条件设置',
            items: [
                Ext.create('OrientTdm.Mongo.Query.QueryConditionInputGrid', {
                    originalGrid: me,
                    originalGridColumns: me.columns,
                    modelId: me.modelId,
                    dataId: me.dataId,
                    tabName: me.tabName,
                    showVersionId: me.showVersionId,
                    queryUrl: me.queryUrl
                })
            ]
        }));
        win.show();
    },
    showAllData: function () {
        var me = this;
        var store = me.getStore();
        store.proxy.extraParams = {
            modelId: me.modelId,
            dataId: me.dataId,
            tabName: me.tabName
        };
        store.load();
    },
    rollbackLastVersion: function () {
        var me = this;
        var params = {
            modelId: me.modelId,
            dataId: me.dataId,
            tabName: me.tabName
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/mongoService/rollbackLastVersion.rdm', params, false, function (resp) {
            if (resp.decodedData.success) {
                me.reloadGridData(serviceName + '/mongoService/getTempVersionGridData.rdm');//把temp表里的数据显示到grid中
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, '数据回滚成功');
            } else {
                OrientExtUtil.Common.err(OrientLocal.prompt.info, resp.decodedData.msg);
            }
        });
    },
    dataAnalysis: function () {
        var me = this;
        var selections = me.getSelectionModel().getSelection();
        var dataIdFilter = [];
        Ext.each(selections, function (record) {
            dataIdFilter.push(record.data['_id']);
        });

        var wait = Ext.MessageBox.wait('正在准备数据，请稍后...', '准备数据', {text: '请稍后...'});
        Ext.Ajax.request({
            url: serviceName + '/mongoService/dataAnalysis.rdm',
            method: 'POST',
            params: {
                modelId: me.modelId,
                dataId: me.dataId,
                tabName: me.tabName,
                filterJson: me.filterJson,
                canEditData: me.canEditData,
                dataIdFilter: dataIdFilter
            },
            success: function (response, options) {
                wait.hide();
                var data = response.decodedData;
                //此处点击“数据分析”按钮添加回调数据分析客户端的js响应函数-ZhangSheng 2018.8.11
                try{
                    window.startTools("orientLabPlot;:;"+data.fileName.join("]]"));
                }catch(e){
                    var params = data.serviceAddr + ';' + data.servicePort + ';' + data.fileName + ';null;null';
                    HtmlTriggerHelper.startUpTool('edmplot', 'null', params);
                }
            },
            failure: function (result, request) {
                wait.hide();
                Ext.MessageBox.alert('错误', '数据准备错误...');
            }
        });
    }
});