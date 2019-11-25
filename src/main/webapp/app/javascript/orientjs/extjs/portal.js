/**
 * @class Ext.app.Portal
 * @extends Object
 * A sample portal layout application class.
 */

Ext.define('OrientTdm.Portal', {
    extend: 'Ext.container.Viewport',
    requires: [
        'OrientTdm.BaseRequires'
    ],
    initComponent: function () {
        var me = this;

        var testMgrDashBord = Ext.create("OrientTdm.TestBomBuild.TestMgrDashBord", {});


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
                id: 'orient-center',
                xtype: 'panel',
                region: 'center',
                layout: 'fit',
                items: [
                    testMgrDashBord
                ]
            }]
        });
        this.callParent(arguments);
    }
});
