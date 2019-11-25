/**
 * 文档列表面板
 * @author : weilei
 */
define(function (require, exports, module) {

    //知识管理：全局变量
    var constant = require('../../util/constant');
    //文档表单
    var fileForm = require('./fileForm');
    //文档事件
    var fileEvent = require('./fileEvent');
    //当前grid
    var curGridPanel;
    var nodeId;

    exports.init = function (pNodeId) {

        nodeId = pNodeId;
        Ext.QuickTips.init();

        //数据
        var store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                method: 'post',
                url: serviceName + '/fileController/getFileDataByCategoryId.rdm'
            }),
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCounts',
                root: 'result',
                fields: [
                    {
                        xtype: 'string',
                        name: 'id'
                    },
                    {
                        xtype: 'string',
                        name: 'name'
                    },
                    {
                        xtype: 'string',
                        name: 'keyword'
                    },
                    {
                        xtype: 'string',
                        name: 'defineSummary'
                    },
                    {
                        xtype: 'string',
                        name: 'previewArea'
                    },
                    {
                        xtype: 'string',
                        name: 'security'
                    },
                    {
                        xtype: 'string',
                        name: 'author'
                    },
                    {
                        xtype: 'string',
                        name: 'uploadTime'
                    },
                    {
                        xtype: 'string',
                        name: 'downloadNum'
                    },
                    {
                        xtype: 'string',
                        name: 'clickNum'
                    },
                    {
                        xtype: 'string',
                        name: 'previewNum'
                    },
                    {
                        xtype: 'string',
                        name: 'type'
                    }
                ]
            }),
            baseParams: {
                start: constant.constant.fm_start,
                limit: constant.constant.fm_limit,
                categoryId: nodeId,
                fileModelName: constant.file.fileModelName
            }
        });
        store.load();

        //工具栏
        var toolBar = new Ext.Toolbar({
            hidden: true,
            items: []
        });

        /*根据用户角色权限，控制其操作权限（新增、编辑、删除、下载）*/
        toolBar.on('afterrender', function () {
            if (constant.isHasOperation('文件上传')) {
                toolBar.show();
                toolBar.add({xtype: 'tbseparator'});
                toolBar.add({
                    xtype: 'button',
                    text: '新增',
                    iconCls: 'fileToolbarAdd',
                    handler: function () {
                        fileForm.init('add-file', '新增', '', store, nodeId, constant, fileEvent);
                    }
                });
            }
            if (constant.isHasOperation('数据修改')) {
                toolBar.show();
                toolBar.add({xtype: 'tbseparator'});
                toolBar.add({
                    xtype: 'button',
                    text: '编辑',
                    iconCls: 'fileToolbarEdit',
                    handler: function () {
                        var selections = curGridPanel.getSelectionModel().getSelections();
                        if (selections.length != 1) {
                            constant.messageBox('请选择一个文档！');
                            return;
                        }
                        var record = selections[0];
                        fileForm.init('edit-file', '编辑', record, store, nodeId, constant, fileEvent);
                    }
                });
            }
            if (constant.isHasOperation('数据详情')) {
                toolBar.show();
                toolBar.add({xtype: 'tbseparator'});
                toolBar.add({
                    xtype: 'button',
                    text: '详情',
                    iconCls: 'fileToolbarEdit',
                    handler: function () {
                        var selections = curGridPanel.getSelectionModel().getSelections();
                        if (selections.length != 1) {
                            constant.messageBox('请选择一个文档！');
                            return;
                        }
                        var record = selections[0];
                        fileForm.init('detail-file', '详情', record, store, nodeId, constant, fileEvent);
                    }
                });
            }
            if (constant.isHasOperation('文件删除')) {
                toolBar.show();
                toolBar.add({xtype: 'tbseparator'});
                toolBar.add({
                    xtype: 'button',
                    text: '删除',
                    iconCls: 'fileToolbarDelete',
                    handler: function () {
                        var selections = curGridPanel.getSelectionModel().getSelections();
                        if (selections.length < 1) {
                            constant.messageBox('请选择一个文档！');
                            return;
                        }
                        fileEvent.deleteFile(selections, store, constant);
                    }
                });
            }
            if (constant.isHasOperation('文件下载')) {
                toolBar.show();
                toolBar.add({xtype: 'tbseparator'});
                toolBar.add({
                    text: '下载',
                    iconCls: 'fileToolbarDown',
                    handler: function () {
                        var selections = curGridPanel.getSelectionModel().getSelections();
                        if (selections.length < 1) {
                            constant.messageBox('请选择一个文档！');
                            return;
                        }
                        fileEvent.downloadFile(selections, store, constant);
                    }
                });
            }
            if (constant.isHasOperation('查看历史版本')) {
                toolBar.show();
                toolBar.add({xtype: 'tbseparator'});
                toolBar.add({
                    text: '查看历史版本',
                    iconCls: 'fileToolbarDown',
                    handler: function () {
                        var selections = curGridPanel.getSelectionModel().getSelections();
                        if (selections.length < 1) {
                            constant.messageBox('请选择一个文档！');
                            return;
                        }
                        fileEvent.checkHistoryVersion(selections, store, constant);
                    }
                });
            }
        });

        //复选框
        var csm = new Ext.grid.CheckboxSelectionModel();

        //序号列
        var rowColumn = new Ext.grid.RowNumberer({
            width: 35,
            header: '序号',
            renderer: function (value, metadata, record, rowIndex) {
                return constant.constant.fm_start + 1 + rowIndex;
            }
        });

        //列模型
        var columnModel = new Ext.grid.ColumnModel([
            csm,
            rowColumn,
            {
                hidden: true,
                dataIndex: 'id'
            },
            {
                width: 200,
                fixed: true,
                header: '文档名称',
                dataIndex: 'name',
                renderer: function (value, metedata, record, rowIndex, colIndex, store) {
                    return value + "." + record.data.type;
                }
            },
            {
                width: 200,
                header: '文档关键字',
                dataIndex: 'keyword'
            },
            {
                width: 300,
                header: '文档摘要',
                dataIndex: 'defineSummary'
            },
            {
                width: 100,
                fixed: true,
                header: '文档可见范围',
                dataIndex: 'previewArea'
            },
            {
                width: 100,
                fixed: true,
                header: '文档密级',
                dataIndex: 'security'
            },
            {
                width: 100,
                fixed: true,
                header: '作者',
                dataIndex: 'author'
            },
            {
                width: 150,
                fixed: true,
                header: '创建时间',
                dataIndex: 'uploadTime'
            },
            {
                width: 100,
                fixed: true,
                hidden: true,
                header: '下载次数',
                dataIndex: 'downloadNum'
            },
            {
                width: 100,
                fixed: true,
                header: '点击次数',
                hidden: true,
                dataIndex: 'clickNum'
            },
            {
                width: 100,
                fixed: true,
                hidden: true,
                header: '预览次数',
                dataIndex: 'previewNum'
            },
            {
                hidden: true,
                dataIndex: 'type'
            },
            {
                header: '预览',
                xtype: 'actioncolumn',
                width: 40,
                fixed: true,
                items: [
                    {
                        tooltip: '预览文件',
                        handler: function (grid, rowIndex, colIndex, o, event) {

                            var selectRecord = store.getAt(rowIndex);
                            var fileId = selectRecord.data.id;
                            var fileType = selectRecord.data.type;
                            var fileName = selectRecord.data.name;
                            var clickNum = selectRecord.data.clickNum;
                            fileEvent.previewFile(fileId, fileType, constant);
                        }
                    }
                ],
                renderer: function (v, meta, record) {

                    var fileType = record.data.type;
                    if (constant.images.imageType.indexOf(fileType) != -1) this.items[0].icon = constant.images.icon_image;
                    else if (constant.images.vedioType.indexOf(fileType) != -1) this.items[0].icon = constant.images.icon_vedio;
                    else if (constant.images.officeType.indexOf(fileType) != -1) this.items[0].icon = constant.images.icon_office;
                    else if (constant.images.pdfType.indexOf(fileType) != -1) this.items[0].icon = constant.images.icon_pdf;
                    else this.items[0].icon = constant.images.icon_text;
                }
            }
        ]);

        //分页栏
        var pageBar = new Ext.PagingToolbar({
            store: store,
            pageSize: constant.constant.fm_limit,
            emptyMsg: '没有记录。',
            displayMsg: '显示第{0} 条到 {1} 条记录，一共 {2} 条。',
            displayInfo: true,
            prependButtons: true,
            doLoad: function (start) {
                constant.constant.fm_start = start;
                var pageSize = this.pageSize;
                store.setBaseParam('start', start);
                store.setBaseParam('limit', pageSize);
                store.reload();
            }
        });

        //文档列表
        var gridPanel = new Ext.grid.GridPanel({
            id: 'fileGridPanel',
            sm: csm,
            tbar: toolBar,
            bbar: pageBar,
            store: store,
            height: 300,
            split: true,
            title: '文档列表',
            region: 'north',
            colModel: columnModel,
            loadMask: true,
            closable: false,
            collapsible: true,
            enableHdMenu: false,
            enableColumnHide: false,
            viewConfig: {
                forceFit: true
            }
        });
        curGridPanel = gridPanel;

        return gridPanel;
    };

    /**
     * 重新加载数据
     */
    exports.reloadData = function (pNodeId) {

        nodeId = pNodeId;
        var object = Ext.getCmp('fileGridPanel');
        if (object != null && object != undefined) {
            var store = object.getStore();
            store.setBaseParam('categoryId', nodeId);
            store.reload();
        }
    };
});