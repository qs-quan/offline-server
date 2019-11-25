/**
 * 试验类型树的数据model
 * Created by dailin on 2019/8/5 15:26.
 */

Ext.define('OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.Model.ExperimentTreeNodeModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'dataId',
        'text',
        'modelName',
        'pid',
        'iconCls'
    ],
    proxy: {
        type: 'ajax',
        api: {
            "read": serviceName + "/ExperimentController/nextLayerNodes.rdm"
        },
        extraParams: {
            nodeId: '',
            modelName: '',
            type: ''
        },
        reader: {
            type: 'json',
            successProperty: 'success',
            totalProperty: 'totalProperty',
            root: 'results',
            messageProperty: 'msg'
        }
    }
});