/**
 * @class OrientTdm.Collab.MyTask.Calendar.view.Week
 * @extends OrientTdm.Collab.MyTask.Calendar.DayView
 * <p>Displays a calendar view by week. This class does not usually need ot be used directly as you can
 * use a {@link OrientTdm.Collab.MyTask.Calendar.CalendarPanel CalendarPanel} to manage multiple calendar views at once including
 * the week view.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('OrientTdm.Collab.MyTask.Calendar.view.Week', {
    extend: 'OrientTdm.Collab.MyTask.Calendar.view.Day',
    alias: 'widget.orientweekview',
    
    /**
     * @cfg {Number} dayCount
     * The number of days to display in the view (defaults to 7)
     */
    dayCount: 7
});
