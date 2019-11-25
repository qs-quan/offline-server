/**
 * Created by enjoy on 2016/3/11 0011.
 */
Ext.define('OrientTdm.SysMgr.FuncMgr.Common.IconBrowser', {
    extend: 'Ext.view.View',
    alias: 'widget.iconbrowser',
    uses: 'Ext.data.Store',
    singleSelect: true,
    overItemCls: 'x-view-over',
    itemSelector: 'div.thumb-wrap',
    tpl: [
        '<tpl for=".">',
        '<div class="thumb-wrap">',
        '<div class="thumb">',
        (!Ext.isIE6 ? '<img width ="95" src="app/images/function/{thumb}" />' :
            '<div style="width:100px;height:100px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'app/images/function/{thumb}\',sizingMethod=scale)"></div>'),
        '</div>',
        '<span>{name}</span>',
        '</div>',
        '</tpl>'
    ],

    initComponent: function () {
        this.store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['thumb', 'name'],
            proxy: {
                type: 'ajax',
                url: serviceName + '/func/getFunImages.rdm',
                reader: {
                    type: 'json',
                    root: ''
                }
            }
        });
        this.callParent(arguments);
        this.store.sort();
    }
});