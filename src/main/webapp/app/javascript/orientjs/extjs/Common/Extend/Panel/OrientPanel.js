/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define('OrientTdm.Common.Extend.Panel.OrientPanel', {
    extend: 'Ext.panel.Panel',
    alternateClassName: 'OrientExtend.Panel',
    alias: 'widget.orientPanel',
    loadMask: true,
    config: {
        beforeInitComponent: Ext.emptyFn,
        afterInitComponent: Ext.emptyFn
    },
    initComponent: function () {
        var me = this;
        me.beforeInitComponent.call(me);
        //Border布局自动绑定引用
        if (me.layout == 'border') {
            Ext.each(me.items, function (item) {
                if (item) {
                    region = item.region;
                    me[region + 'PanelComponent'] = item;
                }
            });
        }
        this.callParent(arguments);
        me.afterInitComponent.call(me);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    }
});
