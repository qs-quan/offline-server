/**
 * Created by Seraph on 16/7/20.
 */
Ext.define("OrientTdm.Collab.common.gantt.assignment.AssignmentField", {
        extend: "Ext.form.field.Picker",
        alias: ["widget.tdmAssignmentfield"],
        requires: [
            "Gnt.widget.AssignmentGrid",
            "OrientTdm.Collab.common.gantt.assignment.AssignmentGrid"
        ],
        mixins: ["Gnt.mixin.Localizable"],
        matchFieldWidth: false,
        editable: false,
        task: null,
        assignmentStore: null,
        resourceStore: null,
        gridConfig: null,
        formatString: "{0} [{1}%]",
        expandPickerOnFocus: false,
        afterRender: function() {
            this.callParent(arguments);
            this.on("expand", this.onPickerExpand, this);
            if (this.expandPickerOnFocus) {
                this.on("focus",
                    function() {
                        this.expand()
                    },
                    this)
            }
        },
        createPicker: function() {
            var a = new OrientTdm.Collab.common.gantt.assignment.AssignmentGrid(Ext.apply({
                    ownerCt: this.ownerCt,
                    renderTo: document.body,
                    frame: true,
                    floating: true,
                    hidden: true,
                    height: 200,
                    width: 300,
                    resourceStore: this.task.getResourceStore(),
                    assignmentStore: this.task.getAssignmentStore(),
                    fbar: this.buildButtons()
                },
                this.gridConfig || {}));
            return a
        },
        buildButtons: function() {
            return ["->", {
                text: "保存",
                handler: function() {
                    Ext.Function.defer(this.onGridClose, Ext.isIE && !Ext.isIE9 ? 60: 30, this)
                },
                scope: this
            },
                {
                    text: "取消",
                    handler: function() {
                        this.collapse();
                        this.fireEvent("blur", this)
                    },
                    scope: this
                }]
        },
        setTask: function(a) {
            this.task = a;
            this.setRawValue(this.getDisplayValue(a))
        },
        onPickerExpand: function() {
            var a = this.resourceStore,
                b = this.picker;
            b.loadTaskAssignments(this.task.getInternalId())
        },
        onGridClose: function() {
            var b = this.picker.getSelectionModel(),
                a = b.selected;
            this.collapse();
            this.fireEvent("blur", this);
            this.fireEvent("select", this, a);
            Ext.Function.defer(this.picker.saveTaskAssignments, 1, this.picker)
        },
        collapseIf: function(b) {
            var a = this;
            if (this.picker && !b.getTarget("." + Ext.baseCSSPrefix + "editor") && !b.getTarget("." + Ext.baseCSSPrefix + "menu-item")) {
                a.callParent(arguments)
            }
        },
        mimicBlur: function(b) {
            var a = this;
            if (!b.getTarget("." + Ext.baseCSSPrefix + "editor") && !b.getTarget("." + Ext.baseCSSPrefix + "menu-item")) {
                a.callParent(arguments)
            }
        },
        getDisplayValue: function(c) {
            c = c || this.task;
            var g = [],
                f = this.assignmentStore,
                h,
                e = c.getInternalId(),
                b = c.getAssignments();
            for (var d = 0, a = b.length; d < a; d++) {
                h = b[d];
                if (h.data.Units > 0) {
                    g.push(Ext.String.format(this.formatString, h.getResourceName(), h.getUnits()))
                }
            }
            if(g.length > 0){
                return g.join(", ");
            }else{
                return c.data.resourceName;
            }
        }
    },
    function() {
        Gnt.widget.AssignmentCellEditor = function() {
            var a = console;
            if (a && a.log) {
                a.log("Gnt.widget.AssignmentCellEditor is deprecated and should no longer be used. Instead simply use Gnt.field.Assignment.")
            }
        }
    }
);