/**
 * Created by Seraph on 16/7/20.
 */
Ext.define("OrientTdm.Collab.common.gantt.assignment.AssignmentGrid", {
    extend: "Ext.grid.Panel",
    alias: "widget.tdmAssignmentgrid",
    requires: ["Gnt.model.Resource", "Gnt.model.Assignment", "Gnt.column.ResourceName", "Gnt.column.AssignmentUnits", "Ext.grid.plugin.CellEditing"],
    assignmentStore: null,
    resourceStore: null,
    readOnly: false,
    cls: "gnt-assignmentgrid",
    defaultAssignedUnits: 100,
    taskId: null,
    sorter: {
        sorterFn: function(b, a) {
            var d = b.getUnits(),
                c = a.getUnits();
            if ((!d && !c) || (d && c)) {
                return b.get("ResourceName") < a.get("ResourceName") ? -1: 1
            }
            return d ? -1: 1
        }
    },
    constructor: function(a) {
        this.store = Ext.create("Ext.data.JsonStore", {
            model: Ext.define("Gnt.model.AssignmentEditing", {
                extend: "Gnt.model.Assignment",
                fields: ["ResourceName"]
            })
        });
        this.columns = this.buildColumns();
        if (!this.readOnly) {
            this.plugins = this.buildPlugins()
        }
        Ext.apply(this, {
            selModel: {
                selType: "checkboxmodel",
                mode: "SINGLE",
                checkOnly: true,
                selectByPosition: function(b) {
                    var c = this.store.getAt(b.row);
                    this.select(c, true)
                }
            }
        });
        this.callParent(arguments)
    },
    initComponent: function() {
        this.loadResources();
        this.mon(this.resourceStore, {
            datachanged: this.loadResources,
            scope: this
        });
        this.getSelectionModel().on("select", this.onSelect, this, {
            delay: 50
        });
        this.callParent(arguments)
    },
    onSelect: function(b, a) {
        if ((!this.cellEditing || !this.cellEditing.getActiveEditor()) && !a.getUnits()) {
            a.setUnits(this.defaultAssignedUnits)
        }
    },
    loadResources: function() {
        var d = [],
            b = this.resourceStore,
            e;
        for (var c = 0, a = b.getCount(); c < a; c++) {
            e = b.getAt(c).getId();
            d.push({
                ResourceId: e,
                ResourceName: b.getById(e).getName(),
                Units: ""
            })
        }
        this.store.loadData(d)
    },
    buildPlugins: function() {
        var a = this.cellEditing = Ext.create("Ext.grid.plugin.CellEditing", {
            clicksToEdit: 1
        });
        a.on("edit", this.onEditingDone, this);
        return [a]
    },
    hide: function() {
        this.cellEditing.cancelEdit();
        this.callParent(arguments)
    },
    onEditingDone: function(a, b) {
        if (b.value) {
            this.getSelectionModel().select(b.record, true)
        } else {
            this.getSelectionModel().deselect(b.record);
            b.record.reject()
        }
    },
    buildColumns: function() {
        return [{
            xtype: "resourcenamecolumn"
        }
            // , {
            //     xtype: "assignmentunitscolumn",
            //     assignmentStore: this.assignmentStore,
            //     editor: {
            //         xtype: "numberfield",
            //         minValue: 0,
            //         step: 10
            //     }
            // }
        ]
    },
    loadTaskAssignments: function(d) {
        var b = this.store,
            f = this.getSelectionModel();
        this.taskId = d;
        f.deselectAll(true);
        for (var c = 0, a = b.getCount(); c < a; c++) {
            b.getAt(c).data.Units = "";
            b.getAt(c).data.Id = null
        }
        b.suspendEvents();
        var e = this.assignmentStore.queryBy(function(g) {
            return g.getTaskId() === d
        });
        e.each(function(h) {
            var g = b.findRecord("ResourceId", h.getResourceId(), 0, false, true, true);
            if (g) {
                g.setUnits(h.getUnits());
                g.set(g.idProperty, h.getId());
                f.select(g, true, true)
            }
        });
        b.resumeEvents();
        b.sort(this.sorter);
        this.getView().refresh()
    },
    saveTaskAssignments: function() {
        var a = this.assignmentStore,
            e = this.taskId;
        var d = {};
        var c = [];
        this.getSelectionModel().selected.each(function(g) {
            var f = g.getUnits();
            if (f > 0) {
                var i = g.getId();
                if (i) {
                    d[i] = true;
                    a.getById(i).setUnits(f)
                } else {
                    var h = Ext.create(a.model);
                    h.setTaskId(e);
                    h.setResourceId(g.getResourceId());
                    h.setUnits(f);
                    d[h.internalId] = true;
                    c.push(h)
                }
            }
        });
        var b = [];
        a.each(function(f) {
            if (f.getTaskId() === e && !d[f.getId() || f.internalId]) {
                b.push(f)
            }
        });
        a.suspendAutoSync();
        a.remove(b);
        a.add(c);
        a.resumeAutoSync();
        if (a.autoSync) {
            a.sync()
        }
    }
});