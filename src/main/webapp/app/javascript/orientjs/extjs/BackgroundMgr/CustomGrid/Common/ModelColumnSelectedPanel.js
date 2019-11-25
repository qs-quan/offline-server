/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.CustomGrid.Common.ModelColumnSelectedPanel', {
    extend: "Ext.container.Container",
    alias: 'widget.modelColumnSelectedPanel',
    //是否需要重新加载
    needReconfig: false,
    requires: [
        "OrientTdm.BackgroundMgr.CustomGrid.Model.ColumnDescExtModel"
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    initComponent: function () {
        var me = this;
        var unSelectedGroup = this.id + 'unSelected';
        var selectedGroup = this.id + 'selected';
        var columns = [{
            text: '名称',
            flex: 1,
            sortable: true,
            dataIndex: 'text'
        }, {
            text: '类型',
            sortable: true,
            dataIndex: 'type',
            renderer: OrientModelHelper.columnTypeRenderer
        }];
        var unSelectedGrid = me.createGrid("unSelectedGrid", columns, unSelectedGroup, selectedGroup);
        var selectedGrid = me.createGrid("selectedGrid", columns, selectedGroup, unSelectedGroup);
        var buttonPanel = me.createButtonPanel();
        Ext.apply(me, {
            items: [unSelectedGrid, buttonPanel, selectedGrid]
        });
        me.callParent(arguments);
        me.addEvents("moveUp", "moveDown", "moveToRight", "moveToLeft");
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'moveUp', me.doMoveUp, me);
        me.mon(me, 'moveDown', me.doMoveDown, me);
        me.mon(me, 'moveToRight', me.doMoveToRight, me);
        me.mon(me, 'moveToLeft', me.doMoveToLeft, me);
    },
    doMoveUp: function () {
        var selectedGrid = this.down("#selectedGrid");
        var selectedStore = selectedGrid.getStore();
        //获取选中记录
        var selectedRecords = selectedGrid.getSelectionModel().getSelection();
        if (selectedRecords.length == 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, "请至少选择一条已选字段记录");
        } else {
            var indexRecords = [];
            for(var i=0;i<selectedRecords.length;i++) {
                var index = selectedStore.indexOf(selectedRecords[i]);
                indexRecords[index] = selectedRecords[i];
            }

            if (!indexRecords[0]) {
                for(var i=0;i<indexRecords.length;i++) {
                    if(indexRecords[i]) {
                        selectedStore.remove(indexRecords[i]);
                        selectedStore.insert(i - 1, indexRecords[i]);
                    }
                }
                selectedGrid.getSelectionModel().select(selectedRecords);
            } else {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.alreadyTop);
            }
        }
    },
    doMoveDown: function () {
        var selectedGrid = this.down("#selectedGrid");
        var selectedStore = selectedGrid.getStore();
        //获取选中记录
        var selectedRecords = selectedGrid.getSelectionModel().getSelection();
        if (selectedRecords.length == 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, "请至少选择一条已选字段记录");
        } else {
            var indexRecords = [];
            indexRecords[selectedStore.count()-1] = false;
            for(var i=0;i<selectedRecords.length;i++) {
                var index = selectedStore.indexOf(selectedRecords[i]);
                indexRecords[index] = selectedRecords[i];
            }

            if (!indexRecords[selectedStore.count()-1]) {
                for(var i=indexRecords.length-1;i>=0;i--) {
                    if(indexRecords[i]) {
                        selectedStore.remove(indexRecords[i]);
                        selectedStore.insert(i + 1, indexRecords[i]);
                    }
                }
                selectedGrid.getSelectionModel().select(selectedRecords);
            } else {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.alreadyBottom);
            }
        }
    },
    doMoveToRight: function () {
        var unSelectedGrid = this.down("#unSelectedGrid");
        var unSelectedStore = unSelectedGrid.getStore();
        //获取选中记录
        var unSelectedRecords = unSelectedGrid.getSelectionModel().getSelection();
        if (unSelectedRecords.length == 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, "请至少选择一条未选字段记录");
        } else {
            var selectedGrid = this.down("#selectedGrid");
            var selectedStore = selectedGrid.getStore();
            selectedStore.add(unSelectedRecords);
            unSelectedStore.remove(unSelectedRecords);
        }
    },
    doMoveToLeft: function () {
        var selectedGrid = this.down("#selectedGrid");
        var selectedStore = selectedGrid.getStore();
        //获取选中记录
        var selectedRecords = selectedGrid.getSelectionModel().getSelection();
        if (selectedRecords.length == 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, "请至少选择一条已选字段记录");
        } else {
            var unSelectedGrid = this.down("#unSelectedGrid");
            var unSelectedStore = unSelectedGrid.getStore();
            selectedStore.remove(selectedRecords);
            unSelectedStore.add(selectedRecords);
        }
    },
    createGrid: function (itemId, columns, dragGroup, dropGroup) {
        var me = this;
        var toolBar = me.createToolBar();
        return {
            itemId: itemId,
            flex: 1,
            xtype: 'grid',
            multiSelect: true,
            dockedItems: [toolBar],
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: dragGroup,
                    dropGroup: dropGroup
                }
            },
            store: Ext.create("Ext.data.Store", {
                model: "OrientTdm.BackgroundMgr.CustomGrid.Model.ColumnDescExtModel"
            }),
            selType: "checkboxmodel",
            columns: columns,
            stripeRow: true,
            title: "unSelectedGrid" == itemId ? "未选字段" : "已选字段",
            margins: '5'
        };
    },
    createButtonPanel: function () {
        var me = this;
        return Ext.create("Ext.view.View", {
            width: 33,
            overItemCls: 'x-view-over',
            itemSelector: 'div.column-select',
            margins: '150 5 0 5',
            tpl: [
                '<tpl for=".">',
                '<div class="column-select" style="padding-bottom: 5px;">',
                '<div class="column">',
                (!Ext.isIE6 ? '<img src="app/images/itemselect/{thumb}" style="cursor: hand;"/>' :
                    '<div style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'app/images/itemselect/{thumb}\')"></div>'),
                '</div>',
                '</div>',
                '</tpl>'
            ],
            store: Ext.create("Ext.data.Store", {
                fields: ['id', 'name', 'thumb'],
                data: [
                    {id: '1', name: '上移', thumb: 'up.png'},
                    {id: '2', name: '添加', thumb: 'right.png'},
                    {id: '3', name: '移除', thumb: 'left.png'},
                    {id: '4', name: '下移', thumb: 'down.png'}
                ]
            }),
            listeners: {
                itemclick: function (view, record) {
                    if (record.get("id") == "1") {
                        me.fireEvent("moveUp");
                    } else if (record.get("id") == "2") {
                        me.fireEvent("moveToRight");
                    } else if (record.get("id") == "3") {
                        me.fireEvent("moveToLeft");
                    } else if (record.get("id") == "4") {
                        me.fireEvent("moveDown");
                    }
                }
            }
        });
    },
    createToolBar: function () {
        var items = [{
            xtype: 'triggerfield',
            triggerCls: 'x-form-clear-trigger',
            onTriggerClick: function () {
                this.setValue('');
                this.up('grid').getStore().clearFilter();
            },
            name: 'filterField',
            fieldLabel: '关键词',
            emptyText: '输入搜索词',
            labelWidth: 60,
            listeners: {
                change: function (field, newValue) {
                    if (Ext.isEmpty(newValue)) {
                        this.up('grid').getStore().clearFilter();
                    } else {
                        this.up('grid').getStore().filterBy(function (record) {
                            if (record.get('text').indexOf(newValue) != -1 || record.get('sColumnName').indexOf(newValue) != -1) {
                                return true;
                            }
                            return false;
                        });
                    }
                }
            }
        }];
        var retVal = Ext.create('Ext.toolbar.Toolbar', {
            items: items
        });
        return retVal;
    },
    validateModelChange: function () {
        var me = this;
        //如果模型与原来选择的模型不一致，则重新初始化
        if (this.needReconfig == true) {
            this.needReconfig = false;
            var columnData = this.columnData;
            var unSelectedGrid = this.down("#unSelectedGrid");
            var selectedGrid = this.down("#selectedGrid");
            var unselectedData = [];
            var selectedData = [];
            if (Ext.isEmpty(me.original)) {
                unSelectedGrid.getStore().removeAll();
                unselectedData = columnData;
            } else {
                var originalArray = me.original.split(",");
                //同步字段 防止DS删除字段引起模板与
                var repairedArray = [];
                var rightColumnIds = Ext.pluck(columnData, "id");
                //对比 过滤
                Ext.each(originalArray, function (columnId) {
                    if (Ext.Array.contains(rightColumnIds, columnId)) {
                        repairedArray.push(columnId);
                    }
                });
                //加载数据
                Ext.each(columnData, function (data) {
                    Ext.Array.contains(repairedArray, data.id) ? selectedData[Ext.Array.indexOf(repairedArray, data.id)] = data : unselectedData.push(data);
                });
            }
            unSelectedGrid.getStore().loadData(unselectedData);
            selectedGrid.getStore().loadData(selectedData);
        }
    }
});