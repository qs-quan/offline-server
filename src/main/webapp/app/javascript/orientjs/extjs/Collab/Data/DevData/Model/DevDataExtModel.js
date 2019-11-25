/**
 * Created by Administrator on 2016/7/21 0021.
 */
Ext.define('OrientTdm.Collab.Data.DevData.Model.DevDataExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'datatypeId',
        'dataobjectname',
        'isref',
        'dimension',
        'value',
        'parentdataobjectid',
        'ordernumber',
        'subtypeid',
        'subtypeparentid',
        'fileid',
        'createUser',
        'modifiedUser',
        'modifytime',
        'version',
        'unit',
        'description',
        'isglobal',
        'modelid',
        'dataid',
        'createBy',
        //额外字段
        'dataTypeShowName',
        //所属基础类型'string','file',...
        'extendsTypeRealName'
    ]
});