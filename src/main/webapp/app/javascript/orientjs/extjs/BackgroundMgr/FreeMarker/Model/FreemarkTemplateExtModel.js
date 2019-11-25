/**
 * Created by enjoy on 2016/3/16 0016.
 */
Ext.define('OrientTdm.BackgroundMgr.FreeMarker.Model.FreemarkTemplateExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id', 'name', 'alias', 'type', 'macroAlias','html','canedit','desc'
    ]
});