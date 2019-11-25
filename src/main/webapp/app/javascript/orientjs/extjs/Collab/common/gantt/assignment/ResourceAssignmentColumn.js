/**
 * Created by Seraph on 16/7/20.
 */
Ext.define("OrientTdm.Collab.common.gantt.assignment.ResourceAssignmentColumn", {
    extend: "Ext.grid.column.Column",
    requires: [
        "Gnt.field.Assignment",
        "OrientTdm.Collab.common.gantt.assignment.AssignmentField"
    ],
    mixins: ["Gnt.mixin.Localizable"],
    tdCls: "sch-assignment-cell",
    showUnits: false,
    field: null,
    constructor: function(a) {
        a = a || {};
        this.text = a.text || this.L("text");
        var b = a.field || a.editor;
        delete a.field;
        delete a.editor;
        a.editor = b || {};
        if (! (a.editor instanceof Ext.form.Field)) {
            a.editor = Ext.ComponentManager.create(Ext.applyIf(a.editor, {
                expandPickerOnFocus: true,
                formatString: "{0}" + (this.showUnits ? " [{1}%]": "")
            }), "tdmAssignmentfield")
        }
        a.field = a.editor;
        this.callParent([a]);
        this.scope = this
    },
    renderer: function(b, c, a) {
        return this.field.getDisplayValue(a)
    }
});