/**
 * Created by enjoy on 2016/4/18 0018.
 */
Ext.define("OrientTdm.Common.Extend.Button.OrientButton", {
    extend: 'Ext.Base',
    constructor: function (config) {
        for (var key in config) {
            this[key] = config[key];
        }
    },
    config: {
        opreationType: ""
    },
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        var me = this;
        me.bindGridPanel = modelGridPanel;
        //获取表格所属父容器
        var container = modelGridPanel.up();
        me.container = container;
        //获取父容器布局
        me.layout = container.getLayout();
        //获取布局别名
        me.layoutAlias = me.layout.alias;
        //是否是特殊情况
        me.isSpecialButton = modelGridPanel.isSpecialButton;
        //双击直接跳窗口
        if (me.opreationType == "doubleClick") {
            //否则 采用弹出window的方式 加载其他面板
            var createWin = new Ext.Window({
                width: 0.8 * globalWidth,
                height: 0.8 * globalHeight,
                modal: true,
                layout: 'fit',
                title: me.customPanel.title,
                items: me.customPanel,
                listeners: {
                    'beforeshow': function () {
                        //var items = me.customPanel.items.items[0].items.length;
                        //if (items < 3) {
                        //    createWin.setHeight(items * 240);
                        //}
                        //else if (items >= 3 && items <= 7) {
                        //   createWin.setHeight(items * 25);
                        //}
                        //else {
                        //    createWin.setHeight(items * 50);
                        //}
                    }
                }
            });
            me.customPanel.title = "";
            createWin.show();
        }else if (me.layoutAlias == 'layout.card' && !modelGridPanel.isSpecialButton) {
            //如果grid的所属面板布局为card，则采用滑动的方式 加载其他面板
            me.layout.setActiveItem(1);
            var activeItem = me.layout.getActiveItem();
            activeItem.removeAll();
            activeItem.add(me.customPanel);
            activeItem.doLayout();
        } else if (me.layoutAlias == 'layout.border' && modelGridPanel.region == 'center' && !modelGridPanel.isSpecialButton) {
            //默认弹出下面板 可传入参数
            var respPanel = modelGridPanel.ownerCt.down("panel[region=south]");
            if (!respPanel) {
                respPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
                    region: 'south',
                    padding: '0 0 0 0',
                    deferredRender: false
                });
                modelGridPanel.ownerCt.add(respPanel);
                modelGridPanel.ownerCt.doLayout();
            }
            me.customPanel.maxHeight = (globalHeight - 300) * 0.9;
            respPanel.expand(true);
            respPanel.removeAll();
            respPanel.add(me.customPanel);
            respPanel.doLayout();
            respPanel.show();
        } else {
            //否则 采用弹出window的方式 加载其他面板
            var createWin = new Ext.Window({
                width: 0.8 * globalWidth,
                height: 0.8 * globalHeight,
                modal: true,
                layout: 'fit',
                title: me.customPanel.title,
                items: me.customPanel,
                listeners: {
                    'beforeshow': function () {
                        //var items = me.customPanel.items.items[0].items.length;
                        //if (items < 3) {
                        //    createWin.setHeight(items * 240);
                        //}
                        //else if (items >= 3 && items <= 7) {
                        //   createWin.setHeight(items * 25);
                        //}
                        //else {
                        //    createWin.setHeight(items * 50);
                        //}
                    }
                }
            });
            me.customPanel.title = "";
            createWin.show();
        }
    },
    //按钮操作完毕后的成果
    getSuccessData: function () {
        throw ("子类必须重载此方法");
    },
    doBack: function (btn) {
        var me = this;
        if (me.layoutAlias == 'layout.card' && !me.isSpecialButton) {
            me.layout.setActiveItem(0);
        } else if (me.layoutAlias == 'layout.border' && me.bindGridPanel.region == 'center' && !me.isSpecialButton) {
            var respPanel = me.container.down("panel[region=south]");
            respPanel.hide();
            //respPanel.collapse();
        } else {
            if (me.customPanel) {
                me.customPanel.up('window').close();
            }
        }
        delete me.customPanel;
    }
});