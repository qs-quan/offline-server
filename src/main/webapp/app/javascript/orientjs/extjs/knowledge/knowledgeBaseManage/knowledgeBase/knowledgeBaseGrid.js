/**
 * 知识库维护主界面
 * @author : weilei
 */
define(function (require, exports, module) {

    //知识管理：全局变量
    var constant = require('../../util/constant');
    //通用方法
    var commomEvent = require('../commonEvent');
    //知识库维护：From
    var knowledgeBaseForm = require('./knowledgeBaseForm');
    //知识库维护：操作
    var knowledgeBaseEvent = require('./knowledgeBaseEvent');

    /**
     * 表格初始化
     */
    exports.init = function (nodeId) {

        Ext.QuickTips.init();

        //加载数据
        var store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                method: 'post',
                url: serviceName + '/categoryController/getAllCategory.rdm'
            }),
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCounts',
                root: 'result',
                fields: [
                    {
                        xtype: 'string',
                        name: 'categoryId'
                    },
                    {
                        xtype: 'string',
                        name: 'categoryName'
                    },
                    {
                        xtype: 'string',
                        name: 'categoryKeyWord'
                    },
                    {
                        xtype: 'string',
                        name: 'categoryDescribe'
                    },
                    {
                        xtype: 'string',
                        name: 'categoryAuthor'
                    },
                    {
                        xtype: 'string',
                        name: 'categoryCreateTime'
                    },
                    {
                        xtype: 'string',
                        name: 'categoryParentId'
                    }
                ]
            }),
            baseParams: {
                start: constant.constant.cm_start,
                limit: constant.constant.cm_limit,
                rootId: constant.constant.categoryParentId,
                categoryModelName: constant.category.categoryModelName
            }
        });
        store.load();

        //工具栏
        var toolBar = new Ext.Toolbar({
            hidden: true,
            items: []
        });

        /*根据用户角色权限，控制其操作权限（新增、编辑、删除）*/
        toolBar.on('afterrender', function () {

            if (constant.isHasOperation('数据录入')) {
                toolBar.show();
                toolBar.add({xtype: 'tbseparator'});
                toolBar.add({
                    xtype: 'button',
                    text: '新增',
                    iconCls: 'cateToolbarAdd',
                    handler: function () {
                        var record = '';
                        knowledgeBaseForm.initForm('add-category', '新增', record, store, knowledgeBaseEvent, constant, commomEvent);
                    }
                });
            }
            if (constant.isHasOperation('数据修改')) {
                toolBar.show();
                toolBar.add({xtype: 'tbseparator'});
                toolBar.add({
                    xtype: 'button',
                    text: '编辑',
                    iconCls: 'cateToolbarEdit',
                    handler: function () {
                        var gridPanel = Ext.getCmp('categoryProtectorGrid');
                        var selections = gridPanel.getSelectionModel().getSelections();
                        if (selections.length != 1) {
                            constant.messageBox('请选择一个知识库！');
                            return;
                        }
                        var record = selections[0];
                        knowledgeBaseForm.initForm('edit-category', '编辑', record, store, knowledgeBaseEvent, constant, commomEvent);
                    }
                });
            }
            if (constant.isHasOperation('数据删除')) {
                toolBar.show();
                toolBar.add({xtype: 'tbseparator'});
                toolBar.add({
                    xtype: 'button',
                    text: '删除',
                    iconCls: 'cateToolbarDelete',
                    handler: function (grid, rowIndex, colIndex, o, event) {
                        var gridPanel = Ext.getCmp('categoryProtectorGrid');
                        var selections = gridPanel.getSelectionModel().getSelections();
                        if (selections.length < 1) {
                            constant.messageBox('请选择一个知识库！');
                            return;
                        }
                        var cateModelName = constant.category.categoryModelName;
                        knowledgeBaseEvent.deleteCategory(selections, store, commomEvent, constant);
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
                return constant.constant.cm_start + 1 + rowIndex;
            }
        });

        //列模型
        var columnModel = new Ext.grid.ColumnModel([
            csm,
            rowColumn,
            {
                width: 50,
                fixed: true,
                header: '知识库Id',
                hidden: true,
                dataIndex: 'categoryId'
            },
            {
                width: 200,
                fixed: true,
                header: '名称',
                dataIndex: 'categoryName'
            },
            {
                width: 200,
                header: '关键词',
                dataIndex: 'categoryKeyWord'
            },
            {
                width: 300,
                header: '描述',
                dataIndex: 'categoryDescribe'
            },
            {
                width: 150,
                fixed: true,
                header: '作者',
                dataIndex: 'categoryAuthor'
            },
            {
                width: 150,
                fixed: true,
                header: '创建时间',
                dataIndex: 'categoryCreateTime'
            },
            {
                width: 50,
                fixed: true,
                header: '父Id',
                hidden: true,
                dataIndex: 'categoryParentId'
            }
        ]);

        //分页栏
        var pageBar = new Ext.PagingToolbar({
            store: store,
            pageSize: constant.constant.cm_limit,
            emptyMsg: '没有记录。',
            displayMsg: '显示第{0} 条到 {1} 条记录，一共 {2} 条。',
            displayInfo: true,
            prependButtons: true,
            doLoad: function (start) {
                constant.constant.cm_start = start;
                var pageSize = this.pageSize;
                store.setBaseParam('start', start);
                store.setBaseParam('limit', pageSize);
                store.reload();
            }
        });

        //数据显示面板
        var gridPanel = new Ext.grid.GridPanel({
            id: 'categoryProtectorGrid',
            sm: csm,
            tbar: toolBar,
            bbar: pageBar,
            store: store,
            layout: 'fit',
            title: '知识库维护',
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
     * 判断Tab面板是否存在
     */
    exports.isExistPanel = function (nodeId) {

        var object = Ext.getCmp('categoryProtectorGrid');
        if (null == object || undefined == object) {
            return null;
        }
        return object;
    }

});