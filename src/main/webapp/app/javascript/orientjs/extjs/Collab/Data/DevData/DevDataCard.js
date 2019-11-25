/**
 * Created by Administrator on 2016/7/21 0021.
 */
Ext.define('OrientTdm.Collab.Data.DevData.DevDataCard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.devDataCard',
    config: {
        modelId: '',
        dataId: '',
        type: '',
        initPrivateData: false,
        apiConfig: {
            "read": serviceName + '/DataObj/getDataObj.rdm',
            "create": serviceName + '/DataObj/createDataObj.rdm',
            "update": serviceName + '/DataObj/updateDataObj.rdm',
            "destroy": serviceName + '/DataObj/deleteDataObj.rdm'
        },
        localMode: false,
        localData: null,
        devDataInstancePanel: null
    },
    requires: [
        'OrientTdm.Collab.Data.DevData.Common.DevDataInstance',
        'OrientTdm.Collab.Data.DevData.Common.HisDevDataInstance'
    ],
    initComponent: function () {
        var me = this;
        //card布局 展现当前以及历史面板信息
        var devDataInstancePanel = Ext.create('OrientTdm.Collab.Data.DevData.Common.DevDataInstance', {
            modelId: me.modelId,
            dataId: me.dataId,
            type: me.type,
            apiConfig: me.apiConfig,
            afterInitComponent: function () {
                me._controlInstancePanel(this);
            },
            localMode: me.localMode,
            localData: me.localData
        });
        var respPanel = Ext.create('OrientTdm.Collab.Data.DevData.Common.HisDevDataInstance', {});
        Ext.apply(me, {
            layout: 'card',
            items: [devDataInstancePanel, respPanel]
        });

        me.devDataInstancePanel = devDataInstancePanel;
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
    },
    _controlInstancePanel: function (instancePanel) {
        var me = this;
        if (me.initPrivateData == false && instancePanel.readOnly != true) {
            //说明数据功能点在项目管理中
            var undoButton = instancePanel.down('#undo');
            var toolBar = instancePanel.down('toolbar');
            toolBar.remove(undoButton);
            //限制上下移动
            var upButton = instancePanel.down('#up');
            var downButton = instancePanel.down('#down');
            if (upButton && downButton) {
                var intercept = instancePanel.canMove;
                upButton.handler = Ext.Function.createInterceptor(upButton.handler, intercept, instancePanel);
                downButton.handler = Ext.Function.createInterceptor(downButton.handler, intercept, instancePanel);
            }
        } else if (me.initPrivateData == true && instancePanel.type == '1') {
            //如果在任务中 则限制共享数据新增、删除、上移、下移的操作
            var hiddenButtons = [instancePanel.down('#create'), instancePanel.down('#delete'), instancePanel.down('#up'), instancePanel.down('#down')]
            Ext.each(hiddenButtons, function (hiddenButton) {
                hiddenButton.hide();
            });
        }
    }
});