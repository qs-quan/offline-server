Ext.define('OrientTdm.BackgroundMgr.DocReport.Common.DocModelColumnPanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.docModelColumnPanel',
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    usePage: false,
    multiSelect: false,
    requires: [
        'OrientTdm.BackgroundMgr.DocReport.Model.DocColumnExtModel',
        'OrientTdm.BackgroundMgr.DocHandler.DocHandlerList'
    ],
    config: {
        modelId: '',
        isView: ''
    },
    initComponent: function () {
        var me = this;
        me.addEvents({
            refreshByModelId: true
        });
        me.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2
        });
        Ext.apply(me, {
            plugins: [me.cellEditing],
            fbar: [
                {
                    xtype: 'tbtext',
                    text: '<span style="color: red">★所在列可双击编辑</span>'
                }
            ]
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'refreshByModelId', me._refreshByModelId, me);
        me.callParent(arguments);
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [
            {
                xtype: 'triggerfield',
                triggerCls: 'x-form-clear-trigger',
                onTriggerClick: function () {
                    this.setValue('');
                    this.up('grid').getStore().clearFilter();
                },
                name: 'filterField',
                emptyText: '输入搜索词',
                width: 250,
                listeners: {
                    change: function (field, newValue) {
                        if (Ext.isEmpty(newValue)) {
                            this.up('grid').getStore().clearFilter();
                        } else {
                            this.up('grid').getStore().filterBy(function (record) {
                                if (record.get('columnName').indexOf(newValue) != -1) {
                                    return true;
                                }
                                return false;
                            });
                        }
                    }
                }
            },
            {
                text: '插入书签',
                iconCls: 'icon-insertBookMark',
                scope: me,
                handler: me._doInsertBookMark
            }
        ];
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '字段名称',
                flex: 1,
                sortable: true,
                dataIndex: 'columnName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '（★）报告处理器',
                width: 150,
                sortable: true,
                dataIndex: 'docHandler',
                filter: {
                    type: 'string'
                },
                editor: {
                    xtype: 'orientComboBox',
                    remoteUrl: serviceName + '/DocHandler/getDocHandlerCombobox.rdm',
                    margin: '0 5 0 0',
                    valueField: 'value'
                }
            }
        ];
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.DocReport.Model.DocColumnExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/DocReports/listColumns.rdm'
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
                    modelId: me.modelId,
                    isView: me.isView
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    _refreshByModelId: function (modelId) {
        var me = this;
        me.modelId = modelId;
        me.getStore().getProxy().setExtraParam('modelId', me.modelId);
        me.fireEvent('refreshGrid');
    },
    _doInsertBookMark: function () {
        //插入书签
        var me = this;
        if (OrientExtUtil.GridHelper.hasSelectedOne(me)) {
            var mainPanel = me.up('docReporChoosePanel');
            var treePanel = mainPanel.down('docModelTree');
            //get current selected tree node
            var currentNode = treePanel.getSelectionModel().getSelection()[0];
            var schemaId = currentNode.get('schemaId');
            var pathArray = currentNode.getPath('text').split('/');
            var realPath = Ext.Array.erase(pathArray,0,2);
            var modelName = realPath.join('★');
            var selectedColumns = OrientExtUtil.GridHelper.getSelectedRecord(me);
            var bookMarkNames = [];
            Ext.each(selectedColumns, function (column) {
                var columnName = column.get('columnName');
                var handler = column.get('docHandler');
                bookMarkNames.push([schemaId, modelName, columnName, handler].join('.'));
            });
            me.doInsert(bookMarkNames);
        }
    },
    doInsert: function (bookMarkNames) {
        var me = this;
        var mainPanel = me.up('docReporChoosePanel');
        //insert into db
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DocReportItems/saveBookMarks.rdm', {
            bookMarkNames: bookMarkNames
        }, true, function (resp) {
            //insert into doc
            var savedBookMarks = resp.decodedData.results;
            var docPreviewPanel = mainPanel.up('docReportMaker').down('docReportViewPanel');
            docPreviewPanel.insertBookMark(savedBookMarks);
        });
    }
});