Ext.define('OrientTdm.Common.Extend.Form.Selector.ChooseTableDataPanel', {
    extend: "Ext.panel.Panel",
    alias: 'widget.chooseTableDataPanel',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    config: {
        tableName: '',
        schemaId: '',
        //已经选中的数据
        selectedValue: [],
        //过滤
        customFilters: [],
        //是否多选
        multiSelect: true,
        showSelected: true,
        saveAction: Ext.emptyFn
    },
    initComponent: function () {
        var me = this;
        me.modelId = OrientExtUtil.ModelHelper.getModelId(me.tableName, me.schemaId);
        var unselectedPanel = me.createUnselectedGrid();
        var selectedPanel = me.createSelectedGrid();
        var buttonPanel = me.createButtonPanel();
        Ext.apply(me, {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [unselectedPanel, buttonPanel, selectedPanel],
            buttons: [
                {
                    text: '保存',
                    iconCls: 'icon-save',
                    scope: me,
                    handler: me.saveChoose
                },
                {
                    text: '关闭',
                    iconCls: 'icon-close',
                    handler: function () {
                        this.up('window').close();
                    }
                }
            ]
        });
        me.callParent(arguments);

        me.addEvents("removeSelectedData", "addSelectedData");
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'removeSelectedData', me.removeSelectedData, me);
        me.mon(me, 'addSelectedData', me.addSelectedData, me);
    },
    createUnselectedGrid: function() {
        var me = this;
        var filters = [];
        if(me.selectedValue.length > 0) {
            filters.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.NotIn, "", me.selectedValue.join(",")));
        }
        var selectedModelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            title: '<span style="color: red; ">未选数据</span>',
            modelId: me.modelId,
            itemId: 'unSelectedGrid',
            selectType: 'unselected',
            width: '48%',
            customerFilter: Ext.Array.merge(me.customFilters, filters),
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop'
                }, listeners: {
                    beforeDrop: function (node, data, overModel, dropPosition, dropHandlers) {
                        if (data.view.up("grid").getItemId() == "unSelectedGrid") {
                            this.up("chooseTableDataPanel").fireEvent("addSelectedData");
                        } else {
                            this.up("chooseTableDataPanel").fireEvent("removeSelectedData");
                        }
                        //阻止默认事件
                        dropHandlers.cancelDrop();
                    }
                }
            },
            afterInitComponent: function () {
                //增加按钮
                var toolBar = this.dockedItems[0];
                //只保留详细、查询、查询全部三个按钮
                var keepDictionart = ['详细', '查询', '查询全部'];
                var toRemoveItems = [];
                Ext.each(toolBar.items.items, function (btn) {
                    if (!Ext.Array.contains(keepDictionart, btn.text)) {
                        toRemoveItems.push(btn);
                    }
                });
                Ext.each(toRemoveItems, function (toRemoveItem) {
                    toolBar.remove(toRemoveItem);
                });
            }
        });
        return selectedModelGrid;
    },
    createSelectedGrid: function() {
        var me = this;
        var filters = [];
        if(me.selectedValue.length > 0) {
            filters.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", me.selectedValue.join(",")));
        }
        else {
            filters.push(new CustomerFilter("1", CustomerFilter.prototype.SqlOperation.Equal, "", "0"));
        }
        var selectedModelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            title: '<span style="color: red; ">已选数据</span>',
            modelId: me.modelId,
            itemId: 'selectedGrid',
            selectType: 'selected',
            width: '48%',
            customerFilter: filters,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop'
                }, listeners: {
                    beforeDrop: function (node, data, overModel, dropPosition, dropHandlers) {
                        if (data.view.up("grid").getItemId() == "unSelectedGrid") {
                            this.up("chooseTableDataPanel").fireEvent("addSelectedData");
                        } else {
                            this.up("chooseTableDataPanel").fireEvent("removeSelectedData");
                        }
                        //阻止默认事件
                        dropHandlers.cancelDrop();
                    }
                }
            },
            afterInitComponent: function () {
                //增加按钮
                var toolBar = this.dockedItems[0];
                //只保留详细、查询、查询全部三个按钮
                var keepDictionart = ['详细', '查询', '查询全部'];
                var toRemoveItems = [];
                Ext.each(toolBar.items.items, function (btn) {
                    if (!Ext.Array.contains(keepDictionart, btn.text)) {
                        toRemoveItems.push(btn);
                    }
                });
                Ext.each(toRemoveItems, function (toRemoveItem) {
                    toolBar.remove(toRemoveItem);
                });
            }
        });
        return selectedModelGrid;
    },
    createButtonPanel: function () {
        var me = this;
        return Ext.create("Ext.view.View", {
            width: 40,
            overItemCls: 'x-view-over',
            itemSelector: 'div.column-select',
            margins: '300 5 5 15',
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
                    {id: '2', name: '添加', thumb: 'right.png'},
                    {id: '3', name: '移除', thumb: 'left.png'}
                ]
            }),
            listeners: {
                itemclick: function (view, record) {
                    if (record.get("id") == "1") {

                    } else if (record.get("id") == "2") {
                        me.fireEvent("addSelectedData");
                    } else if (record.get("id") == "3") {
                        me.fireEvent("removeSelectedData");
                    } else if (record.get("id") == "4") {

                    }
                }
            }
        });
    },
    removeSelectedData: function () {
        var me = this;
        ////获取父panel
        //var fatherPanel = me.up("relationPanel");
        var childGrid = me.down("orientModelGrid[selectType=selected]");
        var selections = childGrid.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else {
            Ext.each(selections, function (item) {
                Ext.Array.remove(me.selectedValue, item.getId());
            });
            //刷新左右表格
            me.doRefreshPanel();
        }
    },
    addSelectedData: function () {
        var me = this;
        ////获取父panel
        //var fatherPanel = me.up("relationPanel");
        var childGrid = me.down("orientModelGrid[selectType=unselected]");
        //校验是否可以添加
        var canAdd = me.canAdd();
        if (canAdd == 1) {
            var selections = childGrid.getSelectionModel().getSelection();
            if (selections.length === 0) {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
            } else {
                Ext.each(selections, function (item) {
                    Ext.Array.include(me.selectedValue, item.getId());
                });
                me.doRefreshPanel();
            }
        } else if (canAdd == -1) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, "请先删除已经选中的数据，再重新添加新的数据");
        } else if (canAdd == -2) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.onlyCanSelectOne);
        }
    },
    doRefreshPanel: function () {
        var me = this;
        //刷新左右表格
        var selectedGrid = me.down("orientModelGrid[selectType=selected]");
        var unSelectedGrid = me.down("orientModelGrid[selectType=unselected]");
        var selectedCustomerFilter = [];
        if(me.selectedValue.length > 0) {
            selectedCustomerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", me.selectedValue.join(",")));
        }
        else {
            selectedCustomerFilter.push(new CustomerFilter("1", CustomerFilter.prototype.SqlOperation.Equal, "", "0"));
        }
        var unSelectedCustomerFilter = [];
        if(me.selectedValue.length > 0) {
            unSelectedCustomerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.NotIn, "", me.selectedValue.join(",")));
        }

        selectedGrid.fireEvent("refreshGridByCustomerFilter", selectedCustomerFilter);
        unSelectedGrid.fireEvent("refreshGridByCustomerFilter", Ext.Array.merge(me.customFilters, unSelectedCustomerFilter));
    },
    canAdd: function () {
        var retVal = 1;
        //校验是否可以添加选中的数据
        var me = this;
        //如果只能单选
        if (me.multiSelect == false) {
            var selectedGrid = me.down("orientModelGrid[selectType=selected]");
            var unSelectedGrid = me.down("orientModelGrid[selectType=unselected]");
            //如果已经存在选中的数据
            if (selectedGrid.getStore().getCount() > 0) {
                retVal = -1;
            }
            else if (unSelectedGrid.getSelectionModel().getSelection().length > 1) {
                retVal = -2;
            }
        }
        return retVal;
    },
    getAllRecordIds: function() {
        var me = this;
        var selectedGrid = me.down("orientModelGrid[selectType=selected]");
        var retVal = [];
        var records = selectedGrid.getStore().getRange();
        for(var i=0; i<records.length; i++) {
            retVal.push(records[i].get("id"));
        }
        return retVal;
    },
    getAllRecords: function() {
        var me = this;
        var selectedGrid = me.down("orientModelGrid[selectType=selected]");
        var retVal = selectedGrid.getStore().getRange();
        return retVal;
    },
    getAllInfoMap: function() {
        var me = this;
        var selectedGrid = me.down("orientModelGrid[selectType=selected]");
        var showCol = selectedGrid.modelDesc.showColumn;
        var records = selectedGrid.getStore().getRange();
        var retVal = [];
        for(var i=0; i<records.length; i++) {
            var obj = {
                id: records[i].get("ID"),
                name: records[i].get(showCol)
            };
            retVal.push(obj);
        }
        return retVal;
    },
    saveChoose: function (notClose) {
        var me = this;
        var selectedIds = me.getAllRecordIds();
        if(!me.multiSelect && selectedIds.length!=1) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.onlyCanSelectOne);
            return;
        }

        var selectedRecords = me.getAllRecords();
        var selectedInfoMap = me.getAllInfoMap();
        if (me.saveAction) {
            me.saveAction.call(me, selectedIds, selectedRecords, selectedInfoMap);
        }
    }
});