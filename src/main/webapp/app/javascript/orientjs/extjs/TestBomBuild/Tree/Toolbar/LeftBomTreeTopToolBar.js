/**
 * 构造试验数据管理 bom 树的左侧按钮栏
 */
Ext.define("OrientTdm.TestBomBuild.Tree.Toolbar.LeftBomTreeTopToolBar", {
    extend: 'Ext.Base',

    constructor: function (config) {
        this.scope = config.scope;
        var local = this;
        var me = config.scope;

        this.toolbar = [{
            xtype: 'tbspacer'
        }, {
            xtype: 'trigger',
            style: {
                margin: '0 0 0 22'
            },
            triggerCls: 'x-form-clear-trigger',
            onTriggerClick: function () {
                this.setValue('');
                me.clearFilter();
            },
            emptyText: '快速搜索已展开的节点)',
            width: "60%",
            enableKeyEvents: true,
            listeners: {
                keyup: function (field, e) {
                    if (Ext.EventObject.ESC == e.getKey()) {
                        field.onTriggerClick();
                    } else {
                        me.filterByText(this.getRawValue(), 'text');
                    }
                }
            }
        }, ' ', {
            iconCls: 'icon-refresh',
            text: '刷新',
            itemId: 'refresh',
            scope: this,
            handler: local.doRefresh
        }, {
            xtype: "button",
            text: "生成报告",
            iconCls: 'icon-generateDoc',
            disabled: false,
            handler: function () {
                local._documentGeneration();
            }
        }];
    },

    /**
     * 刷新操作
     */
    doRefresh: function () {
        var me = this.scope;

        var selectNode = OrientExtUtil.TreeHelper.getSelectNodes(me);
        if (selectNode.length == 0) {
            me.fireEvent('initTboms');
        } else {
            selectNode = selectNode[0];
            var childNodes = selectNode.childNodes;
            for (var i = childNodes.length - 1; i >= 0; i--) {
                selectNode.removeChild(childNodes[i]);
            }
            selectNode.store.load({node: selectNode});
        }
    },

    /**
     * 生成文档
     * @private
     */
    _documentGeneration: function () {
        var me = this.scope;

        var parentNode = me.selModel.selected.items[0];
        //
        // var dataIds = OrientExtUtil.GridHelper.getSelectRecordIds(me);
        // var modelId = OrientExtUtil.ModelHelper.getModelId("T_RW_INFO", OrientExtUtil.FunctionHelper.getSchemaId(), false);
        var listPanel = Ext.create('OrientTdm.TestInfo.ReportTemplate.ReportTemplateMgrDashBoard', {
            hasBar: false,
            region: 'center',
            padding: '0 0 0 5',
            title: '报告模板'
        });

        /* var listPanel = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.DocReportGridpanel', {
             modelId: modelId,
             region: 'center',
             padding: '0 0 0 5',
             title: '报告模板'
         });*/

        var win = Ext.create('widget.window',{
            title: '选择报告模板',
            width: 0.5 * globalWidth,
            height: 0.5 * globalHeight,
            buttonAlign: 'center',
            modal: true,
            layout: 'fit',
            items: [
                listPanel
            ],
            buttons: [{
                xtype: "button",
                text: "确定",
                handler: function () {
                    // 判断里面进行了不是选中一条后的tip提示的处理，所以直接返回
                    // if (!OrientExtUtil.GridHelper.hasSelectedOne(listPanel)) {
                    //     return;
                    // }
                    // var reportId = OrientExtUtil.GridHelper.getSelectRecordIds(listPanel).join(",");
                    // OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DocReports/generateReportSpecial.rdm',{
                    //     reportId: reportId,
                    //     nodeId: parentNode.raw.id,
                    //     dataIds: parentNode.raw.dataId
                    // },false, function (response) {
                    //     var path = 'DocTemplate' +'%2F' + response.decodedData;
                    //     OrientExtUtil.FileHelper.doDownloadByFilePath(path, parentNode.raw.text + ".doc");
                    //     win.close();
                    // })

                    /*
                        modify by zhaoyang
                     */
                    var wordPanel = Ext.create('OrientTdm.BackgroundMgr.DocReport.Power.PowerDocPreviewPanel',{
                        testTypeId: parentNode.raw.dataId,
                        templateId: OrientExtUtil.GridHelper.getSelectRecordIds(listPanel.down('reportTemplateList')).join(","),
                        flex:2,
                        testTypeNodeId: parentNode.raw.id
                    });
                    new Ext.Window({
                        width: 0.8* globalWidth,
                        height: 0.9 * globalHeight,
                        layout:'fit',
                        constrain:true,
                        constrainHeader:true,
                        modal:true,
                        plain:true,
                        autoScroll:true, // 滚动条设置
                        items:[wordPanel],
                        listeners:{
                            'beforeclose': function () {
                                win.close();
                            }
                        }
                    }).show();
                }
            }]
        }).show();
    }

});