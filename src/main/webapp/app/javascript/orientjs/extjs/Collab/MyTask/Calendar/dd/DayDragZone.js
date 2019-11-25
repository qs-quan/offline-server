/*
 * Internal drag zone implementation for the calendar day and week views.
 */
Ext.define('OrientTdm.Collab.MyTask.Calendar.dd.DayDragZone', {
    extend: 'OrientTdm.Collab.MyTask.Calendar.dd.DragZone',
    requires: [
        'OrientTdm.Collab.MyTask.Calendar.data.EventMappings'
    ],

    ddGroup: 'DayViewDD',
    resizeSelector: '.ext-evt-rsz',

    getDragData: function(e) {
        var t = e.getTarget(this.resizeSelector, 2, true),
            p,
            rec;
        if (t) {
            p = t.parent(this.eventSelector);
            rec = this.view.getEventRecordFromEl(p);

            return {
                type: 'eventresize',
                ddel: p.dom,
                eventStart: rec.data[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.StartDate.name],
                eventEnd: rec.data[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.EndDate.name],
                proxy: this.proxy
            };
        }
        t = e.getTarget(this.eventSelector, 3);
        if (t) {
            rec = this.view.getEventRecordFromEl(t);
            return {
                type: 'eventdrag',
                ddel: t,
                eventStart: rec.data[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.StartDate.name],
                eventEnd: rec.data[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.EndDate.name],
                proxy: this.proxy
            };
        }

        // If not dragging/resizing an event then we are dragging on
        // the calendar to add a new event
        t = this.view.getDayAt(e.getPageX(), e.getPageY());
        if (t.el) {
            return {
                type: 'caldrag',
                dayInfo: t,
                proxy: this.proxy
            };
        }
        return null;
    }
});