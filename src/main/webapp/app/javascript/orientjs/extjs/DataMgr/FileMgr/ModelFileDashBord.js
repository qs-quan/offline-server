/**
 * Created by enjoy on 2016/5/3 0003.
 * 模型附件管理主面板
 */

Ext.define('OrientTdm.DataMgr.FileMgr.ModelFileDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.modelFileDashBord',
    requires: [
        "OrientTdm.DataMgr.FileMgr.Grid.OrientModelFileGrid",
        "OrientTdm.DataMgr.FileMgr.Grid.OrientModelImageFileGrid",
        "OrientTdm.DataMgr.FileMgr.Grid.OrientModelDocFileGrid"
    ],
    height: (globalHeight-300) * 0.8,
    config: {
        modelId: '',
        dataId: '',
        //自定义分组描述
        groupDesc: [],
        imageFileGroupId: -4,
        videoFileGroupId: -3,
        docFileGroupId: -2
    },
    initComponent: function () {
        var me = this;
        var groupPanels = [];
        //所有附件面板
        var allFilePanel = Ext.create("OrientTdm.DataMgr.FileMgr.Grid.OrientModelFileGrid", {
            title: '所有附件',
            modelId: me.modelId,
            dataId: me.dataId,
            listeners: {
                activate: function () {
                    this.fireEvent("refreshGrid");
                }
            }
        });
        //图片
        var imageFilePanel = {
            layout: 'fit',
            title: '图片预览',
            iconCls:'icon-picture',
            html: '<iframe id="imageViewFrame" width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" src = ""></iframe>',
            listeners: {
                activate: function () {
                    me.reconfigImagePlugin();
                }
            }
        };
        //文档
        var docPanel = Ext.create("OrientTdm.DataMgr.FileMgr.Grid.OrientModelDocFileGrid", {
            title: '文档',
            modelId: me.modelId,
            dataId: me.dataId,
            iconCls:'icon-document',
            fileGroupId: me.docFileGroupId,
            listeners: {
                activate: function () {
                    this.fireEvent("refreshGrid");
                }
            }
        });
        //视频
        var videoPanel = Ext.create("OrientTdm.DataMgr.FileMgr.Grid.OrientModelVideoFileGrid", {
            title: '视频',
            modelId: me.modelId,
            dataId: me.dataId,
            iconCls:'icon-video',
            fileGroupId: me.videoFileGroupId,
            listeners: {
                activate: function () {
                    this.fireEvent("refreshGrid");
                }
            }
        });
        groupPanels.push(allFilePanel, imageFilePanel, docPanel, videoPanel);
        //获取其他分组信息
        Ext.each(me.groupDesc, function (group) {
            var groupName = group.groupName;
            var gourpId = group.id;
            //默认文件面板，可绑定文件分组，针对不同分组，展现不同面板信息
            var customPanel = Ext.create("OrientTdm.DataMgr.FileMgr.Grid.OrientModelFileGrid", {
                title: groupName,
                modelId: me.modelId,
                dataId: me.dataId,
                fileGroupId: gourpId
            });
            groupPanels.push(customPanel);
        });
        //其他自定义
        Ext.apply(this, {
            tabPosition: 'left',
            items: groupPanels
        });
        this.callParent(arguments);
    },
    reconfigImagePlugin: function () {
        var me = this;
        Ext.query("#imageViewFrame")[0].src = serviceName + '/app/views/file/imageViewByFancybox.jsp?' + 'modelId=' + me.modelId + '&dataId=' + me.dataId + '&fileGroupId=' + me.imageFileGroupId;
    }
});