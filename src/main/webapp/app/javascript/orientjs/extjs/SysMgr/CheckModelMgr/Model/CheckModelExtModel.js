/**
 * Created by qjs on 2016/11/8.
 */
Ext.define('OrientTdm.SysMgr.CheckModelMgr.Model.CheckModelExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'columnId',
        'modelId',
        'columnName',
        'checkType',
        'checkTypeName',
        'isRequired',
        'isRequiredName',
        'isBindPhoto',
        'isBindPhotoName'
    ]
});