/**
 * Created by Seraph on 16/9/22.
 */
Ext.define('OrientTdm.Collab.common.template.model.TemplateListModel', {
    extend : 'Ext.data.Model',
    fields : [
        'id',
        { name : 'name'},
        { name : 'version'},
        { name : 'type'},
        { name : 'privateTemp'},
        { name : 'exportUserId'},
        { name : 'auditUserId'},
        { name : 'createUserDisplayName'},
        { name : 'auditUserDisplayName'},
        { name : 'createTimeValue'}
    ]
});