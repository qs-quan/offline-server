/**
 * @class Ext.app.Portlet
 * @extends OrientTdm.Common.Extend.Panel.OrientPanel
 * A {@link OrientTdm.Common.Extend.Panel.OrientPanel Panel} class that is managed by {@link Ext.app.PortalPanel}.
 */
Ext.define('OrientTdm.HomePage.Portal.Portlet', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.orientPorlet',
    layout: 'fit',
    anchor: '100%',
    //padding:'5 5 5 5',
    frame: true,
    closable: true,
    collapsible: true,
    animCollapse: true,
    draggable: {
        moveOnDrag: false
    },
    cls: 'x-portlet',

    // Override Panel's default doClose to provide a custom fade out effect
    // when a portlet is removed from the portal
    doClose: function () {
        if (!this.closing) {
            this.closing = true;
            this.el.animate({
                opacity: 0,
                callback: function () {
                    var closeAction = this.closeAction;
                    this.closing = false;
                    this.fireEvent('close', this);
                    this[closeAction]();
                    if (closeAction == 'hide') {
                        this.el.setOpacity(1);
                    }
                },
                scope: this
            });

        }
    },
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            tools: [
                {
                    type: 'maximize',
                    handler: function (tool, toolHtml, panel) {
                        var contanentPanel = panel.up('orientPorlet').items.get(0);
                        var item = Ext.widget(contanentPanel.xtype);
                        OrientExtUtil.WindowHelper.createWindow(item, {
                            maximized: true,
                            title: panel.up('orientPorlet').title
                        });
                    }
                }
            ]
        });
        me.callParent(arguments);
    }
});