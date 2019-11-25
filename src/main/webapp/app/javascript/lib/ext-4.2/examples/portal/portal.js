/**
 * @class Ext.app.Portal
 * @extends Object
 * A sample portal layout application class.
 */

Ext.define('OrientTdm.Portal', {

    extend: 'Ext.container.Viewport',
    requires: [
        'OrientTdm.BaseRequires',
        //首页相关
        'OrientTdm.HomePage.Portal.PortalPanel',
        'OrientTdm.HomePage.Portal.PortalColumn',
        'OrientTdm.HomePage.Function.FunctionNav',
        "OrientTdm.HomePage.Function.FunctionTreePanel",
        "OrientTdm.HomePage.Function.FunctionDashBord",
        'OrientTdm.HomePage.Link.LinkWindow',
        'OrientTdm.HomePage.Portal.ChoosePortalWin'
    ],

    getTools: function () {
        return [{
            xtype: 'tool',
            type: 'refresh',
            handler: function (e, target, header, tool) {
                var portlet = header.ownerCt;
                portlet.setLoading('Loading...');
                Ext.defer(function () {
                    portlet.setLoading(false);
                }, 2000);
            }
        }];
    },
    getLinkTools: function () {
        var me = this;
        return [{
            xtype: 'tool',
            type: 'gear',
            handler: function (e, target, header, tool) {
                var win = Ext.create('OrientTdm.HomePage.Link.LinkWindow', {
                    id: 'img-chooser-dlg',
                    plain: true,
                    modal: true,
                    animateTarget: this.getEl(),
                    functionNav: Ext.getCmp('orient-functionnav').items.items[0],
                    listeners: {
                        selected: Ext.bind(me.insertSelectedImage, this)
                    }
                });
                win.show();
            }
        }];
    },
    insertSelectedImage: function (functionData, win) {
        var canAdd = true;
        var functionId = functionData.get("id");
        Ext.Ajax.request({
            url: serviceName + '/home/listUnSelectedFunction.rdm',
            async: false,
            success: function (response) {
                var retObj = response.decodedData;
                if (retObj.success == true) {
                    var unselectedIds = [];//retObj.results;
                    var results = retObj.results;
                    for (var i = 0; i < results.length; i++) {
                        unselectedIds.push(results[i].id);
                    }
                    if (OrientExtUtil.IEHelper.indexOf(unselectedIds, functionId)){
                        canAdd = false;
                    }
                }
                else {

                }
            }
        });
        if (canAdd === true) {
            //保存至数据库
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/home/saveUserLink.rdm", {
                functionId: functionData.get("id")
            }, true, function (resp) {
                if (resp.decodedData.success) {
                    var quickLindStore = Ext.getCmp("function-quickLink").getStore();
                    quickLindStore.add(functionData);
                }
            });
        } else {
            Ext.MessageBox.show({
                title: '不能重复添加',
                msg: "不能重复添加",
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
        }

    },
    getPortalTools: function () {
        var me = this;
        return [{
            xtype: 'tool',
            type: 'save',
            handler: function (e, target, header, tool) {
            }
        }, {
            xtype: 'tool',
            type: 'gear',
            handler: function (e, target, header, tool) {
                var win = Ext.create("OrientTdm.HomePage.Portal.ChoosePortalWin", {
                    listeners: {
                        selected: function (selectedRecords) {
                            if (selectedRecords.length > 0) {
                                var selectedIds = [];
                                Ext.each(selectedRecords, function (selectedRecord) {
                                    selectedIds.push(selectedRecord.get("id"));
                                });
                                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/home/saveUserPortal.rdm", {
                                    portalIds: selectedIds
                                }, true, function (resp) {
                                    if (resp.decodedData.success) {
                                        //插入页面
                                        me.down("orientPortalPanel").loader.load(OrientExtUtil.HomeHelper.getPortalloadConfig(me));
                                    }
                                });
                            }
                            //关闭窗口
                            this.close();
                        }
                    }
                });
                win.show();
            }
        }];
    },

    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            id: 'orient-viewport',
            layout: {
                type: 'border'
            },
            items: [{
                id: 'orient-header',
                xtype: 'panel',
                layout: 'fit',
                region: 'north',
                height: 75,
                maxHeight: 75,
                minHeight: 75,
                border: false,
                header: false,
                collapseMode: 'mini',
                split: true,
                contentEl: '_id_north_el',
                collapsible: true
            }, {
                id: 'orient-functionnav',
                title: '功能导航',
                region: 'west',
                animCollapse: true,
                width: 120,
                minWidth: 120,
                maxWidth: 120,
                split: true,
                collapsible: true,
                layout: {
                    type: 'fit',
                    animate: true
                },
                items: {
                    xtype: 'functionbrowser',
                    autoScroll: true,
                    id: 'function-chooser-view',
                    listeners: {
                        scope: this
                    }
                }
            }, {
                id: 'orient-center',
                xtype: 'orientTabPanel',
                region: 'center',
                items: [
                    {
                        xtype: 'container',
                        layout: 'border',
                        title: '首页',
                        items: [
                            {
                                region: 'north',
                                tools: me.getLinkTools(),
                                collapsible: true,
                                title: '快捷入口',
                                height: 130,
                                items: [{
                                    layout: 'hbox',
                                    xtype: 'functionbrowser',
                                    id: 'function-quickLink',
                                    functionUrl: serviceName + '/home/listUserQuickLink.rdm',
                                    sorted: false,
                                    afterClickedCollapse: false
                                }]
                            },
                            {
                                id: 'orient-portal',
                                region: 'center',
                                title: '信息门户',
                                tools: me.getPortalTools(),
                                xtype: 'orientPortalPanel',
                                loader: OrientExtUtil.HomeHelper.getPortalloadConfig(me)
                            }
                        ]
                    }
                ]
            }]
        });
        this.callParent(arguments);
    },

    onPortletClose: function (portal) {
        var me = this;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/home/removeUserPortal.rdm", {
            portalId: portal.id
        }, true, function (resp) {
            if (resp.decodedData.success) {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.removePortalSuccess);
                //关闭某个磁贴，需要重新加载整个面板
                me.down("orientPortalPanel").loader.load(OrientExtUtil.HomeHelper.getPortalloadConfig(me));
            }
        });
    }
});
