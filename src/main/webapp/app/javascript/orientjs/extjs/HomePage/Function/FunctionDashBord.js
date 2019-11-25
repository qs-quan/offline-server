/**
 * 二级功能点主面板
 */
Ext.define('OrientTdm.HomePage.Function.FunctionDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.functionDashBord',
    config: {
        functionDesc: null,
        firstPageUrl: null
    },
    initComponent: function () {
        var me = this;
        var firstTab = OrientExtUtil.FunctionHelper.createFunctionPanel(me.functionDesc, false);
        //创建中间面板
        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientTabPanel", {
            region: 'center',
            padding: '0 0 0 5',
            items: [firstTab]
        });
        //判断是否包含二级功能点
        var items = [centerPanel];
        if (me.functionDesc.hasChildrens) {
            var icon = me.functionDesc.icon;
            var smalIcon = icon.replace('.', '_small.');
            Ext.apply(me, {
                icon: smalIcon
            });
            var sonFunctionPanel = Ext.create("OrientTdm.HomePage.Function.FunctionTreePanel", {
                orientRootId: me.functionDesc.id,
                width: 250,
                minWidth: 250,
                maxWidth: 400,
                title: '子功能点',
                region: 'west',
                listeners: {
                    "cellclick": Ext.bind(OrientExtUtil.FunctionHelper.functionClicked, me, centerPanel, true),
                    scope: me
                }
            });
            items.push(sonFunctionPanel);
        }
        Ext.apply(me, {
            layout: 'border',
            items: items
        });
        me.callParent(arguments);
    }
})
;