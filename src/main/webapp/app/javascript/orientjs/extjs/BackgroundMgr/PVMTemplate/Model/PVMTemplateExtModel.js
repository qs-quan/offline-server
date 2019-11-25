/**
 * Created by Administrator on 2016/8/8 0008.
 * 检查模板前端模型
 */
Ext.define('OrientTdm.BackgroundMgr.PVMTemplate.Model.PVMTemplateExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'checkmodelid',
        'templatepath',
        'groupname',
        'createuser',
        'uploadtime',
        'checkmodelid_display'
    ]
});