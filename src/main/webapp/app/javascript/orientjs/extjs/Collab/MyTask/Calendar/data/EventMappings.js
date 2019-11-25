Ext.ns('OrientTdm.Collab.MyTask.Calendar.data');

OrientTdm.Collab.MyTask.Calendar.data.EventMappings = {
    //任务ID 合并计划任务 审批任务 以及协同任务 ID确保唯一
    EventId: {
        name: 'id',
        mapping: 'id',
        type: 'int'
    },
    //任务类型ID，详细参考TaskTypes.js
    TaskTypeId: {
        name: 'tid',
        mapping: 'tid',
        type: 'int'
    },
    //任务名称
    Title: {
        name: 'title',
        mapping: 'title',
        type: 'string'
    },
    //开始时间：若任务已经完成，则显示实际开始时间，否则显示任务计划开始时间 格式参考Events.js
    StartDate: {
        name: 'start',
        mapping: 'start',
        type: 'date',
        dateFormat: 'Y-m-d'
    },
    //结束时间：若任务已经完成，则显示实际结束时间，否则显示任务计划结束时间 格式参考Events.js
    EndDate: {
        name: 'end',
        mapping: 'end',
        type: 'date',
        dateFormat: 'Y-m-d'
    },
    //任务备注
    Notes: {
        name: 'notes',
        mapping: 'notes',
        type: 'string'
    },
    //是否全天任务，全天任务在周，天视图中以 +n more的方式展现
    IsAllDay: {
        name: 'ad',
        mapping: 'ad',
        type: 'boolean'
    },
    //是否提醒，可改造为是否截至日期快到，可更换图标 加强突出显示
    Reminder: {
        name: 'rem',
        mapping: 'rem',
        type: 'string'
    },
    //是否是已经完成的任务
    IsNew: {
        name: 'n',
        mapping: 'n',
        type: 'boolean'
    },
    ModelName:{
        name: 'mn',
        mapping: 'mn',
        type: 'String'
    },
    DataId:{
        name: 'di',
        mapping: 'di',
        type: 'String'
    }
};
