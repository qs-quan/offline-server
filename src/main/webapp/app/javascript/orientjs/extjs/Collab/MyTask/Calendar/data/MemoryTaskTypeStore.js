/*
 * A simple reusable store that loads static calendar field definitions into memory
 * and can be bound to the CalendarCombo widget and used for calendar color selection.
 */
Ext.define('OrientTdm.Collab.MyTask.Calendar.data.MemoryTaskTypeStore', {
    extend: 'Ext.data.Store',
    model: 'OrientTdm.Collab.MyTask.Calendar.data.TaskTypeModel',
    
    requires: [
        'OrientTdm.Collab.MyTask.Calendar.data.TaskTypeModel',
        'OrientTdm.Collab.MyTask.Calendar.data.TaskTypeMappings'
    ],
    //TODO 修改为AjaxProxy 从后台获取
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'taskTypes'
        },
        writer: {
            type: 'json'
        }
    },

    autoLoad: true,
    
    initComponent: function() {
        var me = this,
            calendarData = OrientTdm.Collab.MyTask.Calendar.data;
            
        me.sorters = me.sorters || [{
            property: calendarData.TaskTypeMappings.Title.name,
            direction: 'ASC'
        }];
        
        me.idProperty = me.idProperty || calendarData.TaskTypeMappings.TaskTypeId.name || 'id';
        
        me.fields = calendarData.CalendarModel.prototype.fields.getRange();
        
        me.callParent(arguments);
    }
});