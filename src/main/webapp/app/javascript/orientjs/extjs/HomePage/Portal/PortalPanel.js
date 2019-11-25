/**
 * @class Ext.app.PortalPanel
 * @extends OrientTdm.Common.Extend.Panel.OrientPanel
 * A {@link OrientTdm.Common.Extend.Panel.OrientPanel Panel} class used for providing drag-drop-enabled portal layouts.
 */
Ext.define('OrientTdm.HomePage.Portal.PortalPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.orientPortalPanel',
    requires: [
        'OrientTdm.HomePage.Portal.PortalDropZone',
        'OrientTdm.HomePage.Portal.PortalColumn'
    ],
    cls: 'x-portal',
    bodyCls: 'x-portal-body',
    defaultType: 'orientPortalColumn',
    autoScroll: true,
    manageHeight: false,
    initComponent: function () {
        var me = this;
        // Implement a Container beforeLayout call from the layout to this Container
        this.layout = {
            type: 'column'
        };
        this.callParent();
        this.addEvents({
            validatedrop: true,
            beforedragover: true,
            dragover: true,
            beforedrop: true,
            drop: true
        });
    },

    // Set columnWidth, and set first and last column classes to allow exact CSS targeting.
    beforeLayout: function () {
        var items = this.layout.getLayoutItems(),
            len = items.length,
            firstAndLast = ['x-portal-column-first', 'x-portal-column-last'],
            i, item, last;

        for (i = 0; i < len; i++) {
            item = items[i];
            //修复IE 下 column少一个的Bug
            if (Ext.isIE) {
                item.columnWidth = 1 / len - 0.01;
            }
            last = (i == len - 1);

            if (!i) { // if (first)
                if (last) {
                    item.addCls(firstAndLast);
                } else {
                    item.addCls('x-portal-column-first');
                    item.removeCls('x-portal-column-last');
                }
            } else if (last) {
                item.addCls('x-portal-column-last');
                item.removeCls('x-portal-column-first');
            } else {
                item.removeCls(firstAndLast);
            }
        }

        return this.callParent(arguments);
    },

    // private
    initEvents: function () {
        this.callParent();
        this.dd = Ext.create('OrientTdm.HomePage.Portal.PortalDropZone', this, this.dropConfig);
    },

    // private
    beforeDestroy: function () {
        if (this.dd) {
            this.dd.unreg();
        }
        this.callParent();
    }
});
