/**
 * Created by Seraph on 16/7/7.
 */
Ext.define('OrientTdm.Collab.common.team.TeamPanel', {
    alias: 'widget.projectMngTeamPanel',
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    requires: [
        'OrientTdm.Collab.common.team.model.RoleUserTreeModel'
    ],
    config: {
        localMode: false,
        localData: null,
        //保存历史任务时 是否需要序列化至数据库
        isHistoryAble: true,
        hisTaskDetail: null
    },
    initComponent: function () {
        var me = this;
        if (null != me.hisTaskDetail) {
            me._initHisData();
        }
        var params =  {
            region: 'center',
            padding: '0 0 0 5',
            modelName: me.modelName,
            dataId: me.dataId,
            localMode: me.localMode,
            localData: me.localData
        };
        if (me.ids) {
            params.ids = me.ids;
        }
        var centerPanel = Ext.create("OrientTdm.Collab.common.team.TeamRoleUserTreeGrid", params);

        var rightPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            title: '功能点分配',
            width: 250,
            minWidth: 250,
            maxWidth: 400,
            layout: 'border',
            // html: '<p></p>',
            collapsed: true,
            collapsible: true,
            region: 'east',
            border: true
        });

        var southPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'south',
            height: 0.4 * globalHeight,
            collapsed: true,
            collapsible: true
        });

        Ext.apply(this, {
            layout: 'border',
            items: [rightPanel, centerPanel, southPanel],
            eastPanel: rightPanel,
            centerPanel: centerPanel,
            southPanel: southPanel
        });

        this.callParent(arguments);
    },
    /**
     *
     * 为后台历史任务引擎，提供输入参数，历史引擎根据参数保存相关历史信息至数据库
     */
    getHistoryData: function () {
        var me = this;
        var roleIds = [];
        var rootNode = me.down('teamRoleUserTreeGrid').getRootNode();
        rootNode.cascadeBy(function (tree, view) {
            //保存首层节点
            if (!this.isRoot()) {
                if (this.getDepth() == 1) {
                    roleIds.push(this.raw.roleId);
                }
            }
        });
        var retVal = {
            extraData: {}
        };
        if (roleIds.length > 0) {
            retVal.extraData.roleIds = Ext.encode(roleIds);
        }
        return retVal;
    },
    _initHisData: function () {
        var me = this;
        //准备历史数据
        me.localMode = true;
        var collRoleNodesStr = me.hisTaskDetail.getExtraData('roleUserTreeNodes');
        var collRoleFunctionsStr = me.hisTaskDetail.getExtraData('roleFunctionTreeNodes');
        if (collRoleNodesStr) {
            var collRoleNodes = Ext.decode(collRoleNodesStr);
            var collRoleFunctions = Ext.decode(collRoleFunctionsStr);
            var roleUserTreeStore = Ext.create('Ext.data.TreeStore', {
                model: 'OrientTdm.Collab.common.team.model.RoleUserTreeModel',
                listeners: {},
                root: {
                    text: 'root',
                    id: '-1',
                    expanded: true,
                    children: collRoleNodes
                }
            });
            var localData = {
                roleUserTreeStore: roleUserTreeStore,
                roleFunctionData: collRoleFunctions
            };
            me.localData = localData;
        }
    }
});