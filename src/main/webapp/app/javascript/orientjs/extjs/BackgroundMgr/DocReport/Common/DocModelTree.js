Ext.define('OrientTdm.BackgroundMgr.DocReport.Common.DocModelTree', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.docModelTree',
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    config: {
        mainModelId: ''
    },
    requires: [
        'OrientTdm.BackgroundMgr.DocReport.Model.DocModelExtModel'
    ],
    columns: [
        {xtype: 'treecolumn', text: '模型名称', dataIndex: 'text', flex: 1},
        {
            text: '（★）报告处理器',
            dataIndex: 'docHandler',
            width: 150,
            editor: {
                xtype: 'orientComboBox',
                remoteUrl: serviceName + '/DocHandler/getDocHandlerCombobox.rdm',
                margin: '0 5 0 0',
                valueField: 'value'
            }
        }
    ],
    itemClickListener: function (tree, record, item) {
        var me = this;
        var modelId = record.get('modelId');
        var mainPanel = me.up('docReporChoosePanel');
        mainPanel.fireEvent('refreshColumnGrid', modelId);
    },
    createFooBar: function () {
        return Ext.emptyFn;
    },
    createStore: function () {
        var me = this;
        var retVal = new Ext.data.TreeStore({
            model: 'OrientTdm.BackgroundMgr.DocReport.Model.DocModelExtModel',
            proxy: {
                type: 'ajax',
                url: serviceName + '/DocReports/getRelatedModels.rdm',
                extraParams: {
                    mainModelId: me.mainModelId
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            }
        });
        return retVal;
    },
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            xtype: 'trigger',
            width: 250,
            triggerCls: 'x-form-clear-trigger',
            onTriggerClick: function () {
                this.setValue('');
                me.clearFilter();
            },
            emptyText: '快速搜索',
            enableKeyEvents: true,
            listeners: {
                keyup: function (field, e) {
                    if (Ext.EventObject.ESC == e.getKey()) {
                        field.onTriggerClick();
                    } else {
                        me.filterByText(this.getRawValue(), "text");
                    }
                }
            }
        },
            {
                text: '插入表格',
                iconCls: 'icon-insertGridBookMark',
                scope: me,
                handler: me._insertGridBookMark
            }
        ];
        return retVal;
    },
    initComponent: function () {
        var me = this;
        me.addEvents({
            reConfig: true
        });
        me.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2
        });
        Ext.apply(me, {
            plugins: [me.cellEditing]
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'select', me.itemClickListener, me);
        me.mon(me, 'reConfig', me.reConfig, me);
    },
    reConfig: function () {
        var me = this;
        me.getStore().getProxy().setExtraParam('mainModelId', me.mainModelId);

        me.fireEvent('refreshTree', false);
    },
    _insertGridBookMark: function () {
        var me = this;
        var mainPanel = me.up('docReporChoosePanel');
        var treePanel = mainPanel.down('docModelTree');
        //get current selected tree node
        var currentNode = treePanel.getSelectionModel().getSelection()[0];
        //append the path
        var pathArray = currentNode.getPath('text').split('/');
        var realPath = Ext.Array.erase(pathArray,0,2);
        var schemaId = currentNode.get('schemaId');
        var modelName = realPath.join('★');
        var handler = currentNode.get('docHandler');
        var bookMarkName = [schemaId, modelName, handler].join('.');
        var bookMarkNames = [bookMarkName];
        me.doInsert(bookMarkNames);
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