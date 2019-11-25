/**
 * Created by enjoyjava on 01/12/2016.
 */
Ext.define('OrientTdm.BackgroundMgr.DocReport.Common.DocReporChoosePanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.docReporChoosePanel',
    config: {
        modelId: '',
        isView: ''
    },
    layout: 'border',
    requires: [
        'OrientTdm.BackgroundMgr.DocReport.Common.DocModelTree',
        'OrientTdm.BackgroundMgr.DocReport.Common.DocModelColumnPanel'
    ],
    initComponent: function () {
        var me = this;
        me.addEvents({
            reconfigByModelId: true,
            refreshColumnGrid: true
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'reconfigByModelId', me._reconfig, me);
        me.mon(me, 'refreshColumnGrid', me._refreshColumnGrid, me);
        me.callParent(arguments);
    },
    _reconfig: function () {
        var me = this;
        //if not exists
        var relatedModelTree = me.down('docModelTree');
        if (relatedModelTree) {
            relatedModelTree.mainModelId = me.modelId;
            relatedModelTree.fireEvent('reConfig', false);
        } else {
            relatedModelTree = Ext.create('OrientTdm.BackgroundMgr.DocReport.Common.DocModelTree', {
                mainModelId: me.modelId,
                region: 'center'
            });
            me.add(relatedModelTree);
        }
    },
    _refreshColumnGrid: function (modelId) {
        var me = this;
        var modelColumnGrid = me.down('docModelColumnPanel');
        if (modelColumnGrid) {
            modelColumnGrid.expand();
            modelColumnGrid.fireEvent('refreshByModelId', modelId);
        } else {
            modelColumnGrid = Ext.create('OrientTdm.BackgroundMgr.DocReport.Common.DocModelColumnPanel', {
                modelId: modelId,
                collapsible: true,
                region: 'south',
                height: 350
            });
            me.add(modelColumnGrid);
        }
    }
});