/**
 * @class OrientTdm.Collab.MyTask.Calendar.template.DayHeader
 * @extends Ext.XTemplate
 * <p>This is the template used to render the all-day event container used in {@link OrientTdm.Collab.MyTask.Calendar.DayView DayView} and
 * {@link OrientTdm.Collab.MyTask.Calendar.WeekView WeekView}. Internally the majority of the layout logic is deferred to an instance of
 * {@link OrientTdm.Collab.MyTask.Calendar.BoxLayoutTemplate}.</p>
 * <p>This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link OrientTdm.Collab.MyTask.Calendar.EventRecord}.</p>
 * <p>Note that this template would not normally be used directly. Instead you would use the {@link OrientTdm.Collab.MyTask.Calendar.DayViewTemplate}
 * that internally creates an instance of this template along with a {@link OrientTdm.Collab.MyTask.Calendar.DayBodyTemplate}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('OrientTdm.Collab.MyTask.Calendar.template.DayHeader', {
    extend: 'Ext.XTemplate',
    
    requires: ['OrientTdm.Collab.MyTask.Calendar.template.BoxLayout'],
    
    constructor: function(config){
        
        Ext.apply(this, config);
        
        this.allDayTpl = new OrientTdm.Collab.MyTask.Calendar.template.BoxLayout(config);
        this.allDayTpl.compile();
        
        this.callParent([
            '<div class="ext-cal-hd-ct">',
                '<table class="ext-cal-hd-days-tbl" cellspacing="0" cellpadding="0">',
                    '<tbody>',
                        '<tr>',
                            '<td class="ext-cal-gutter"></td>',
                            '<td class="ext-cal-hd-days-td"><div class="ext-cal-hd-ad-inner">{allDayTpl}</div></td>',
                            '<td class="ext-cal-gutter-rt"></td>',
                        '</tr>',
                    '</tobdy>',
                '</table>',
            '</div>'
        ]);
    },

    applyTemplate : function(o){
        return this.applyOut({
            allDayTpl: this.allDayTpl.apply(o)
        }, []).join('');
    },
    
    apply: function(values) {
        return this.applyTemplate.apply(this, arguments);
    }
});