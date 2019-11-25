/**
 * Created by enjoy on 2016/4/29 0029.
 */
Ext.define('OrientTdm.SysMgr.BackUpJob.Model.BackUpJobExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'isstarttimeback',
        'backname',
        'isbackdata',
        'isdayback',
        'daybacktime',
        'ismonthback',
        'monthbackday',
        'monthbacktime',
        'isweekback',
        'weekbackday',
        'weekbacktime',
        'backtype'
    ]
});