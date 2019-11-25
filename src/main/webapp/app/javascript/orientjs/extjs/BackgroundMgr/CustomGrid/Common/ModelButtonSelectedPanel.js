/**
 * Created by enjoy on 2016/4/12 0012.
 */
Ext.define('OrientTdm.BackgroundMgr.CustomGrid.Common.ModelButtonSelectedPanel', {
    extend: "Ext.container.Container",
    alias: 'widget.modelButtonSelectedPanel',
    //是否需要重新加载
    needReconfig: false,
    requires: [
        "OrientTdm.BackgroundMgr.ButtonInstance.Model.ButtonInstanceExtModel"
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    initComponent: function () {
        var me = this;
        //初始化已选择的按钮数据
        var originalData = me.originalData || "-1";
        var params = {
            filter: originalData
        };
        //获取数据
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelBtnInstance/getModelBtnInstanceData.rdm", params, false, function (resp) {
            var respData = resp.decodedData.results;
            //准备数据
            me.selectedGridData = respData["selected"];
            me.unSelectedGridData = respData["unselected"];
            //准备页面
            var unSelectedGroup = this.id + 'unSelected';
            var selectedGroup = this.id + 'selected';
            var columns = [{
                header: '名称',
                flex: 1,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            }, {
                header: '按钮类型',
                width: 150,
                sortable: true,
                dataIndex: 'btnTypeId',
                filter: {
                    type: 'string'
                },
                renderer: function (value) {
                    var retVal = '';
                    if (!Ext.isEmpty(value)) {
                        retVal = Ext.decode(value)["value"];
                    }
                    return retVal;
                }
            },
                {
                    header: '是否系统类型',
                    sortable: true,
                    dataIndex: 'issystem',
                    renderer: function (value) {
                        var retVal = "否";
                        if (value == "1") {
                            retVal = "是";
                        }
                        return retVal;
                    }
                }];
            var unSelectedGrid = me.createGrid("unSelectedGrid", columns, unSelectedGroup, selectedGroup, me.unSelectedGridData);
            var selectedGrid = me.createGrid("selectedGrid", columns, selectedGroup, unSelectedGroup, me.selectedGridData);
            var buttonPanel = me.createButtonPanel();
            Ext.apply(me, {
                items: [unSelectedGrid, buttonPanel, selectedGrid]
            });
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
        var me = this;
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
        var me = this;
        var selectedGrid = this.down("#selectedGrid");
        //获取选中记录
        var selectedRecords = selectedGrid.getSelectionModel().getSelection();
        if (selectedRecords.length == 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, "请至少选择一条已选字段记录");
        } else {
            var unSelectedGrid = this.down("#unSelectedGrid");
            var unSelectedStore = unSelectedGrid.getStore();
            var selectedStore = selectedGrid.getStore();
            selectedStore.remove(selectedRecords);
            unSelectedStore.add(selectedRecords);
        }
    },
    reconfigGrid: function (grid, data) {
        var me = this;
        Ext.suspendLayouts();
        var newStore = me.createStore(data);
        grid.reconfigure(newStore);
        Ext.resumeLayouts(true);
        grid.down("pagingtoolbar").bindStore(newStore);
        grid.down("pagingtoolbar").doRefresh();
    },
    createStore: function (data) {
        var store = Ext.create("Ext.data.Store", {
            model: "OrientTdm.BackgroundMgr.ButtonInstance.Model.ButtonInstanceExtModel",
            proxy: Ext.create("Ext.ux.data.PagingMemoryProxy", {
                xtype: 'pagingmemory',
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            }),
            data: data,
            pageSize: data.totalProperty
        });
        return store;
    },
    createGrid: function (itemId, columns, dragGroup, dropGroup, data) {
        var me = this;
        var store = me.createStore(data);
        var toolBar = me.createToolBar();
        return {
            itemId: itemId,
            flex: 1,
            xtype: 'grid',
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: dragGroup,
                    dropGroup: dropGroup
                },
                listeners: {
                    beforeDrop: function (node, data, overModel, dropPosition, dropHandlers) {
                        if (data.view.up("grid").getItemId() == "unSelectedGrid") {
                            this.up("modelButtonSelectedPanel").fireEvent("moveToRight");
                        } else {
                            this.up("modelButtonSelectedPanel").fireEvent("moveToLeft");
                        }
                        //阻止默认事件
                        dropHandlers.cancelDrop();
                    }
                }
            },
            store: store,
            selType: "checkboxmodel",
            dockedItems: [toolBar],
            columns: columns,
            stripeRow: true,
            title: "unSelectedGrid" == itemId ? "未选按钮" : "已选按钮",
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
                            if (record.get('name').indexOf(newValue) != -1) {
                                return true;
                            }
                            return false;
                        });
                    }
                }
            }
        }, {
            name: 'issystem',
            xtype: 'combobox',
            fieldLabel: '是否系统类型',
            labelWidth: 90,
            store: {
                fields: ['id', 'name'],
                data: [
                    {'id': 1, 'name': '是'},
                    {'id': 0, 'name': '否'}
                ]
            },
            queryModel: 'local',
            displayField: 'name',
            valueField: 'id',
            listeners: {
                change: function (field, newValue) {
                    if (Ext.isEmpty(newValue)) {
                        this.up('grid').getStore().clearFilter();
                    } else {
                        this.up('grid').getStore().filterBy(function (record) {
                            if (record.get('issystem') == newValue) {
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
        }
    },
    getSubmitValue: function () {
        //按照顺序获取所有数据
        var me = this;
        var selectedGrid = me.down("#selectedGrid");
        var selectedStore = selectedGrid.getStore();
        var selectedIds = [];
        //TODO 未考虑分页
        selectedStore.each(function (record) {
            selectedIds.push(record.get("id"));
        });
        return selectedIds;
    }
})
;