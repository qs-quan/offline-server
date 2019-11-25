/**
 * PVM数据实例面板
 * Created by Administrator on 2016/7/21 0021.
 */
Ext.define('OrientTdm.Collab.Data.PVMData.PVMDataDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.pvmDataDashBord',
    requires: [
        'OrientTdm.Collab.Data.PVMData.Common.PVMDataTree'
    ],
    config: {
        modelId: '',
        dataId: '',
        //保存历史任务时 是否需要序列化至数据库
        isHistoryAble: true,
        localMode : false,
        localData : null,
        hisTaskDetail: null
    },
    initComponent: function () {
        var me = this;
        var checkModelTree = Ext.create('OrientTdm.Collab.Data.PVMData.Common.PVMDataTree', {
            itemId: 'checkModelTree',
            region: 'west',
            title: '检查模型',
            animCollapse: true,
            width: 280,
            minWidth: 150,
            maxWidth: 400,
            split: true,
            collapsible: true,
            modelId: me.modelId,
            dataId: me.dataId,
            localMode : me.localMode,
            localData : me.localData,
            hisTaskDetail:me.hisTaskDetail
        });
        var checkModelData = Ext.create('OrientTdm.Common.Extend.Panel.OrientTabPanel', {
            itemId: 'checkModelData',
            title: '离线数据',
            region: 'center',
            items: [
                {
                    title: '简介',
                    iconCls: 'icon-basicInfo',
                    //html: '<h1>检查表管理...此处可也添加HTML，介绍功能点主要用途</h1>'
                    html:'<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" src = "' + serviceName +
                    '/app/views/introduction/OfflineData.jsp?"></iframe>'
                }
            ]
        });
        Ext.apply(me, {
            layout: 'border',
            items: [checkModelTree, checkModelData]
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
    },
    saveStatus: function (newStatus, taskCheckModelId, sourcePanel) {
        var me = this;
        var params = {
            taskCheckModelId: taskCheckModelId,
            toSaveStatus: newStatus
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/CheckModel/updateRelationDatas.rdm', params, false, function (resp) {
            var respData = resp.decodedData;
            var success = respData.success;
            if (success == true) {
                var treePanel = me.westPanelComponent;
                me.centerPanelComponent.remove(sourcePanel, true);
                //刷新左侧的树
                if (treePanel) {
                    treePanel.fireEvent('refreshTreeAndSelOne', taskCheckModelId, true);
                }
            } else {
                //给出提示信息 并删除记录
            }
        });
    },
    /**
     *
     * 为后台历史任务引擎，提供输入参数，历史引擎根据参数保存相关历史信息至数据库
     */
    getHistoryData: function () {
        var me = this;
        var retVal = {
            extraData: {}
        };
        var checkModelNodes = [];
        var checkModelIds = [];
        //保存右侧检查模型信息
        var pvmDataTree = me.down('pvmDataTree');
        var rootNode = pvmDataTree.getRootNode();
        rootNode.cascadeBy(function (tree, view) {
            //保存首层节点
            if (!this.isRoot()) {
                if (this.getDepth() == 1) {
                    var copyNode = Ext.decode(Ext.encode(this.raw));
                    //拷贝子节点信息
                    copyNode.children = Ext.decode(Ext.encode(this.data.children));
                    checkModelNodes.push(copyNode);
                }
                checkModelIds.push(this.raw.id);
            }
        });
        if (checkModelIds.length > 0) {
            retVal.extraData.checkModelNodes = Ext.encode(checkModelNodes);
            retVal.extraData.checkModelIds = Ext.encode(checkModelIds);
        }
        return retVal;
    }
});