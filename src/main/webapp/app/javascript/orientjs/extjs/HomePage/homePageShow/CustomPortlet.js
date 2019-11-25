/**
 * @class Ext.app.Portlet
 * @extends OrientTdm.Common.Extend.Panel.OrientPanel
 * A {@link OrientTdm.Common.Extend.Panel.OrientPanel Panel} class that is managed by {@link Ext.app.PortalPanel}.
 */
Ext.define('OrientTdm.HomePage.homePageShow.CustomPortlet', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.customPortlet',
    layout: 'fit',
    anchor: '100%',
    //padding:'5 5 5 5',
    frame: true,
    closable: true,//设置不能关闭
    collapsible: false,//设置不能收起
    animCollapse: false,//面板闭合动画效果
    draggable: {
        moveOnDrag: false //面板拖拽
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
        if(me.title){
            Ext.apply(me, {
                tools: [
                    {
                        type: 'refresh',
                        handler: function (tool, toolHtml, panel) {
                            var contanentPanel = panel.up('customPortlet').items.get(0);
                            contanentPanel.fireEvent('refreshGrid');
                        }
                    }
                ]
            });
        }
        me.callParent(arguments);
    }
});