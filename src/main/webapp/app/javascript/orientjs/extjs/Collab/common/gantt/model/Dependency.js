/**
 * Created by Seraph on 16/7/18.
 */
Ext.define('OrientTdm.Collab.common.gantt.model.Dependency', {
    extend : 'Gnt.model.Dependency',
    fromField : 'startPlanId',
    toField : 'finishPlanId',
    typeField : 'type'
});