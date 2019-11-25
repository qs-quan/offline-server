/**
 * Created by enjoy on 2016/3/13 0013.FunctionNav
 */
Ext.define('OrientTdm.HomePage.Function.FunctionNav', {
    extend: 'Ext.view.View',
    alias: 'widget.functionbrowser',
    uses: 'Ext.data.Store',
    singleSelect: true,
    overItemCls: 'x-view-over',
    itemSelector: 'div.thumb-wrap',
    tpl: [
        '<tpl for=".">',
        '<div class="thumb-wrap" style="text-align:center">',
        '<div class="thumb">',
        (!Ext.isIE6 ? '<img width ="64" height="64" src="{icon}"/>' :'<div style="width:64px;height:64px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'{icon}\',sizingMethod=scale)"></div>'),
        '</div>',
        '<span style="width:80px;">{name}</span>',
        '</div>',
        '</tpl>'
    ],
    config: {
        functionUrl: '',
        sorted: true,
        afterClickedCollapse: true
    },
    initComponent: function () {
        var me = this;
        var sorters = null;
        if (me.sorted == true) {
            sorters = [{
                sorterFn: function (node1, node2) {
                    if (node2.raw.position > node1.raw.position) {
                        return -1;
                    } else if (node2.raw.position < node1.raw.position) {
                        return 1;
                    } else
                        return 0;
                }
            }];
        } else {
            var contextMenu = Ext.create('Ext.menu.Menu', {
                items: [
                    {
                        iconCls: 'icon-left',
                        text: '左移',
                        disabled: false,
                        itemId: 'left',
                        scope: me,
                        handler: me.doLeft
                    }, {
                        iconCls: 'icon-delete',
                        text: '删除',
                        disabled: false,
                        itemId: 'delete',
                        scope: me,
                        handler: me.doDelete
                    }, {
                        iconCls: 'icon-right',
                        text: '右移',
                        disabled: false,
                        itemId: 'right',
                        scope: me,
                        handler: me.doRight
                    }

                ]
            });
            Ext.apply(me, {
                listeners: {
                    itemcontextmenu: function (view, rec, node, index, e) {
                        e.stopEvent();
                        contextMenu.toHandleRec = rec;
                        contextMenu.showAt(e.getXY());
                        return false;
                    }
                }
            });
        }
        this.store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['id', 'name', 'icon', 'url', 'js', 'type', 'hasChildrens'],
            proxy: {
                type: 'ajax',
                url: me.functionUrl || serviceName + '/func/getFirstLevelFunction.rdm',
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            },
            sorters: sorters
        });
        this.callParent(arguments);
        this.store.sort();
        this.on("itemclick", this.initFunctionPanel);
    },

    initFunctionPanel: function (dataview, selected) {
        var me = this;
        if (me.afterClickedCollapse) {
            //收起功能导航栏
            this.up("panel").collapse();
        }
        //加载功能区域
        if (selected) {
            var functionDesc = selected.getData();
            var functionPanelId = "function-" + functionDesc.id;
            var centerPanel = Ext.getCmp('orient-center');
            if (centerPanel) {
                var functionPanel = centerPanel.child('panel[itemId=' + functionPanelId + ']');
                //如果没有初始化
                if (!functionPanel) {
                    if (functionDesc.hasChildrens) {
                        functionPanel = Ext.create("OrientTdm.HomePage.Function.FunctionDashBord", {
                            itemId: functionPanelId,
                            title: functionDesc.name,
                            layout: 'fit',
                            closable: true,
                            functionDesc: functionDesc
                        });
                    } else {
                        //直接加载
                        functionPanel = OrientExtUtil.FunctionHelper.createFunctionPanel(functionDesc, true);
                    }
                    centerPanel.add(functionPanel);
                }
                centerPanel.setActiveTab(functionPanel);
            }
        }
    },
    doDelete: function (btn) {
        var toHandleRec = btn.up("menu").toHandleRec;
        var store = this.getStore();
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/home/removeUserQuickLink.rdm", {
            functionId: toHandleRec.get("id")
        }, true, function (resp) {
            if (resp.decodedData.success) {
                store.remove(toHandleRec);
            }
        });

    },
    doLeft: function (btn) {
        var toHandleRec = btn.up("menu").toHandleRec;
        var store = this.getStore();
        var index = store.indexOf(toHandleRec);
        if (index != 0) {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/home/saveUserQuickLinkOrder.rdm", {
                functionId: toHandleRec.get("id"),
                direction: 'left'
            }, true, function (resp) {
                if (resp.decodedData.success) {
                    store.remove(toHandleRec);
                    store.insert(index - 1, toHandleRec);
                }
            });
        } else {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.alreadyLeft);
        }
    },
    doRight: function (btn) {
        var toHandleRec = btn.up("menu").toHandleRec;
        var store = this.getStore();
        var index = store.indexOf(toHandleRec);
        if (index != store.getCount() - 1) {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/home/saveUserQuickLinkOrder.rdm", {
                functionId: toHandleRec.get("id"),
                direction: 'right'
            }, true, function (resp) {
                if (resp.decodedData.success) {
                    store.remove(toHandleRec);
                    store.insert(index + 1, toHandleRec);
                }
            });
        } else {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.alreadyRight);
        }
    }
});