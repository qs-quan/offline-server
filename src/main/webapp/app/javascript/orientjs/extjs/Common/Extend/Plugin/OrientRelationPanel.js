/**
 * Created by enjoy on 2016/4/2 0002.
 */
Ext.define('OrientTdm.Common.Extend.Plugin.OrientRelationPanel', {
    //extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    extend: "Ext.container.Container",
    alias: 'widget.relationPanel',
    //layout: 'border',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    sModelName: '',
    refType: '',
    refModelID: '',
    refModelName: '',
    isMulti: false,
    selectedValue: [],
    config: {
        defaultFilter: []
    },

    initComponent: function () {
        var me = this;
        var selectedCustomerFilter = me.createCustomerFilter(CustomerFilter.prototype.SqlOperation.In);
        var unSelectedCustomerFilter = me.createCustomerFilter(CustomerFilter.prototype.SqlOperation.NotIn);
        var keepDictionart = [];//['详细', '查询', '查询全部'];
        var selectedModelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            title: '<span style="color: red; ">已选数据</span>',
            showAnalysisBtns: false,
            modelId: me.refModelID,
            itemId: 'selectedGrid',
            selectType: 'selected',
            width: '50%',
            autoScroll:true,
            showAnalysisBtns: false,
            customerFilter: selectedCustomerFilter,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop'
                }, listeners: {
                    beforeDrop: function (node, data, overModel, dropPosition, dropHandlers) {
                        if (data.view.up("grid").getItemId() == "unSelectedGrid") {
                            this.up("relationPanel").fireEvent("addSelectedData");
                        } else {
                            this.up("relationPanel").fireEvent("removeSelectedData");
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
                var toRemoveItems = [];
                Ext.each(toolBar.items.items, function (btn) {
                    if (!Ext.Array.contains(keepDictionart, btn.text)) {
                        toRemoveItems.push(btn);
                    }
                });
                Ext.each(toRemoveItems, function (toRemoveItem) {
                    toolBar.remove(toRemoveItem);
                });
                /*toolBar.add('->',{
                    xtype:'tbtext',
                    style:'color:red',
                    text: '双击条目即可还原到未选数据',
                    iconCls: 'x-status-error'
                });*/
                toolBar.add({
                    iconCls: 'upload-cancel',
                    text: '移除',
                    itemId: 'grid-remove',
                    scope: this,
                    handler: me.removeSelectedData
                });
            }/*,
            listeners: {
                'itemdblclick': function (grid, record) {
                    me.removeSelectedDataToLeft(grid);
                }
            }*/
        });


        var unSelectedModelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            title: '<span style="color: blue; ">未选数据</span>',
            selectType: 'unselected',
            modelId: me.refModelID,
            itemId: 'unSelectedGrid',
            width: '50%',
            autoScroll:true,
            customerFilter: Ext.Array.merge(me.defaultFilter, unSelectedCustomerFilter),
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop'
                }, listeners: {
                    beforeDrop: function (node, data, overModel, dropPosition, dropHandlers) {
                        if (data.view.up("grid").getItemId() == "unSelectedGrid") {
                            this.up("relationPanel").fireEvent("addSelectedData");
                        } else {
                            this.up("relationPanel").fireEvent("removeSelectedData");
                        }
                        //阻止默认事件
                        dropHandlers.cancelDrop();
                    }
                }
            },
            afterInitComponent: function () {
                //增加按钮
                var toolBar = this.dockedItems[0];
                var toRemoveItems = [];
                Ext.each(toolBar.items.items, function (btn) {
                    if (!Ext.Array.contains(keepDictionart, btn.text)) {
                        toRemoveItems.push(btn);
                    }
                });
                Ext.each(toRemoveItems, function (toRemoveItem) {
                    toolBar.remove(toRemoveItem);
                });
                /*toolBar.add('->',{
                    xtype:'tbtext',
                    style:'color:red',
                    text: '双击条目即可添加到已选数据',
                    iconCls: 'x-status-error'
                });*/

                toolBar.add({
                    iconCls: 'icon-select',
                    text: '选中',
                    itemId: 'grid-select',
                    scope: this,
                    handler: me.addSelectedData
                });
            }/*,
            listeners: {
                'itemdblclick': function (grid, record) {
                    me.addSelectedDataToRight(grid);
                }
            }*/
        });

        //创建中间的buttonPanel
        var buttonPanel = me.createButtonPanel();


        Ext.apply(me, {
            //layout: 'border',
            //items: [letfContent,buttonPanel,rightContent]
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [unSelectedModelGrid,/* buttonPanel,*/ selectedModelGrid]
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
    removeSelectedData: function () {
        var me = this;
        ////获取父panel
        var fatherPanel = me.up("relationPanel");
        var childGrid = fatherPanel.down("orientModelGrid[selectType=selected]");
        var selections = childGrid.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else {
            Ext.each(selections, function (item) {
                Ext.Array.remove(fatherPanel.selectedValue, item.getId());
            });
            //空值处理
            fatherPanel.selectedValue = Ext.isEmpty(fatherPanel.selectedValue) ? ["-1"] : fatherPanel.selectedValue;
            //刷新左右表格
            fatherPanel.doRefreshPanel();
        }
    },
    addSelectedData: function () {
        var me = this;
        //获取父panel
        var fatherPanel = me.up("relationPanel");
        var childGrid = fatherPanel.down("orientModelGrid[selectType=unselected]");
        //校验是否可以添加
        var canAdd = fatherPanel.canAdd();
        if (canAdd == 1) {
            var selections = childGrid.getSelectionModel().getSelection();
            if (selections.length === 0) {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
            } else {
                Ext.each(selections, function (item) {
                    Ext.Array.include(fatherPanel.selectedValue, item.getId());
                });
                fatherPanel.doRefreshPanel();
            }
        } else if (canAdd == -1) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, "请先删除已经选中的数据，再重新添加新的数据！");
        } else if (canAdd == -2) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.onlyCanSelectOne);
        }
    },

    doRefreshPanel: function () {
        var me = this;
        //刷新左右表格
        var selectedGrid = me.down("orientModelGrid[selectType=selected]");
        var unSelectedGrid = me.down("orientModelGrid[selectType=unselected]");
        var selectedCustomerFilter = me.createCustomerFilter("In");
        var unSelectedCustomerFilter = me.createCustomerFilter("NotIn");
        selectedGrid.fireEvent("refreshGridByCustomerFilter", selectedCustomerFilter, true);
        unSelectedGrid.fireEvent("refreshGridByCustomerFilter", Ext.Array.merge(me.defaultFilter, unSelectedCustomerFilter, unSelectedGrid.queryFilter), true);
    },

    createCustomerFilter: function (operation) {
        var me = this;
        //空值处理
        me.selectedValue = Ext.isEmpty(me.selectedValue) ? ["-1"] : me.selectedValue;
        //关系属性类型
        var refType = me.refType;
        if ("1" == refType && "NotIn" == operation) {
            //一对一 额外追加条件
            var customerFilter = new CustomerFilter("ID", operation, "", me.selectedValue.toString());
            var childCustomerFilter = new CustomerFilter("ID", operation, 'expression', 'SELECT ' + me.refModelName + '_ID FROM ' + me.sModelName + " WHERE " + me.refModelName + '_ID IS NOT NULL');
            customerFilter.setChild(childCustomerFilter);
            return [customerFilter];
        } else if ("3" == refType) {
            //多对一
        } else if ("4" == refType) {
            //多对多
            me.isMulti = true;
        }
        return [new CustomerFilter("ID", operation, "", me.selectedValue.toString())];
    },

    getSelectedData: function () {
        //获取选中的数据
        var me = this;
        var selectedGrid = me.down("orientModelGrid[selectType=selected]");
        var proxy = selectedGrid.getStore().getProxy();
        var url = proxy.api.read;
        var params = proxy.extraParams;
        var selectedData = [];
        OrientExtUtil.AjaxHelper.doRequest(url, params, false, function (resp) {
            var data = resp.decodedData;
            selectedData = data.results;
        });
        return selectedData;
    },

    canAdd: function () {
        var retVal = 1;
        //校验是否可以添加选中的数据
        var me = this;
        //如果只能单选
        if (me.isMulti == false) {
            var selectedGrid = me.down("orientModelGrid[selectType=selected]");
            var unSelectedGrid = me.down("orientModelGrid[selectType=unselected]");
            //如果已经存在选中的数据
            if (selectedGrid.getStore().getCount() > 0) {
                retVal = -1;
            } else if (unSelectedGrid.getSelectionModel().getSelection().length > 1) {
                retVal = -2;
            }
        }
        return retVal;
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

    addSelectedDataToRight: function (grid) {
        var me = this;
        //校验是否可以添加
        var canAdd = me.canAdd();
        if (canAdd == 1) {
            var selections = grid.getSelectionModel().getSelection();
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

    removeSelectedDataToLeft: function (grid) {
        var me = this;
        var selections = grid.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else {
            Ext.each(selections, function (item) {
                Ext.Array.remove(me.selectedValue, item.getId());
            });
            //空值处理
            me.selectedValue = Ext.isEmpty(me.selectedValue) ? ["-100000"] : me.selectedValue;
            //刷新左右表格
            me.doRefreshPanel();
        }
    }
});