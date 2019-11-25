/**
 * Created by enjoy on 2016/4/29 0029.
 */
Ext.define('OrientTdm.SysMgr.ModelRightsMgr.Model.ModelRightsExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'tableId',
        'columnId',
        'addColumnIds',
        'detailColumnIds',
        'modifyColumnIds',
        'exportColumnIds',
        'operationsId',
        'filter',
        'userFilter',
        'isTable',
        'roleInfo',
        'tableName'
    ]
});