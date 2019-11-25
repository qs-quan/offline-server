
Ext.define('OrientTdm.Collab.MyTask.Calendar.view.AbstractCalendar', {
    extend: 'Ext.Component',
    alias: 'widget.orientcalendarview',
    requires: [
        'OrientTdm.Collab.MyTask.Calendar.util.Date',
        'OrientTdm.Collab.MyTask.Calendar.data.EventMappings'
    ],

    startDay: 0,

    spansHavePriority: false,

    trackMouseOver: true,

    enableFx: true,

    enableAddFx: true,

    enableUpdateFx: false,

    enableRemoveFx: true,

    enableDD: false,

    monitorResize: true,

    ddCreateEventText: 'Create event for {0}',

    ddMoveEventText: 'Move event to {0}',

    ddResizeEventText: 'Update event to {0}',


    weekCount: 1,
    dayCount: 1,
    eventSelector: '.ext-cal-evt',
    eventOverClass: 'ext-evt-over',
    eventElIdDelimiter: '-evt-',
    dayElIdDelimiter: '-day-',


    getEventBodyMarkup: Ext.emptyFn,

    getEventTemplate: Ext.emptyFn,

    initComponent: function () {
        this.setStartDate(this.startDate || new Date());

        this.callParent(arguments);

        this.addEvents({

            eventsrendered: true,

            eventclick: true,

            eventover: true,

            eventout: true,

            datechange: true,

            rangeselect: true,

            eventmove: true,

            initdrag: true,

            dayover: true,

            dayout: true

        });
    },


    afterRender: function () {
        this.callParent(arguments);

        this.renderTemplate();

        if (this.store) {
            this.setStore(this.store, true);
        }

        this.el.on({
            'mouseover': this.onMouseOver,
            'mouseout': this.onMouseOut,
            'click': this.onClick,
            scope: this
        });

        this.el.unselectable();

        if (this.enableDD && this.initDD) {
            this.initDD();
        }

        this.on('eventsrendered', this.forceSize);
        Ext.defer(this.forceSize, 100, this);

    },


    forceSize: function () {
        if (this.el && this.el.down) {
            var hd = this.el.down('.ext-cal-hd-ct'),
                bd = this.el.down('.ext-cal-body-ct');

            if (bd == null || hd == null) {
                return;
            }

            var headerHeight = hd.getHeight(),
                sz = this.el.parent().getSize();

            bd.setHeight(sz.height - headerHeight);
        }
    },

    refresh: function () {
        this.prepareData();
        this.renderTemplate();
        this.renderItems();
    },

    getWeekCount: function () {
        var days = OrientTdm.Collab.MyTask.Calendar.util.Date.diffDays(this.viewStart, this.viewEnd);
        return Math.ceil(days / this.dayCount);
    },


    prepareData: function () {
        var lastInMonth = Ext.Date.getLastDateOfMonth(this.startDate),
            w = 0, d,
            dt = Ext.Date.clone(this.viewStart),
            weeks = this.weekCount < 1 ? 6 : this.weekCount;

        this.eventGrid = [[]];
        this.allDayGrid = [[]];
        this.evtMaxCount = [];

        //TODO 根据当前时间 当前视图类型 天？周？月 请求后台获取数据
        var evtsInView = this.store.queryBy(function (rec) {
                return this.isEventVisible(rec.data);
            },
            this);

        for (; w < weeks; w++) {
            this.evtMaxCount[w] = 0;
            if (this.weekCount == -1 && dt > lastInMonth) {
                //current week is fully in next month so skip
                break;
            }
            this.eventGrid[w] = this.eventGrid[w] || [];
            this.allDayGrid[w] = this.allDayGrid[w] || [];

            for (d = 0; d < this.dayCount; d++) {
                if (evtsInView.getCount() > 0) {
                    var evts = evtsInView.filterBy(function (rec) {
                            var startDt = Ext.Date.clearTime(rec.data[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.StartDate.name], true),
                                startsOnDate = dt.getTime() == startDt.getTime(),
                                spansFromPrevView = (w == 0 && d == 0 && (dt > rec.data[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.StartDate.name]));

                            return startsOnDate || spansFromPrevView;
                        },
                        this);

                    this.sortEventRecordsForDay(evts);
                    this.prepareEventGrid(evts, w, d);
                }
                dt = OrientTdm.Collab.MyTask.Calendar.util.Date.add(dt, {days: 1});
            }
        }
        this.currentWeekCount = w;
    },

    // private
    prepareEventGrid: function (evts, w, d) {
        var me = this,
            row = 0,
            max = me.maxEventsPerDay ? me.maxEventsPerDay : 999;

        evts.each(function (evt) {
            var M = OrientTdm.Collab.MyTask.Calendar.data.EventMappings,
                days = OrientTdm.Collab.MyTask.Calendar.util.Date.diffDays(
                        OrientTdm.Collab.MyTask.Calendar.util.Date.max(me.viewStart, evt.data[M.StartDate.name]),
                        OrientTdm.Collab.MyTask.Calendar.util.Date.min(me.viewEnd, evt.data[M.EndDate.name])) + 1;

            if (days > 1 || OrientTdm.Collab.MyTask.Calendar.util.Date.diffDays(evt.data[M.StartDate.name], evt.data[M.EndDate.name]) > 1) {
                me.prepareEventGridSpans(evt, me.eventGrid, w, d, days);
                me.prepareEventGridSpans(evt, me.allDayGrid, w, d, days, true);
            } else {
                row = me.findEmptyRowIndex(w, d);
                me.eventGrid[w][d] = me.eventGrid[w][d] || [];
                me.eventGrid[w][d][row] = evt;

                if (evt.data[M.IsAllDay.name]) {
                    row = me.findEmptyRowIndex(w, d, true);
                    me.allDayGrid[w][d] = me.allDayGrid[w][d] || [];
                    me.allDayGrid[w][d][row] = evt;
                }
            }

            if (me.evtMaxCount[w] < me.eventGrid[w][d].length) {
                me.evtMaxCount[w] = Math.min(max + 1, me.eventGrid[w][d].length);
            }
            return true;
        });
    },

    // private
    prepareEventGridSpans: function (evt, grid, w, d, days, allday) {

        var w1 = w,
            d1 = d,
            row = this.findEmptyRowIndex(w, d, allday),
            dt = Ext.Date.clone(this.viewStart);

        var start = {
            event: evt,
            isSpan: true,
            isSpanStart: true,
            spanLeft: false,
            spanRight: (d == 6)
        };
        grid[w][d] = grid[w][d] || [];
        grid[w][d][row] = start;

        while (--days) {
            dt = OrientTdm.Collab.MyTask.Calendar.util.Date.add(dt, {days: 1});
            if (dt > this.viewEnd) {
                break;
            }
            if (++d1 > 6) {
                // reset counters to the next week
                d1 = 0;
                w1++;
                row = this.findEmptyRowIndex(w1, 0);
            }
            grid[w1] = grid[w1] || [];
            grid[w1][d1] = grid[w1][d1] || [];

            grid[w1][d1][row] = {
                event: evt,
                isSpan: true,
                isSpanStart: (d1 == 0),
                spanLeft: (w1 > w) && (d1 % 7 == 0),
                spanRight: (d1 == 6) && (days > 1)
            };
        }
    },

    // private
    findEmptyRowIndex: function (w, d, allday) {
        var grid = allday ? this.allDayGrid : this.eventGrid,
            day = grid[w] ? grid[w][d] || [] : [],
            i = 0,
            ln = day.length;

        for (; i < ln; i++) {
            if (day[i] == null) {
                return i;
            }
        }
        return ln;
    },

    // private
    renderTemplate: function () {
        if (this.tpl) {
            this.tpl.overwrite(this.el, this.getParams());
            this.lastRenderStart = Ext.Date.clone(this.viewStart);
            this.lastRenderEnd = Ext.Date.clone(this.viewEnd);
        }
    },

    disableStoreEvents: function () {
        this.monitorStoreEvents = false;
    },

    enableStoreEvents: function (refresh) {
        this.monitorStoreEvents = true;
        if (refresh === true) {
            this.refresh();
        }
    },

    // private
    onResize: function () {
        this.callParent(arguments);
        this.refresh();
    },

    // private
    onInitDrag: function () {
        this.fireEvent('initdrag', this);
    },

    // private
    onEventDrop: function (rec, dt) {
        if (OrientTdm.Collab.MyTask.Calendar.util.Date.compare(rec.data[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.StartDate.name], dt) === 0) {
            // no changes
            return;
        }
        var diff = dt.getTime() - rec.data[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.StartDate.name].getTime();
        rec.set(OrientTdm.Collab.MyTask.Calendar.data.EventMappings.StartDate.name, dt);
        rec.set(OrientTdm.Collab.MyTask.Calendar.data.EventMappings.EndDate.name, OrientTdm.Collab.MyTask.Calendar.util.Date.add(rec.data[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.EndDate.name], {millis: diff}));

        this.fireEvent('eventmove', this, rec);
    },

    // private
    onCalendarEndDrag: function (start, end, onComplete) {
        if (start && end) {
            // set this flag for other event handlers that might conflict while we're waiting
            this.dragPending = true;

            // have to wait for the user to save or cancel before finalizing the dd interation
            var o = {};
            o[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.StartDate.name] = start;
            o[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.EndDate.name] = end;

            this.fireEvent('rangeselect', this, o, Ext.bind(this.onCalendarEndDragComplete, this, [onComplete]));
        }
    },

    // private
    onCalendarEndDragComplete: function (onComplete) {
        // callback for the drop zone to clean up
        onComplete();
        // clear flag for other events to resume normally
        this.dragPending = false;
    },

    // private
    onUpdate: function (ds, rec, operation) {
        if (this.monitorStoreEvents === false) {
            return;
        }
        if (operation == Ext.data.Record.COMMIT) {
            this.refresh();
            if (this.enableFx && this.enableUpdateFx) {
                this.doUpdateFx(this.getEventEls(rec.data[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.EventId.name]), {
                    scope: this
                });
            }
        }
    },


    doUpdateFx: function (els, o) {
        this.highlightEvent(els, null, o);
    },

    // private
    onAdd: function (ds, records, index) {
        if (this.monitorStoreEvents === false) {
            return;
        }
        var rec = records[0];
        this.tempEventId = rec.id;
        this.refresh();

        if (this.enableFx && this.enableAddFx) {
            this.doAddFx(this.getEventEls(rec.data[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.EventId.name]), {
                scope: this
            });
        }
    },

    doAddFx: function (els, o) {
        els.fadeIn(Ext.apply(o, {
            duration: 2000
        }));
    },

    // private
    onRemove: function (ds, rec) {
        if (this.monitorStoreEvents === false) {
            return;
        }
        if (this.enableFx && this.enableRemoveFx) {
            this.doRemoveFx(this.getEventEls(rec.data[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.EventId.name]), {
                remove: true,
                scope: this,
                callback: this.refresh
            });
        }
        else {
            this.getEventEls(rec.data[OrientTdm.Collab.MyTask.Calendar.data.EventMappings.EventId.name]).remove();
            this.refresh();
        }
    },

    doRemoveFx: function (els, o) {
        els.fadeOut(o);
    },


    highlightEvent: function (els, color, o) {
        if (this.enableFx) {
            var c;
            !(Ext.isIE || Ext.isOpera) ?
                els.highlight(color, o) :
                // Fun IE/Opera handling:
                els.each(function (el) {
                        el.highlight(color, Ext.applyIf({
                                attr: 'color'
                            },
                            o));
                        c = el.down('.ext-cal-evm');
                        if (c) {
                            c.highlight(color, o);
                        }
                    },
                    this);
        }
    },


    getEventIdFromEl: function (el) {
        el = Ext.get(el);
        var id = el.id.split(this.eventElIdDelimiter)[1],
            lastHypen = id.lastIndexOf('-');

        // MUST look for last hyphen because autogenned record IDs can contain hyphens
        if (lastHypen > -1) {
            //This id has the index of the week it is rendered in as the suffix.
            //This allows events that span across weeks to still have reproducibly-unique DOM ids.
            id = id.substr(0, lastHypen);
        }
        return id;
    },

    // private
    getEventId: function (eventId) {
        if (eventId === undefined && this.tempEventId) {
            eventId = this.tempEventId;
        }
        return eventId;
    },


    getEventSelectorCls: function (eventId, forSelect) {
        var prefix = forSelect ? '.' : '';
        return prefix + this.id + this.eventElIdDelimiter + this.getEventId(eventId);
    },


    getEventEls: function (eventId) {
        var els = Ext.select(this.getEventSelectorCls(this.getEventId(eventId), true), false, this.el.dom);
        return new Ext.CompositeElement(els);
    },


    isToday: function () {
        var today = Ext.Date.clearTime(new Date()).getTime();
        return this.viewStart.getTime() <= today && this.viewEnd.getTime() >= today;
    },

    // private
    onDataChanged: function (store) {
        this.refresh();
    },

    // private
    isEventVisible: function (evt) {
        var M = OrientTdm.Collab.MyTask.Calendar.data.EventMappings;
        var data = evt.data || evt;
        var start = this.viewStart.getTime();
        var end = this.viewEnd.getTime();
        var evStart = data[M.StartDate.name].getTime();
        var evEnd = data[M.EndDate.name].getTime();
        evEnd = OrientTdm.Collab.MyTask.Calendar.util.Date.add(data[M.EndDate.name], {seconds: -1}).getTime();

        return this.rangesOverlap(start, end, evStart, evEnd);
    },

    rangesOverlap: function (start1, end1, start2, end2) {
        var startsInRange = (start1 >= start2 && start1 <= end2),
            endsInRange = (end1 >= start2 && end1 <= end2),
            spansRange = (start1 <= start2 && end1 >= end2);

        return (startsInRange || endsInRange || spansRange);
    },

    // private
    isOverlapping: function (evt1, evt2) {
        var ev1 = evt1.data ? evt1.data : evt1,
            ev2 = evt2.data ? evt2.data : evt2,
            M = OrientTdm.Collab.MyTask.Calendar.data.EventMappings,
            start1 = ev1[M.StartDate.name].getTime(),
            end1 = OrientTdm.Collab.MyTask.Calendar.util.Date.add(ev1[M.EndDate.name], {seconds: -1}).getTime(),
            start2 = ev2[M.StartDate.name].getTime(),
            end2 = OrientTdm.Collab.MyTask.Calendar.util.Date.add(ev2[M.EndDate.name], {seconds: -1}).getTime();

        if (end1 < start1) {
            end1 = start1;
        }
        if (end2 < start2) {
            end2 = start2;
        }

        return (start1 <= end2 && end1 >= start2);
    },

    getDayEl: function (dt) {
        return Ext.get(this.getDayId(dt));
    },

    getDayId: function (dt) {
        if (Ext.isDate(dt)) {
            dt = Ext.Date.format(dt, 'Ymd');
        }
        return this.id + this.dayElIdDelimiter + dt;
    },


    getStartDate: function () {
        return this.startDate;
    },


    setStartDate: function (start, refresh) {
        this.startDate = Ext.Date.clearTime(start);
        this.setViewBounds(start);
        this.store.load({
            params: {
                start: Ext.Date.format(this.viewStart, 'm-d-Y'),
                end: Ext.Date.format(this.viewEnd, 'm-d-Y')
            }
        });
        if (refresh === true) {
            this.refresh();
        }
        this.fireEvent('datechange', this, this.startDate, this.viewStart, this.viewEnd);
    },

    // private
    setViewBounds: function (startDate) {
        var start = startDate || this.startDate,
            offset = start.getDay() - this.startDay,
            Dt = OrientTdm.Collab.MyTask.Calendar.util.Date;

        switch (this.weekCount) {
            case 0:
            case 1:
                this.viewStart = this.dayCount < 7 ? start : Dt.add(start, {days: -offset, clearTime: true});
                this.viewEnd = Dt.add(this.viewStart, {days: this.dayCount || 7});
                this.viewEnd = Dt.add(this.viewEnd, {seconds: -1});
                return;

            case -1:
                // auto by month
                start = Ext.Date.getFirstDateOfMonth(start);
                offset = start.getDay() - this.startDay;

                this.viewStart = Dt.add(start, {days: -offset, clearTime: true});

                // start from current month start, not view start:
                var end = Dt.add(start, {months: 1, seconds: -1});
                // fill out to the end of the week:
                this.viewEnd = Dt.add(end, {days: 6 - end.getDay()});
                return;

            default:
                this.viewStart = Dt.add(start, {days: -offset, clearTime: true});
                this.viewEnd = Dt.add(this.viewStart, {days: this.weekCount * 7, seconds: -1});
        }
    },

    // private
    getViewBounds: function () {
        return {
            start: this.viewStart,
            end: this.viewEnd
        };
    },


    sortEventRecordsForDay: function (evts) {
        if (evts.length < 2) {
            return;
        }
        evts.sortBy(Ext.bind(function (evtA, evtB) {
            var a = evtA.data,
                b = evtB.data,
                M = OrientTdm.Collab.MyTask.Calendar.data.EventMappings;

            // Always sort all day events before anything else
            if (a[M.IsAllDay.name]) {
                return -1;
            }
            else if (b[M.IsAllDay.name]) {
                return 1;
            }
            if (this.spansHavePriority) {

                var diff = OrientTdm.Collab.MyTask.Calendar.util.Date.diffDays;
                if (diff(a[M.StartDate.name], a[M.EndDate.name]) > 0) {
                    if (diff(b[M.StartDate.name], b[M.EndDate.name]) > 0) {
                        // Both events are multi-day
                        if (a[M.StartDate.name].getTime() == b[M.StartDate.name].getTime()) {
                            // If both events start at the same time, sort the one
                            // that ends later (potentially longer span bar) first
                            return b[M.EndDate.name].getTime() - a[M.EndDate.name].getTime();
                        }
                        return a[M.StartDate.name].getTime() - b[M.StartDate.name].getTime();
                    }
                    return -1;
                }
                else if (diff(b[M.StartDate.name], b[M.EndDate.name]) > 0) {
                    return 1;
                }
                return a[M.StartDate.name].getTime() - b[M.StartDate.name].getTime();
            }
            else {

                return a[M.StartDate.name].getTime() - b[M.StartDate.name].getTime();
            }
        }, this));
    },


    moveTo: function (dt, noRefresh) {
        if (Ext.isDate(dt)) {
            this.setStartDate(dt);
            if (noRefresh !== false) {
                this.refresh();
            }
            return this.startDate;
        }
        return dt;
    },


    moveNext: function (noRefresh) {
        return this.moveTo(OrientTdm.Collab.MyTask.Calendar.util.Date.add(this.viewEnd, {days: 1}));
    },


    movePrev: function (noRefresh) {
        var days = OrientTdm.Collab.MyTask.Calendar.util.Date.diffDays(this.viewStart, this.viewEnd) + 1;
        return this.moveDays(-days, noRefresh);
    },


    moveMonths: function (value, noRefresh) {
        return this.moveTo(OrientTdm.Collab.MyTask.Calendar.util.Date.add(this.startDate, {months: value}), noRefresh);
    },


    moveWeeks: function (value, noRefresh) {
        return this.moveTo(OrientTdm.Collab.MyTask.Calendar.util.Date.add(this.startDate, {days: value * 7}), noRefresh);
    },


    moveDays: function (value, noRefresh) {
        return this.moveTo(OrientTdm.Collab.MyTask.Calendar.util.Date.add(this.startDate, {days: value}), noRefresh);
    },


    moveToday: function (noRefresh) {
        return this.moveTo(new Date(), noRefresh);
    },


    setStore: function (store, initial) {
        if (!initial && this.store) {
            this.store.un("datachanged", this.onDataChanged, this);
            this.store.un("add", this.onAdd, this);
            this.store.un("remove", this.onRemove, this);
            this.store.un("update", this.onUpdate, this);
            this.store.un("clear", this.refresh, this);
        }
        if (store) {
            store.on("datachanged", this.onDataChanged, this);
            store.on("add", this.onAdd, this);
            store.on("remove", this.onRemove, this);
            store.on("update", this.onUpdate, this);
            store.on("clear", this.refresh, this);
        }
        this.store = store;
        if (store && store.getCount() > 0) {
            this.refresh();
        }
    },

    getEventRecord: function (id) {
        var idx = this.store.find(OrientTdm.Collab.MyTask.Calendar.data.EventMappings.EventId.name, id);
        return this.store.getAt(idx);
    },

    getEventRecordFromEl: function (el) {
        return this.getEventRecord(this.getEventIdFromEl(el));
    },

    // private
    getParams: function () {
        return {
            viewStart: this.viewStart,
            viewEnd: this.viewEnd,
            startDate: this.startDate,
            dayCount: this.dayCount,
            weekCount: this.weekCount,
            title: this.getTitle()
        };
    },

    getTitle: function () {
        return Ext.Date.format(this.startDate, 'F Y');
    },


    onClick: function (e, t) {
        var el = e.getTarget(this.eventSelector, 5);
        if (el) {
            var id = this.getEventIdFromEl(el);
            this.fireEvent('eventclick', this, this.getEventRecord(id), el);
            return true;
        }
    },

    // private
    onMouseOver: function (e, t) {
        if (this.trackMouseOver !== false && (this.dragZone == undefined || !this.dragZone.dragging)) {
            if (!this.handleEventMouseEvent(e, t, 'over')) {
                this.handleDayMouseEvent(e, t, 'over');
            }
        }
    },

    // private
    onMouseOut: function (e, t) {
        if (this.trackMouseOver !== false && (this.dragZone == undefined || !this.dragZone.dragging)) {
            if (!this.handleEventMouseEvent(e, t, 'out')) {
                this.handleDayMouseEvent(e, t, 'out');
            }
        }
    },

    // private
    handleEventMouseEvent: function (e, t, type) {
        var el = e.getTarget(this.eventSelector, 5, true),
            rel,
            els,
            evtId;
        if (el) {
            rel = Ext.get(e.getRelatedTarget());
            if (el == rel || el.contains(rel)) {
                return true;
            }

            evtId = this.getEventIdFromEl(el);

            if (this.eventOverClass) {
                els = this.getEventEls(evtId);
                els[type == 'over' ? 'addCls' : 'removeCls'](this.eventOverClass);
            }
            this.fireEvent('event' + type, this, this.getEventRecord(evtId), el);
            return true;
        }
        return false;
    },

    // private
    getDateFromId: function (id, delim) {
        var parts = id.split(delim);
        return parts[parts.length - 1];
    },

    // private
    handleDayMouseEvent: function (e, t, type) {
        t = e.getTarget('td', 3);
        if (t) {
            if (t.id && t.id.indexOf(this.dayElIdDelimiter) > -1) {
                var dt = this.getDateFromId(t.id, this.dayElIdDelimiter),
                    rel = Ext.get(e.getRelatedTarget()),
                    relTD,
                    relDate;

                if (rel) {
                    relTD = rel.is('td') ? rel : rel.up('td', 3);
                    relDate = relTD && relTD.id ? this.getDateFromId(relTD.id, this.dayElIdDelimiter) : '';
                }
                if (!rel || dt != relDate) {
                    var el = this.getDayEl(dt);
                    if (el && this.dayOverClass != '') {
                        el[type == 'over' ? 'addCls' : 'removeCls'](this.dayOverClass);
                    }
                    this.fireEvent('day' + type, this, Ext.Date.parseDate(dt, "Ymd"), el);
                }
            }
        }
    },

    // private
    renderItems: function () {
        throw 'This method must be implemented by a subclass';
    },

    // private
    destroy: function () {
        this.callParent(arguments);

        if (this.el) {
            this.el.un('contextmenu', this.onContextMenu, this);
        }
        Ext.destroy(
            this.editWin,
            this.eventMenu,
            this.dragZone,
            this.dropZone
        );
    }
});