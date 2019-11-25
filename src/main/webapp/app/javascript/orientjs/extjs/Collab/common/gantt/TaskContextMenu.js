//extended context menu, color picker added
Ext.define('OrientTdm.Collab.common.gantt.TaskContextMenu', {
    extend: 'Gnt.plugin.TaskContextMenu',

    createMenuItems : function() {
        return [{
                handler: this.deleteTask,
                requiresTask: true,
                itemId: "deleteTask",
                text: '删除'
            },
            {
                handler: this.toggleMilestone,
                requiresTask: true,
                itemId: "toggleMilestone",
                text: '转化为里程碑'
            },
            {
                text: '新增',
                itemId: "add",
                menu: {
                    plain: true,
                    defaults: {
                        scope: this
                    },
                    items: [
                        {
                            handler: this.customAddTaskBelowAction,
                            text: '增加计划'
                        },
                        {
                            handler: this.addMilestone,
                            requiresTask: true,
                            text: '增加里程碑'
                        },
                        {
                            handler: this.addSubtask,
                            requiresTask: true,
                            text: '增加子计划'
                        },
                        {
                            handler: this.addSuccessor,
                            requiresTask: true,
                            text: '增加前驱'
                        },
                        {
                            handler: this.addPredecessor,
                            requiresTask: true,
                            text: '增加后继'
                        }]
                }
            },
            {
                text: '删除依赖关系',
                requiresTask: true,
                itemId: "deleteDependencyMenu",
                isDependenciesMenu: true,
                menu: {
                    plain: true,
                    listeners: {
                        beforeshow: this.populateDependencyMenu,
                        mouseover: this.onDependencyMouseOver,
                        mouseleave: this.onDependencyMouseOut,
                        scope: this
                    }
                }
            }]
    },
    customAddTaskBelowAction : function (){
        this.addTaskBelow(this.copyTask(this.rec))
    },
    configureMenuItems : function () {
        this.callParent(arguments);

        var rec = this.rec;
        
        // there can be no record when clicked on the empty space in the schedule
        if (!rec) return;
    }
});
