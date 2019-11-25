/**
 * Created by dailin on 2019/3/30 15:24.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.TabPanel.FileTabPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.fileTabPanel',
    requires: [],
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
        me.groupTask == undefined ? false : me.groupTask;
        var groupPanels = [];
        //所有附件面板
        var allFilePanel = Ext.create("OrientTdm.TestBomBuild.Panel.GridPanel.FileGridpanel", {
            title: '所有附件',
            modelId: me.modelId,
            dataId: me.dataId,
            groupTask: me.groupTask,
            nodeId: me.nodeId,
            hisTaskDetail: me.hisTaskDetail,
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
            groupTask: me.groupTask,
            nodeId: me.nodeId,
            iconCls:'icon-document',
            fileGroupId: me.docFileGroupId,
            hisTaskDetail: me.hisTaskDetail,
            listeners: {
                activate: function () {
                    this.fireEvent("refreshGrid");
                }
            },
            createToolBarItems:Ext.emptyFn
        });
        //视频
        var videoPanel = Ext.create("OrientTdm.DataMgr.FileMgr.Grid.OrientModelVideoFileGrid", {
            title: '视频',
            modelId: me.modelId,
            dataId: me.dataId,
            nodeId: me.nodeId,
            groupTask: me.groupTask,
            iconCls:'icon-video',
            fileGroupId: me.videoFileGroupId,
            hisTaskDetail: me.hisTaskDetail,
            listeners: {
                activate: function () {
                    this.fireEvent("refreshGrid");
                }
            },
            createToolBarItems:Ext.emptyFn
        });


        groupPanels.push(allFilePanel,imageFilePanel, docPanel, videoPanel);
        //获取其他分组信息
        Ext.each(me.groupDesc, function (group) {
            var groupName = group.groupName;
            var groupId = group.id;
            //默认文件面板，可绑定文件分组，针对不同分组，展现不同面板信息
            var customPanel = Ext.create("OrientTdm.DataMgr.FileMgr.Grid.OrientModelFileGrid", {
                title: groupName,
                modelId: me.modelId,
                dataId: me.dataId,
                nodeId: me.nodeId,
                fileGroupId: groupId
            });
            groupPanels.push(customPanel);
        });
        //其他自定义
        Ext.apply(this, {
            items: groupPanels
        });
        this.callParent(arguments);
    },

    initEvents: function() {
        var me = this;
        me.mon(me, 'changeGroupTaskState', me.changeGroupTaskState, me);
    },

    changeGroupTaskState: function () {
        var me = this;
        me.groupTask = false;
    },

    reconfigImagePlugin: function () {
        var me = this;
        Ext.query("#imageViewFrame")[0].src = serviceName + '/app/views/file/imageViewByFancybox.jsp?' + 'modelId=' + me.modelId + '&dataId=' + me.dataId + '&nodeId=' + me.nodeId + '&fileGroupId=' + me.imageFileGroupId;
    }

});
