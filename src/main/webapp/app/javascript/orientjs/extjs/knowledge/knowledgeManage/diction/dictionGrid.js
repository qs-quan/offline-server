/**
 * 词条列表面板
 * @author : weilei
 */
define(function (require, exports, module) {

    //词条表单
    var dictionForm = require('./dictionForm');
    //词条明细
    var dictionDetail = require('./dictionDetail');
    //词条事件
    var dictionEvent = require('./dictionEvent');
    //评论窗体
    var commentWnd = require('../comment/commentWnd');
    //当前grid
    var curGridPanel;
    var nodeId;

    /**
     * Grid初始化
     * @param pNodeId :
        * @param constant :
        * @param isShow :
        *            false：不显示工具栏、摘要；反之。
     */
    exports.init = function (pNodeId, constant, isShow) {

        nodeId = pNodeId;
        Ext.QuickTips.init();

        //数据
        var store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                method: 'post',
                url: serviceName + '/dictionController/getDictionDataByCategoryId.rdm'
            }),
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCounts',
                root: 'result',
                fields: [
                    {
                        xtype: 'string',
                        name: 'dictionId'
                    },
                    {
                        xtype: 'string',
                        name: 'categoryId'
                    },
                    {
                        xtype: 'string',
                        name: 'dictionName'
                    },
                    {
                        xtype: 'string',
                        name: 'dictionSolution'
                    },
                    {
                        xtype: 'string',
                        name: 'dictionOriginalSolution'
                    },
                    {
                        xtype: 'string',
                        name: 'dictionAuthor'
                    },
                    {
                        xtype: 'string',
                        name: 'dictionCreateTime'
                    },
                    {
                        xtype: 'string',
                        name: 'dictionClickNum'
                    }
                ]
            }),
            baseParams: {
                start: constant.constant.dm_start,
                limit: constant.constant.dm_limit,
                categoryId: nodeId,
                dictionModelName: constant.diction.dictionModelName
            }
        });
        store.load();

        //工具栏
        var toolBar = new Ext.Toolbar({
            items: []
        });

        /*根据用户角色权限，控制其操作权限（新增、编辑、删除）*/
        toolBar.on('afterrender', function () {

            if (constant.isHasOperation('数据录入')) {
                toolBar.add({xtype: 'tbseparator'});
                toolBar.add({
                    xtype: 'button',
                    text: '新增',
                    iconCls: 'dicToolbarAdd',
                    handler: function () {
                        dictionForm.init('add-diction', '新增', '', store, nodeId, dictionEvent, constant);
                    }
                });
            }
            if (constant.isHasOperation('数据修改')) {
                toolBar.add({xtype: 'tbseparator'});
                toolBar.add({
                    xtype: 'button',
                    text: '编辑',
                    iconCls: 'dicToolbarEdit',
                    handler: function () {
                        var selections = curGridPanel.getSelectionModel().getSelections();
                        if (selections.length != 1) {
                            constant.messageBox('请选择一个词条！');
                            return;
                        }
                        var record = selections[0];
                        dictionForm.init('edit-diction', '编辑', record, store, nodeId, dictionEvent, constant);
                    }
                });
            }
            if (constant.isHasOperation('数据删除')) {
                toolBar.add({xtype: 'tbseparator'});
                toolBar.add({
                    xtype: 'button',
                    text: '删除',
                    iconCls: 'dicToolbarDelete',
                    handler: function () {
                        var selections = curGridPanel.getSelectionModel().getSelections();
                        if (selections.length < 1) {
                            constant.messageBox('请选择一个词条！');
                            return;
                        }
                        dictionEvent.deleteDiction(selections, store, constant);
                    }
                });
            }

            toolBar.add({xtype: 'tbfill'});
            toolBar.add({
                xtype: 'label',
                text: '排序：'
            });
            toolBar.add({xtype: 'tbseparator'});
            toolBar.add({
                id: 'sort_dictionCreateTime',
                text: '创建时间',
                handler: function () {
                    dictionEvent.changeIconAndText(this);
                    dictionEvent.sortData(this, store, constant, nodeId);
                }
            });
            toolBar.add({xtype: 'tbseparator'});
            toolBar.add({
                id: 'sort_dictionCommentScore',
                text: '评论分数',
                handler: function () {
                    dictionEvent.changeIconAndText(this);
                    dictionEvent.sortData(this, store, constant, nodeId);
                }
            });
            toolBar.add({xtype: 'tbseparator'});
            toolBar.add({
                id: 'sort_dictionClickNum',
                text: '点击次数',
                handler: function () {
                    dictionEvent.changeIconAndText(this);
                    dictionEvent.sortData(this, store, constant, nodeId);
                }
            });
        });

        //复选框
        var csm = new Ext.grid.CheckboxSelectionModel();

        //序号列
        var rowColumn = new Ext.grid.RowNumberer({
            width: 35,
            header: '序号',
            renderer: function (value, metadata, record, rowIndex) {
                return constant.constant.dm_start + 1 + rowIndex;
            }
        });

        //列模型
        var columnModel = new Ext.grid.ColumnModel([
            csm,
            rowColumn,
            {
                width: 50,
                fixed: true,
                header: '词条Id',
                hidden: true,
                dataIndex: 'dictionId'
            },
            {
                width: 200,
                fixed: true,
                hidden: true,
                header: '类别Id',
                dataIndex: 'categoryId'
            },
            {
                width: 200,
                fixed: true,
                header: '问题',
                dataIndex: 'dictionName'
            },
            {
                header: '答案',
                dataIndex: 'dictionSolution',
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    var ret = "";
                    if (value.indexOf('<br>') > 0) {
                        ret = value.substring(0, value.indexOf('<br>'));
                        ret += "...";
                    }
                    return ret;
                }
            },
            {
                header: '答案原始值',
                hidden: true,
                dataIndex: 'dictionOriginalSolution'
            },
            {
                width: 150,
                fixed: true,
                header: '作者',
                dataIndex: 'dictionAuthor'
            },
            {
                width: 150,
                fixed: true,
                header: '创建时间',
                dataIndex: 'dictionCreateTime'
            },
            {
                width: 150,
                fixed: true,
                hidden: true,
                header: '点击次数',
                dataIndex: 'dictionClickNum'
            },
            {
                header: '详细',
                xtype: 'actioncolumn',
                width: 40,
                fixed: true,
                items: [{
                    icon: serviceName + '/app/images/knowledge/detail.png',
                    tooltip: '词条详细',
                    handler: function (gird, rowIndex, colIndex, o, event) {
                        var record = store.getAt(rowIndex)
                            , id = record.data.dictionId
                            , name = record.data.dictionName
                            , solution = record.data.dictionSolution;
                        dictionDetail.init(id, name, solution, constant);
                    }
                }]
            },
            {
                header: '评论',
                xtype: 'actioncolumn',
                width: 40,
                fixed: true,
                items: [{
                    icon: serviceName + '/app/images/knowledge/comment.png',
                    tooltip: '词条评论',
                    handler: function (grid, rowIndex, colIndex, o, event) {
                        var record = store.getAt(rowIndex);
                        dictionEvent.saveDictionClickNum(record.data.dictionId, constant);
                        commentWnd.init(record.data.dictionId);
                    }
                }]
            }
        ]);

        //分页栏
        var pageBar = new Ext.PagingToolbar({
            store: store,
            pageSize: constant.constant.dm_limit,
            emptyMsg: '没有记录。',
            displayMsg: '显示第{0} 条到 {1} 条记录，一共 {2} 条。',
            displayInfo: true,
            prependButtons: true,
            doLoad: function (start) {
                constant.constant.dm_start = start;
                var pageSize = this.pageSize;
                store.setBaseParam('start', start);
                store.setBaseParam('limit', pageSize);
                store.reload();
            }
        });

        //词条列表
        var gridPanel = new Ext.grid.GridPanel({
            id: 'dicGridPanel',
            sm: csm,
            tbar: toolBar,
            bbar: pageBar,
            store: store,
            split: true,
            region: 'center',
            colModel: columnModel,
            loadMask: true,
            enableHdMenu: false,
            enableColumnHide: false,
            viewConfig: {
                forceFit: true
            }
        });
        if ('false' == isShow) {
            gridPanel.getTopToolbar().hide();
            columnModel.setHidden(10, true);
            columnModel.setHidden(11, true);
        }
        curGridPanel = gridPanel;

        return gridPanel;
    };

    /**
     * 重新加载数据
     */
    exports.reloadData = function (pNodeId) {

        nodeId = pNodeId;
        var object = Ext.getCmp('dicGridPanel');
        if (object != null && object != undefined) {
            var store = object.getStore();
            store.setBaseParam('categoryId', nodeId);
            store.reload();
        }
        dictionEvent.clearSortData();
    };
});