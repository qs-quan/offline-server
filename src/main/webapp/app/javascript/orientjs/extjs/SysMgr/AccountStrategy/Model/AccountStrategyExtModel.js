/**
 * Created by enjoy on 2016/4/29 0029.
 */
Ext.define('OrientTdm.SysMgr.AccountStrategy.Model.AccountStrategyExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'strategyName',
        'strategyNote',
        'strategyValue1',
        'strategyValue2',
        'isUse',
        'type',
        'strategyValue'
    ]
});