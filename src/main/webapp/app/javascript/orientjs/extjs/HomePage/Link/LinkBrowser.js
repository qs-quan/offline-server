/**
 * Created by enjoy on 2016/3/11 0011.
 */
Ext.define('OrientTdm.HomePage.Link.LinkBrowser', {
    extend: 'Ext.view.View',
    alias: 'widget.linkBrowser',
    uses: 'Ext.data.Store',
    singleSelect: true,
    overItemCls: 'x-view-over',
    itemSelector: 'div.thumb-wrap',
    tpl: [
        '<tpl for=".">',
        '<div class="thumb-wrap">',
        '<div class="thumb">',
        (!Ext.isIE6 ? '<img src="{icon}" />' :
            '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'{icon}\')"></div>'),
        '</div>',
        '<span>{name}</span>',
        '</div>',
        '</tpl>'
    ],

    initComponent: function () {
        this.store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['id', 'name', 'icon', 'url', 'js', 'type', 'hasChildrens'],
            proxy: {
                type: 'ajax',
                url: serviceName + '/home/listAllFunction.rdm',
                //url: serviceName + '/home/listUnSelectedFunction.rdm',
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    messageProperty: 'msg'
                }
            }
        });
        this.callParent(arguments);
        this.store.sort();
    }
});