/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.CustomGrid.Model.ModelGridExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'alias',
        'style',
        'needpage',
        'pagesize',
        'displayfield',
        'addfield',
        'editfield',
        'btns',
        'detailfield',
        'queryfield',
        'modelid',
        'templateid',
        'versionno',
        'isdefault',
        'extendclass',
        //扩展类型
        'modelid_display'
    ]
});