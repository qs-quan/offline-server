/**
 * @class OrientTdm.Collab.MyTask.Calendar.form.EventWindow
 * @extends Ext.Window
 * <p>A custom window containing a basic edit form used for quick editing of events.</p>
 * <p>This window also provides custom events specific to the calendar so that other calendar components can be easily
 * notified when an event has been edited via this component.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('OrientTdm.Collab.MyTask.Calendar.form.EventWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.orienteventeditwindow',

    requires: [
        'OrientTdm.Collab.MyTask.Calendar.util.Date',
        'OrientTdm.Collab.MyTask.Calendar.data.EventModel',
        'OrientTdm.Collab.MyTask.Calendar.data.EventMappings'
    ],

    constructor: function (config) {
        var formPanelCfg = {
            xtype: 'form',
            fieldDefaults: {
                msgTarget: 'side',
                labelWidth: 65
            },
            frame: false,
            bodyStyle: 'background:transparent;padding:5px 10px 10px;',
            bodyBorder: false,
            border: false,
            items: [{
                itemId: 'title',
                name: OrientTdm.Collab.MyTask.Calendar.data.EventMappings.Title.name,
                fieldLabel: '任务名称',
                xtype: 'textfield',
                allowBlank: false,
                emptyText: 'Event Title',
                anchor: '100%'
            },
                {
                    xtype: 'orientdaterangefield',
                    itemId: 'date-range',
                    name: 'dates',
                    anchor: '100%',
                    fieldLabel: '任务周期'
                }]
        };

        if (config.taskTypeStore) {
            this.taskTypeStore = config.taskTypeStore;
            delete config.taskTypeStore;

            formPanelCfg.items.push({
                xtype: 'orientcalendarpicker',
                itemId: 'taskTypeId',
                name: OrientTdm.Collab.MyTask.Calendar.data.EventMappings.TaskTypeId.name,
                anchor: '100%',
                store: this.taskTypeStore
            });
        }

        formPanelCfg.items.push({
            xtype: 'textarea',
            itemId: 'notes',
            name: OrientTdm.Collab.MyTask.Calendar.data.EventMappings.Notes.name,
            anchor: '100%',
            fieldLabel: '任务备注'
        });

        this.callParent([Ext.apply({
                titleTextAdd: '增加任务',
                titleTextEdit: '任务简介',
                width: 600,
                autocreate: true,
                border: true,
                closeAction: 'hide',
                modal: false,
                resizable: false,
                buttonAlign: 'left',
                savingMessage: 'Saving changes...',
                deletingMessage: 'Deleting event...',
                layout: 'fit',

                defaultFocus: 'title',
                onEsc: function (key, event) {
                    event.target.blur(); // Remove the focus to avoid doing the validity checks when the window is shown again.
                    this.onCancel();
                },

                fbar: [{
                    xtype: 'tbtext',
                    text: '<a href="#" id="tblink">查看任务详细</a>'
                },
                    '->',
                    //{
                    //    itemId: 'delete-btn',
                    //    text: 'Delete Event',
                    //    disabled: false,
                    //    handler: this.onDelete,
                    //    scope: this,
                    //    minWidth: 150,
                    //    hideMode: 'offsets'
                    //},
                    //{
                    //    text: 'Save',
                    //    disabled: false,
                    //    handler: this.onSave,
                    //    scope: this
                    //},
                    {
                        text: '关闭',
                        iconCls: 'icon-close',
                        disabled: false,
                        handler: this.onCancel,
                        scope: this
                    }],
                items: formPanelCfg
            },
            config)]);
    },

    // private
    newId: 10000,

    // private
    initComponent: function () {
        this.callParent();

        this.formPanel = this.items.items[0];

        this.addEvents({
            /**
             * @event eventadd
             * Fires after a new event is added
             * @param {OrientTdm.Collab.MyTask.Calendar.form.EventWindow} this
             * @param {OrientTdm.Collab.MyTask.Calendar.EventRecord} rec The new {@link OrientTdm.Collab.MyTask.Calendar.EventRecord record} that was added
             */
            eventadd: true,
            /**
             * @event eventupdate
             * Fires after an existing event is updated
             * @param {OrientTdm.Collab.MyTask.Calendar.form.EventWindow} this
             * @param {OrientTdm.Collab.MyTask.Calendar.EventRecord} rec The new {@link OrientTdm.Collab.MyTask.Calendar.EventRecord record} that was updated
             */
            eventupdate: true,
            /**
             * @event eventdelete
             * Fires after an event is deleted
             * @param {OrientTdm.Collab.MyTask.Calendar.form.EventWindow} this
             * @param {OrientTdm.Collab.MyTask.Calendar.EventRecord} rec The new {@link OrientTdm.Collab.MyTask.Calendar.EventRecord record} that was deleted
             */
            eventdelete: true,
            /**
             * @event eventcancel
             * Fires after an event add/edit operation is canceled by the user and no store update took place
             * @param {OrientTdm.Collab.MyTask.Calendar.form.EventWindow} this
             * @param {OrientTdm.Collab.MyTask.Calendar.EventRecord} rec The new {@link OrientTdm.Collab.MyTask.Calendar.EventRecord record} that was canceled
             */
            eventcancel: true,
            /**
             * @event editdetails
             * Fires when the user selects the option in this window to continue editing in the detailed edit form
             * (by default, an instance of {@link OrientTdm.Collab.MyTask.Calendar.orienteventeditform}. Handling code should hide this window
             * and transfer the current event record to the appropriate instance of the detailed form by showing it
             * and calling {@link OrientTdm.Collab.MyTask.Calendar.orienteventeditform#loadRecord loadRecord}.
             * @param {OrientTdm.Collab.MyTask.Calendar.form.EventWindow} this
             * @param {OrientTdm.Collab.MyTask.Calendar.EventRecord} rec The {@link OrientTdm.Collab.MyTask.Calendar.EventRecord record} that is currently being edited
             */
            editdetails: true
        });
    },

    // private
    afterRender: function () {
        this.callParent();

        this.el.addCls('ext-cal-event-win');

        Ext.get('tblink').on('click', this.onEditDetailsClick, this);

        this.titleField = this.down('#title');
        this.dateRangeField = this.down('#date-range');
        this.taskTypeField = this.down('#taskTypeId');
    },

    // private
    onEditDetailsClick: function (e) {
        e.stopEvent();
        this.updateRecord(this.activeRecord, true);
        this.fireEvent('editdetails', this, this.activeRecord, this.animateTarget);
    },

    /**
     * Shows the window, rendering it first if necessary, or activates it and brings it to front if hidden.
     * @param {Ext.data.Record/Object} o Either a {@link Ext.data.Record} if showing the form
     * for an existing event in edit mode, or a plain object containing a StartDate property (and
     * optionally an EndDate property) for showing the form in add mode.
     * @param {String/Element} animateTarget (optional) The target element or id from which the window should
     * animate while opening (defaults to null with no animation)
     * @return {Ext.Window} this
     */
    show: function (o, animateTarget) {
        // Work around the CSS day cell height hack needed for initial render in IE8/strict:
        var me = this,
            anim = (Ext.isIE8 && Ext.isStrict) ? null : animateTarget,
            M = OrientTdm.Collab.MyTask.Calendar.data.EventMappings;

        this.callParent([anim, function () {
            me.titleField.focus(true);
        }]);

        var rec,
            f = this.formPanel.form;

        if (o.data) {
            rec = o;
            this.setTitle(rec.phantom ? this.titleTextAdd : this.titleTextEdit);
            f.loadRecord(rec);
        }
        else {
            this.setTitle(this.titleTextAdd);

            var start = o[M.StartDate.name],
                end = o[M.EndDate.name] || OrientTdm.Collab.MyTask.Calendar.util.Date.add(start, {hours: 1});

            rec = Ext.create('OrientTdm.Collab.MyTask.Calendar.data.EventModel');
            rec.data[M.StartDate.name] = start;
            rec.data[M.EndDate.name] = end;
            rec.data[M.IsAllDay.name] = !!o[M.IsAllDay.name] || start.getDate() != OrientTdm.Collab.MyTask.Calendar.util.Date.add(end, {millis: 1}).getDate();

            f.reset();
            f.loadRecord(rec);
        }

        if (this.taskTypeStore) {
            this.taskTypeField.setValue(rec.data[M.TaskTypeId.name]);
        }
        this.dateRangeField.setValue(rec.data);
        this.activeRecord = rec;

        return this;
    },

    // private
    roundTime: function (dt, incr) {
        incr = incr || 15;
        var m = parseInt(dt.getMinutes(), 10);
        return dt.add('mi', incr - (m % incr));
    },

    // private
    onCancel: function () {
        this.cleanup(true);
        this.fireEvent('eventcancel', this);
    },

    // private
    cleanup: function (hide) {
        if (this.activeRecord && this.activeRecord.dirty) {
            this.activeRecord.reject();
        }
        delete this.activeRecord;

        if (hide === true) {
            // Work around the CSS day cell height hack needed for initial render in IE8/strict:
            //var anim = afterDelete || (Ext.isIE8 && Ext.isStrict) ? null : this.animateTarget;
            this.hide();
        }
    },

    // private
    updateRecord: function (record, keepEditing) {
        var fields = record.fields,
            values = this.formPanel.getForm().getValues(),
            name,
            M = OrientTdm.Collab.MyTask.Calendar.data.EventMappings,
            obj = {};

        fields.each(function (f) {
            name = f.name;
            if (name in values) {
                obj[name] = values[name];
            }
        });

        var dates = this.dateRangeField.getValue();
        obj[M.StartDate.name] = dates[0];
        obj[M.EndDate.name] = dates[1];
        obj[M.IsAllDay.name] = dates[2];

        record.beginEdit();
        record.set(obj);

        if (!keepEditing) {
            record.endEdit();
        }

        return this;
    },

    // private
    onSave: function () {
        if (!this.formPanel.form.isValid()) {
            return;
        }
        if (!this.updateRecord(this.activeRecord)) {
            this.onCancel();
            return;
        }
        this.fireEvent(this.activeRecord.phantom ? 'eventadd' : 'eventupdate', this, this.activeRecord, this.animateTarget);

        // Clear phantom and modified states.
        this.activeRecord.commit();
    },

    // private
    onDelete: function () {
        this.fireEvent('eventdelete', this, this.activeRecord, this.animateTarget);
    }
});