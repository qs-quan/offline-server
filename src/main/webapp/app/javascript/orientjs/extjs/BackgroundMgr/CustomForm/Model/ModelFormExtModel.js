/**
 * Created by enjoy on 2016/3/16 0016.
 */
Ext.define('OrientTdm.BackgroundMgr.CustomForm.Model.ModelFormExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'desc',
        'categoryid',
        'title',
        'html',
        'template',
        'versionno',
        'isdefault',
        'ispublished',
        'publishedby',
        'publishtime',
        'createby',
        'createtime',
        'designtype',
        'modelid',
        'templateid',
        //扩展类型
        'modelid_display'
    ]
});