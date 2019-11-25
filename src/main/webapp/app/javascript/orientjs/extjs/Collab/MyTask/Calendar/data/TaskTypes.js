Ext.define('OrientTdm.Collab.MyTask.Calendar.data.TaskTypes', {
    statics: {
        getData: function () {
            return {
                "taskTypes": [{
                    "id": 1,
                    "title": "计划任务"
                }, {
                    "id": 2,
                    "title": "协同任务"
                }, {
                    "id": 3,
                    "title": "审批任务"
                }, {
                    "id": 4,
                    "title": "数据任务"
                }]
            };
        }
    }
});