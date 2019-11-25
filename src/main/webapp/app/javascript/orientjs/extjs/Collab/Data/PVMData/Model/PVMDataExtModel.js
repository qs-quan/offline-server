/**
 * Created by Administrator on 2016/8/8 0008.
 * 检查模板前端模型
 */
Ext.define('OrientTdm.Collab.Data.PVMData.Model.PVMTemplateExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'taskmodelid',
        'taskdataid',
        'checkmodelid',
        'checktablestatus',
        'signroles',
        'signnames',
        'uploaduser',
        'uploadtime',
        'html',
        'remark',
        //前台包装
        'checkmodelid_display'
    ]
});