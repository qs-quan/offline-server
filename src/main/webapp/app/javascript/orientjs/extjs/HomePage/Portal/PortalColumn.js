/**
 * @class Ext.app.PortalColumn
 * @extends Ext.container.Container
 * A layout column class used internally be {@link Ext.app.PortalPanel}.
 */
Ext.define('OrientTdm.HomePage.Portal.PortalColumn', {
    extend: 'Ext.container.Container',
    alias: 'widget.orientPortalColumn',

    requires: [
        'OrientTdm.HomePage.Portal.Portlet'
    ],

    layout: 'anchor',
    defaultType: 'orientPorlet',
    cls: 'x-portal-column'

    // This is a class so that it could be easily extended
    // if necessary to provide additional behavior.
});