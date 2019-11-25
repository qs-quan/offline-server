/**
 * 全文检索列表面板
 * @author : weilei
 */
define(function (require, exports, module) {

    //文档事件
    var fileEvent = require('./fullTextEvent');
    //当前grid
    var curGridPanel;

    /**
     * Grid初始化
     * @param constant:
     * @param isShow :
        *            false：不显示工具栏、摘要；反之。
     */
    exports.init = function (constant, isShow) {

        Ext.QuickTips.init();

        //数据
        var store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                method: 'post',
                url: serviceName + '/fullTextController/searchFileData.rdm'
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
                        name: 'location'
                    },
                    {
                        xtype: 'string',
                        name: 'keyword'
                    },
                    {
                        xtype: 'string',
                        name: 'summary'
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
                        name: 'uploadUserId'
                    },
                    {
                        xtype: 'string',
                        name: 'createTime'
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
            })
        });

        //工具栏
        var toolBar = new Ext.Toolbar({
            items: [
                '->',
                {
                    xtype: 'label',
                    text: '排序：'
                }, '-',
                {
                    id: 'sort_fileMaching',
                    text: '关键词匹配度',
                    handler: function () {
                        fileEvent.changeIconAndText(this);
                        fileEvent.sortData(this, store, constant);
                    }
                }, '-',
                {
                    id: 'sort_fileCreateTime',
                    text: '创建时间',
                    handler: function () {
                        fileEvent.changeIconAndText(this);
                        fileEvent.sortData(this, store, constant);
                    }
                }, '-',
                {
                    id: 'sort_fileClickNum',
                    text: '点击次数',
                    handler: function () {
                        fileEvent.changeIconAndText(this);
                        fileEvent.sortData(this, store, constant);
                    }
                }
            ]
        });

        //复选框
        var csm = new Ext.grid.CheckboxSelectionModel({
            listeners: {
                'beforerowselect': function (SelectionModel, rowIndex, keepExisting, record) {
                    if ('false' == isShow) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        });

        //序号列
        var rowColumn = new Ext.grid.RowNumberer({
            width: 35,
            header: '序号',
            renderer: function (value, metadata, record, rowIndex) {
                return constant.constant.fm_start + 1 + rowIndex;
            }
        });

        //摘要
        var expander = fileEvent.initRowExpander(isShow);
        constant.constant.myExpander = expander;

        //列模型
        var columnModel = new Ext.grid.ColumnModel([
            csm,
            rowColumn,
            expander,
            {
                hidden: true,
                dataIndex: 'id'
            },
            {
                width: 300,
                fixed: true,
                header: '文档名称',
                dataIndex: 'name'
            },
            {
                width: 300,
                hidden: true,
                fixed: true,
                header: '文档真实路径',
                dataIndex: 'location'
            },
            {
                width: 200,
                header: '自定义关键字',
                hidden: true,
                dataIndex: 'keyword'
            },
            {
                width: 200,
                hidden: true,
                header: '文档摘要',
                dataIndex: 'summary'
            },
            {
                width: 200,
                header: '自定义摘要',
                dataIndex: 'defineSummary'
            },
            {
                width: 150,
                fixed: true,
                hidden: true,
                header: '文档可见范围',
                dataIndex: 'previewArea'
            },
            {
                width: 150,
                fixed: true,
                hidden: true,
                header: '文档密级',
                dataIndex: 'security'
            },
            {
                width: 150,
                fixed: true,
                hidden: true,
                header: '作者',
                dataIndex: 'uploadUserId'
            },
            {
                width: 150,
                fixed: true,
                hidden: true,
                header: '创建时间',
                dataIndex: 'createTime'
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
                hidden: true,
                header: '点击次数',
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
                width: 100,
                fixed: true,
                hidden: true,
                header: '文档类型',
                dataIndex: 'type'
            },
            {
                id: 'filePreview',
                header: '预览',
                hidden: true,
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
                constant.constant.ft_start = start;
                var pageSize = this.pageSize;
                store.setBaseParam('start', start);
                store.setBaseParam('limit', pageSize);
                if (fileEvent.isValid()) return;
                store.reload({
                    callback: function (records, options, success) {//默认展开摘要信息
                        if (success) {
                            fileEvent.expandRow(records, expander)
                        }
                    }
                });
            }
        });

        //文档列表
        var gridPanel = new Ext.grid.GridPanel({
            id: 'fullTextPanel',
            sm: csm,
            tbar: toolBar,
            bbar: pageBar,
            store: store,
            split: true,
            region: 'center',
            plugins: expander,
            colModel: columnModel,
            loadMask: true,
            header: true,
            enableHdMenu: false,
            enableColumnHide: false,
            viewConfig: {
                forceFit: true
            }
        });
        if ('false' == isShow) {
            gridPanel.getTopToolbar().hide();
        } else {
            gridPanel.setTitle('检索结果');
            columnModel.setHidden(0, true);
        }
        curGridPanel = gridPanel;

        return gridPanel;
    };

    /**
     * 重新加载数据
     */
    exports.reloadData = function (nodeId) {

        var object = Ext.getCmp('fullTextPanel');
        if (object != null && object != undefined) {
            var store = object.getStore();
            store.reload();
        }
        fileEvent.clearSortData();
    };
});