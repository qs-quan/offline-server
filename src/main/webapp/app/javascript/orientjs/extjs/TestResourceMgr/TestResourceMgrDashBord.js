/**
 * Created by enjoy on 2016/5/16 0016.
 */
Ext.define('OrientTdm.TestResourceMgr.TestResourceMgrDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.TestResourceMgrDashBord',
    requires: [
        "OrientTdm.DataMgr.TBom.TBomTree",
        "OrientTdm.DataMgr.Center.DataShowRegion"
    ],
    initComponent: function () {
        var me = this;
        var functionId = me.itemId;
        if (functionId) {
            //截取ID
            functionId = functionId.substr(functionId.indexOf("-") + 1, functionId.length);
        }
        //创建中间面板
        var centerPanel = Ext.create("OrientTdm.DataMgr.Center.DataShowRegion", {
            region: 'center',
            padding: '0 0 0 5'
        });
        //Tbom
        var tbomPanel = Ext.create("OrientTdm.DataMgr.TBom.TBomTree", {
            width: 280,
            minWidth: 280,
            maxWidth: 400,
            belongFunctionId: functionId,
            region: 'west',
            listeners: {
                itemappend: function(pnode, node) {
                    if(node.get("text") == "设备台账管理（按分类）") {
                        node.set("text", '设备台账管理（<a href="#" onClick="javascript:changeDeviceShowType(1);">按分类</a>）');
                        tbomPanel.byTypeNode = node;
                    }
                    else if(node.get("text") == "设备台账管理（按标签）") {
                        node.set("text", '设备台账管理（<a href="#" onClick="javascript:changeDeviceShowType(0);">按标签</a>）');
                        tbomPanel.byTagNode = node;
                        Ext.Function.defer(node.parentNode.removeChild, 160, node.parentNode, [node, false]);
                    }
                    window.changeDeviceShowType = function (showType) {
                        me.changeDeviceShowType.call(tbomPanel, showType);
                    }
                }
            }
        });
        Ext.apply(me, {
            layout: 'border',
            items: [centerPanel, tbomPanel],
            westPanel: tbomPanel,
            centerPanel: centerPanel
        });
        me.callParent(arguments);
    },
    changeDeviceShowType: function(showType) {
        var tree = this;
        var oriNode = null;
        var newNode = null;
        if(showType == 0) {
            oriNode = tree.byTagNode;
            newNode = tree.byTypeNode;
        }
        else {
            oriNode = tree.byTypeNode;
            newNode = tree.byTagNode;
        }
        var pnode = oriNode.parentNode;
        pnode.removeChild(oriNode, false);
        pnode.insertChild(0, newNode);
        var store = tree.getStore();
        tree.getSelectionModel().select(newNode);
        //tree.fireEvent("refreshCurrentNode");
    }
});