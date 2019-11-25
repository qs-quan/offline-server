/*
 * This calendar application was forked from OrientTdm.Collab.MyTask.Calendar Pro
 * and contributed to Ext JS as an advanced example of what can 
 * be built using and customizing Ext components and templates.
 * 
 * If you find this example to be useful you should take a look at
 * the original project, which has more features, more examples and
 * is maintained on a regular basis:
 * 
 *  http://ext.ensible.com/products/calendar
 */
Ext.define('OrientTdm.Collab.MyTask.Calendar.CalendarTaskPanel', {
        extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
        alias: 'widget.calendarTaskPanel',
        requires: [
            'OrientTdm.Collab.MyTask.Calendar.util.Date',
            'OrientTdm.Collab.MyTask.Calendar.CalendarPanel',
            'OrientTdm.Collab.MyTask.Calendar.data.MemoryTaskTypeStore',
            'OrientTdm.Collab.MyTask.Calendar.data.MemoryEventStore',
            'OrientTdm.Collab.MyTask.Calendar.data.Events',
            'OrientTdm.Collab.MyTask.Calendar.data.TaskTypes',
            'OrientTdm.Collab.MyTask.Calendar.form.EventWindow'
        ],
        config:{
            userId:''
        },
        initComponent: function () {
            var me = this;
            // Minor workaround for OSX Lion scrollbars
            this.checkScrollOffset();
            // This is an example calendar store that enables event color-coding
            this.taskTypeStore = Ext.create('OrientTdm.Collab.MyTask.Calendar.data.MemoryTaskTypeStore', {
                data: OrientTdm.Collab.MyTask.Calendar.data.TaskTypes.getData()
            });
            this.eventStore = Ext.create('OrientTdm.Collab.MyTask.Calendar.data.MemoryEventStore', {
                model: 'OrientTdm.Collab.MyTask.Calendar.data.EventModel',
                autoLoad: false,
                proxy: {
                    type: 'ajax',
                    api: {
                        "read": serviceName + "/calendarView/events/currentUser.rdm"
                    },
                    reader: {
                        type: 'json',
                        root: 'evts'
                    },
                    extraParams:{
                        userId:me.userId
                    }
                }
            });
            Ext.apply(me, {
                layout: 'border',
                items: [{
                    itemId: 'app-center',
                    title: '...', // will be updated to the current view's date range
                    region: 'center',
                    layout: 'border',
                    listeners: {
                        'afterrender': function () {
                            //Ext.getCmp('app-center').header.addCls('app-center-header');
                        }
                    },
                    items: [{
                        xtype: 'container',
                        itemId: 'app-west',
                        region: 'west',
                        width: 0,
                        items: [{
                            xtype: 'datepicker',
                            itemId: 'app-nav-picker',
                            cls: 'ext-cal-nav-picker',
                            listeners: {
                                'select': {
                                    fn: function (dp, dt) {
                                        this.down('#app-calendar').setStartDate(dt);
                                    },
                                    scope: this
                                }
                            }
                        }]
                    }, {
                        xtype: 'orientcalendarpanel',
                        eventStore: this.eventStore,
                        taskTypeStore: this.taskTypeStore,
                        border: false,
                        itemId: 'app-calendar',
                        region: 'center',
                        activeItem: 3, // month view

                        monthViewCfg: {
                            showHeader: true,
                            showWeekLinks: true,
                            showWeekNumbers: true
                        },

                        listeners: {
                            'eventclick': {
                                fn: function (vw, rec, el) {
                                    this.showEditWindow(rec, el);
                                },
                                scope: this
                            },
                            'eventover': function (vw, rec, el) {
                                //console.log('Entered evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                            },
                            'eventout': function (vw, rec, el) {
                                //console.log('Leaving evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                            },
                            'eventadd': {
                                fn: function (cp, rec) {

                                },
                                scope: this
                            },
                            'eventupdate': {
                                fn: function (cp, rec) {

                                },
                                scope: this
                            },
                            'eventcancel': {
                                fn: function (cp, rec) {
                                    // edit canceled
                                },
                                scope: this
                            },
                            'viewchange': {
                                fn: function (p, vw, dateInfo) {
                                    if (this.editWin) {
                                        this.editWin.hide();
                                    }
                                    if (dateInfo) {
                                        // will be null when switching to the event edit form so ignore
                                        this.down('#app-nav-picker').setValue(dateInfo.activeDate);
                                        this.updateTitle(dateInfo.viewStart, dateInfo.viewEnd);
                                    }
                                },
                                scope: this
                            },
                            'dayclick': {
                                fn: function (vw, dt, ad, el) {
                                    //this.showEditWindow({
                                    //    StartDate: dt,
                                    //    IsAllDay: ad
                                    //}, el);
                                },
                                scope: this
                            },
                            'rangeselect': {
                                fn: function (win, dates, onComplete) {
                                    this.showEditWindow(dates);
                                    this.editWin.on('hide', onComplete, this, {single: true});
                                },
                                scope: this
                            },
                            'eventmove': {
                                fn: function (vw, rec) {
                                    var mappings = OrientTdm.Collab.MyTask.Calendar.data.EventMappings,
                                        time = rec.data[mappings.IsAllDay.name] ? '' : ' \\a\\t g:i a';
                                    rec.commit();
                                },
                                scope: this
                            },
                            'eventresize': {
                                fn: function (vw, rec) {
                                    rec.commit();
                                },
                                scope: this
                            },
                            'eventdelete': {
                                fn: function (win, rec) {
                                    this.eventStore.remove(rec);
                                },
                                scope: this
                            },
                            'initdrag': {
                                fn: function (vw) {
                                    if (this.editWin && this.editWin.isVisible()) {
                                        this.editWin.hide();
                                    }
                                },
                                scope: this
                            }
                        }
                    }]
                }]
            });
            me.callParent(arguments);
            me.addEvents('refreshByUserId');
        },
        initEvents:function(){
            var me = this;
            me.callParent(arguments);
            me.mon(me,'refreshByUserId',me._refreshByUserId,me);
        },
        _refreshByUserId:function(userId){
            var me = this;
            var eventStore = me.eventStore;
            eventStore.removeAll();
            var proxy = eventStore.getProxy();
            proxy.setExtraParam('userId',userId);
            var centerPanel = me.down('#app-calendar');
            centerPanel.setStartDate(centerPanel.startDate,true)
        },
        // The edit popup window is not part of the CalendarPanel itself -- it is a separate component.
        // This makes it very easy to swap it out with a different type of window or custom view, or omit
        // it altogether. Because of this, it's up to the application code to tie the pieces together.
        // Note that this function is called from various event handlers in the CalendarPanel above.
        showEditWindow: function (rec, animateTarget) {
            if (!this.editWin) {
                this.editWin = Ext.create('OrientTdm.Collab.MyTask.Calendar.form.EventWindow', {
                    taskTypeStore: this.taskTypeStore,
                    listeners: {
                        'eventadd': {
                            fn: function (win, rec) {
                                //win.hide();
                                //rec.data.IsNew = false;
                                //this.eventStore.add(rec);
                                //this.eventStore.sync();
                            },
                            scope: this
                        },
                        'eventupdate': {
                            //fn: function (win, rec) {
                            //    win.hide();
                            //    rec.commit();
                            //    this.eventStore.sync();
                            //},
                            //scope: this
                        },
                        'eventdelete': {
                            //fn: function (win, rec) {
                            //    this.eventStore.remove(rec);
                            //    this.eventStore.sync();
                            //    win.hide();
                            //},
                            //scope: this
                        },
                        'editdetails': {
                            fn: function (win, rec) {
                                win.hide();
                                this.down('#app-calendar').showEditForm(rec);
                            }
                        }
                    }
                });
            }
            this.editWin.show(rec, animateTarget);
        },

        // The CalendarPanel itself supports the standard Panel title config, but that title
        // only spans the calendar views.  For a title that spans the entire width of the app
        // we added a title to the layout's outer center region that is app-specific. This code
        // updates that outer title based on the currently-selected view range anytime the view changes.
        updateTitle: function (startDt, endDt) {
            var p = this.down('#app-center'),
                fmt = Ext.Date.format;

            if (Ext.Date.clearTime(startDt).getTime() == Ext.Date.clearTime(endDt).getTime()) {
                p.setTitle(fmt(startDt, 'F j, Y'));
            }
            else if (startDt.getFullYear() == endDt.getFullYear()) {
                if (startDt.getMonth() == endDt.getMonth()) {
                    p.setTitle(fmt(startDt, 'F j') + ' - ' + fmt(endDt, 'j, Y'));
                }
                else {
                    p.setTitle(fmt(startDt, 'F j') + ' - ' + fmt(endDt, 'F j, Y'));
                }
            }
            else {
                p.setTitle(fmt(startDt, 'F j, Y') + ' - ' + fmt(endDt, 'F j, Y'));
            }
        },

        // OSX Lion introduced dynamic scrollbars that do not take up space in the
        // body. Since certain aspects of the layout are calculated and rely on
        // scrollbar width, we add a special class if needed so that we can apply
        // static style rules rather than recalculate sizes on each resize.
        checkScrollOffset: function () {
            var scrollbarWidth = Ext.getScrollbarSize ? Ext.getScrollbarSize().width : Ext.getScrollBarWidth();

            // We check for less than 3 because the Ext scrollbar measurement gets
            // slightly padded (not sure the reason), so it's never returned as 0.
            if (scrollbarWidth < 3) {
                Ext.getBody().addCls('x-no-scrollbar');
            }
            if (Ext.isWindows) {
                Ext.getBody().addCls('x-win');
            }
        }
    },
    function () {
        /*
         * A few Ext overrides needed to work around issues in the calendar
         */

        Ext.form.Basic.override({
            reset: function () {
                var me = this;
                // This causes field events to be ignored. This is a problem for the
                // DateTimeField since it relies on handling the all-day checkbox state
                // changes to refresh its layout. In general, this batching is really not
                // needed -- it was an artifact of pre-4.0 performance issues and can be removed.
                //me.batchLayouts(function() {
                me.getFields().each(function (f) {
                    f.reset();
                });
                //});
                return me;
            }
        });

        // Currently MemoryProxy really only functions for read-only data. Since we want
        // to simulate CRUD transactions we have to at the very least allow them to be
        // marked as completed and successful, otherwise they will never filter back to the
        // UI components correctly.
        Ext.data.MemoryProxy.override({
            updateOperation: function (operation, callback, scope) {
                operation.setCompleted();
                operation.setSuccessful();
                Ext.callback(callback, scope || this, [operation]);
            },
            create: function () {
                this.updateOperation.apply(this, arguments);
            },
            update: function () {
                this.updateOperation.apply(this, arguments);
            },
            destroy: function () {
                this.updateOperation.apply(this, arguments);
            }
        });
    });
