/**
 * 评论列表面板
 * @author : weilei
 */
define(function (require, exports, module) {

    /**
     * 加载评论列表
     * @param id : 词条Id
     * @param constant
     */
    exports.init = function (id, constant) {

        Ext.QuickTips.init();

        //数据
        var store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                method: 'post',
                url: serviceName + '/commentController/getCommentDataByCommentId.rdm'
            }),
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCounts',
                root: 'result',
                fields: [
                    {
                        xtype: 'string',
                        name: 'commentId'
                    },
                    {
                        xtype: 'string',
                        name: 'commentId'
                    },
                    {
                        xtype: 'string',
                        name: 'commentTheme'
                    },
                    {
                        xtype: 'string',
                        name: 'commentContent'
                    },
                    {
                        xtype: 'string',
                        name: 'commentClassiFicationId'
                    },
                    {
                        xtype: 'string',
                        name: 'commentScore'
                    },
                    {
                        xtype: 'string',
                        name: 'commentAuthor'
                    },
                    {
                        xtype: 'string',
                        name: 'commentCreateTime'
                    }
                ]
            }),
            baseParams: {
                start: constant.constant.om_start,
                limit: constant.constant.om_limit,
                dictionId: id,
                commentModelName: constant.comment.commentModelName
            }
        });

        //工具栏
        var toolBar = new Ext.Toolbar({
            items: [
                {
                    xtype: 'button',
                    text: '刷新',
                    iconCls: 'toolbarrefresh',
                    handler: function () {
                        store.reload({
                            callback: function (records, options, success) {//默认展开摘要信息
                                if (success) {
                                    exports.expandRow(records, expander)
                                }
                            }
                        });
                    }
                }
                , '-',
                {
                    xtype: 'button',
                    text: '删除',
                    iconCls: 'cateToolbarDelete',
                    handler: function () {
                        var selections = curGridPanel.getSelectionModel().getSelections();
                        if (selections.length < 1) {
                            constant.messageBox('请选择一个评论信息！');
                            return;
                        }
                        commentEvent.deleteComment(selections, store, constant);
                    }
                }
            ]
        });

        //答案内容
        var expander = new Ext.ux.grid.RowExpander({
            id: 'myCommentExpander',
            width: 0,
            lazyRender: false,
            expandOnEnter: false,
            enableCaching: false,
            expandOnDblClick: false,
            renderer: function (v, p, record) {
                p.cellAttr = 'rowspan="2"';
                return record.get("data") ? '<div class="x-grid3-row-expander">&#160;</div>' : "";
            },
            tpl: exports.loadRowExpanderXTemplate()
        });

        store.load({
            callback: function (records, options, success) {//默认展开摘要信息
                if (success) {
                    exports.expandRow(records, expander)
                }
            }
        });

        //复选框
        var csm = new Ext.grid.CheckboxSelectionModel({
            listeners: {
                'beforerowselect': function (SelectionModel, rowIndex, keepExisting, record) {
                    return false;
                }
            }
        });

        //序号列
        var rowColumn = new Ext.grid.RowNumberer({
            width: 35,
            header: '序号',
            renderer: function (value, metadata, record, rowIndex) {
                return constant.constant.om_start + 1 + rowIndex;
            }
        });

        //列模型
        var columnModel = new Ext.grid.ColumnModel([
            rowColumn,
            expander,
            {
                hidden: true,
                header: '评论Id',
                dataIndex: 'commentId'
            },
            {
                hidden: true,
                header: '词条Id',
                dataIndex: 'dictionId'
            },
            {
                header: '标题',
                dataIndex: 'commentTheme'
            },
            {
                width: 200,
                header: '内容',
                hidden: true,
                dataIndex: 'commentContent'
            },
            {
                width: 120,
                fixed: true,
                hidden: true,
                header: '分类',
                dataIndex: 'commentClassiFicationId'
            },
            {
                width: 120,
                fixed: true,
                header: '分数',
                hidden: true,
                dataIndex: 'commentScore',
                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
//					return exports.showImage(value);
                }
            },
            {
                width: 120,
                fixed: true,
                header: '作者',
                hidden: true,
                dataIndex: 'commentAuthor'
            },
            {
                width: 150,
                fixed: true,
                hidden: true,
                header: '创建时间',
                dataIndex: 'commentCreateTime'
            }
        ]);

        //分页栏
        var pageBar = new Ext.PagingToolbar({
            store: store,
            pageSize: constant.constant.om_limit,
            emptyMsg: '没有记录。',
            displayMsg: '显示第{0} 条到 {1} 条记录，一共 {2} 条。',
            displayInfo: true,
            prependButtons: true,
            doLoad: function (start) {
                constant.constant.om_start = start;
                var pageSize = this.pageSize;
                store.setBaseParam('start', start);
                store.setBaseParam('limit', pageSize);
                store.reload({
                    callback: function (records, options, success) {//默认展开摘要信息
                        if (success) {
                            exports.expandRow(records, expander)
                        }
                    }
                });
            }
        });

        //评论列表
        var gridPanel = new Ext.grid.GridPanel({
            sm: csm,
//			tbar : toolBar, 
            bbar: pageBar,
            title: '历史评论',
            store: store,
            region: 'center',
            plugins: expander,
            colModel: columnModel,
            loadMask: true,
            closable: true,
            enableHdMenu: false,
            enableColumnHide: false,
            viewConfig: {
                forceFit: true
            }
        });
        return gridPanel;
    };

    /**
     * 设置表格以图片方式显示
     */
    exports.showImage = function (value) {

        var index = parseInt(value);
        var innerHTML = "";
        for (var i = 0; i < index; i++) {
            innerHTML += '<img width="16px" height="16px" alt="" src ="'
                + serviceName + '/app/images/knowledge/score-show.png" />';
        }
        return innerHTML;
    };

    /**
     * 模板（内容+分数+作者+时间）
     */
    exports.loadRowExpanderXTemplate = function () {

        var tpl = new Ext.XTemplate(
            '<p style="margin: 15px 20px 10px 40px !important;">',
            '<b><font color="#555">内容：</font></b>&nbsp;&nbsp;&nbsp;&nbsp;{commentContent}</p>',
            '<p style="margin: 15px 20px 10px 40px !important;">',
            '<b><font color="#555">属性：</font></b>&nbsp;&nbsp;&nbsp;&nbsp;',
            '<b><font color="#083772">评论人：</font></b>{commentAuthor}&nbsp;&nbsp;&nbsp;',
            '<b><font color="#083772">评论时间：</font></b>{commentCreateTime}&nbsp;&nbsp;&nbsp;',
            '<b><font color="#083772">评论分数：</font></b>',
            '<tpl if="commentScore == 1">' + exports.showImage(1) + '</tpl>',
            '<tpl if="commentScore == 2">' + exports.showImage(2) + '</tpl>',
            '<tpl if="commentScore == 3">' + exports.showImage(3) + '</tpl>',
            '<tpl if="commentScore == 4">' + exports.showImage(4) + '</tpl>',
            '<tpl if="commentScore == 5">' + exports.showImage(5) + '</tpl>'
        )
        return tpl;
    };

    /**
     * 默认展开摘要内容
     * @param records:
     * @param expander:
     */
    exports.expandRow = function (records, expander) {
        for (var i = 0; i < records.length; i++) expander.expandRow(i);
    }

    /**
     * 获取当前Grid
     */
    exports.getCommentGridPanel = function () {

        var object = Ext.getCmp('commentGridPanel');
        return object;
    };

    /**
     * 重新加载数据
     */
    exports.reloadData = function (dictionId) {

        var object = Ext.getCmp('commentGridPanel');
        if (object != null && object != undefined) {
            var store = object.getStore();
            store.setBaseParam('dictionId', dictionId);
            store.reload();
        }
    };

});