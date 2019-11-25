/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define('OrientTdm.Common.Extend.Panel.OrientTabPanel', {
    extend: 'Ext.tab.Panel',
    alternateClassName: 'OrientExtend.TabPanel',
    alias: 'widget.orientTabPanel',
    loadMask: true,
    config: {
        beforeInitComponent: Ext.emptyFn,
        afterInitComponent: Ext.emptyFn
    },
    defaults: {
        icon: 'app/images/orient.ico'
    },
    initComponent: function () {
        var me = this;
        me.beforeInitComponent.call(me);
        Ext.apply(me, {
            plugins: Ext.create('Ext.ux.TabCloseMenu', {
                closeTabText: '关闭面板',
                closeTabIcon:'app/images/icons/close.png',
                closeOthersTabsText: '关闭其他',
                closeAllTabsText: '关闭所有'
            })
        });
        this.callParent(arguments);
        me.afterInitComponent.call(me);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    }
});
