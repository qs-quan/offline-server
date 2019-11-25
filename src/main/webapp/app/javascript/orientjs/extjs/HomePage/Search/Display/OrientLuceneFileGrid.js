/**
 * DS模型表格
 */
Ext.define('OrientTdm.HomePage.Search.Display.OrientLuceneFileGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.orientLuceneFileGrid',
    requires: [],
    config: {},
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            store: Ext.create('Ext.data.ArrayStore', {
                // store 的配置
                autoDestroy: true,
                storeId: 'myStore',
                // reader的配置
                idIndex: 0,
                fields: [
                    'company',
                    {name: 'price', type: 'float'},
                    {name: 'change', type: 'float'},
                    {name: 'pctChange', type: 'float'},
                    {name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
                ],
                data: [
                    ['3m Co', 71.72, 0.02, 0.03, '9/1 12:00am'],
                    ['Alcoa Inc', 29.01, 0.42, 1.47, '9/1 12:00am'],
                    ['Boeing Co.', 75.43, 0.53, 0.71, '9/1 12:00am'],
                    ['Hewlett-Packard Co.', 36.53, -0.03, -0.08, '9/1 12:00am'],
                    ['Wal-Mart Stores, Inc.', 45.45, 0.73, 1.63, '9/1 12:00am']
                ]
            }),
            columns: [
                {text: "Company", flex: 1, dataIndex: 'company'},
                {text: "Price", renderer: Ext.util.Format.usMoney, dataIndex: 'price'},
                {text: "Change", dataIndex: 'change'},
                {text: "% Change", dataIndex: 'pctChange'},
                {text: "Last Updated", renderer: Ext.util.Format.dateRenderer('m/d/Y'), dataIndex: 'lastChange'}
            ],
            plugins: [{
                ptype: 'rowexpander',
                rowBodyTpl: new Ext.XTemplate(
                    '<p><b>Company:</b> {company}</p>',
                    '<p><b>Change:</b> {change:this.formatChange}</p><br>',
                    '<p><b>Summary:</b> {desc}</p>',
                    {
                        formatChange: function (v) {
                            var color = v >= 0 ? 'green' : 'red';
                            return '<span style="color: ' + color + ';">' + Ext.util.Format.usMoney(v) + '</span>';
                        }
                    })
            }],
            collapsible: true,
            animCollapse: false,
            title: 'Expander Rows in a Collapsible Grid',
            iconCls: 'icon-grid'
        });
        this.callParent(arguments);

    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'doSearch', me.doSearch, me);
        me.callParent();
    }
});





