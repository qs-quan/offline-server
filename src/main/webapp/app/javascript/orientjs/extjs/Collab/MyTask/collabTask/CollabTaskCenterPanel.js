/**
 * Created by Seraph on 16/8/20.
 */
Ext.define('OrientTdm.Collab.MyTask.collabTask.CollabTaskCenterPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.collabTaskCenterPanel',
    requires: [
        'OrientTdm.Collab.common.util.RightControlledPanelHelper'
    ],
    config: {
        rootModelName: null,
        rootDataId: null,
        rootData: null,
        rootModelId: null,
        isHistory: false,
        //历史任务描述
        hisTaskDetail: null,
        //保存历史任务时 是否需要序列化至数据库
        isHistoryAble: true
    },

    initComponent: function () {
        var me = this;
        var params = me._initParam();
        var items = [];

        // 根据taskId获取对应的nodeId
        var nodeId = '',
            dataId = '',
            taskType = '',
            text = '',
            rid = '',
            schemaId = OrientExtUtil.FunctionHelper.getSchemaId(),
            bomModelId = OrientExtUtil.ModelHelper.getModelId('T_BOM',schemaId),
            taskModelId = OrientExtUtil.ModelHelper.getModelId('T_RW_INFO',schemaId);

        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TaskController/getRwNodeAndChilds.rdm',{
            taskId: me.rootDataId
        },false,function (response) {
            if (response.decodedData.success) {
                var retV = response.decodedData.results;
                // retV如果有dataInfo和nodeId则应记录信息
                if (retV.nodeId && retV.dataInfo ) {
                    nodeId = retV.nodeId;
                    dataId = retV.dataInfo.ID;
                    taskType = retV.dataInfo['M_RW_TYPE_' + taskModelId];
                    text = retV.dataInfo['M_BH_' + taskModelId];
                    rid = retV.nodeInfo['M_RID_' + bomModelId];

                    me.upup.rwInfp = {
                        nodeId: nodeId,
                        dataId: dataId,
                        taskType: taskType,
                        text: text
                    };
                }
            }
        });

        // 定制组件，不能当组件使用，因为有数据时才能使用
        var isCustom = false;
        if (nodeId != '' && dataId != '') {
            isCustom = true;
            // 数据的tab界面
            var dataModelId = OrientExtUtil.ModelHelper.getModelId('T_TEST_IMPORT', OrientExtUtil.FunctionHelper.getTestDataSchemaId());
            items.push(Ext.create('OrientTdm.Collab.common.collabFlow.DataCollabFlow.DataCollabFlowParentPanel',{
                dataId : dataId,
                rwModelId : taskModelId,
                region: 'north',
                testDataObj: {
                    iconCls: 'icon-basicDataType',
                    dataId: dataId,
                    nodeId: nodeId,
                    text: text,
                    rid: rid,
                    layout: 'border',
                    tableName: 'T_TEST_IMPORT',
                    modelId: dataModelId,
                    showAnalysisBtns: false,
                    isView: 0,
                    groupTask: me.groupTask,
                    taskType: taskType,
                    region: 'center',
                    //padding: '0 0 0 5',
                    title: '数据导入记录',
                    rootData: me.rootData,
                    hisTaskDetail: me.hisTaskDetail,
                    // 单选
                    multiSelect: false
                },
                listeners: {
                    afterLayout: function () {
                        // 主动加载条件标签页
                        // 已知信息：
                        //  条件标签页激活以后不显示图片（未完成加载）
                        //  需要点击别的标签页再切回来才行，尝试如下顺序【条件 --》 设备 --》 条件】快速点击标签页后可以看到条件标签页三个图片panel只加载了一个或者两个，手速慢一点则全部加载出来
                        //  的确是需要点击第二个标签页才加载图片
                        var collabFlowCustomParamImgTab = Ext.getCmp('collabFlowCustomParamImgTab');
                        collabFlowCustomParamImgTab.fireEvent('activate');
                    }
                }
            }));

            // 在items上push文件列表
            items.push({
                xtype: 'panel',
                iconCls: 'icon-file',
                layout: 'border',
                title: '上传附件',
                listeners:{
                    activate: function () {
                        var thisComponent = Ext.create('OrientTdm.TestBomBuild.Panel.TabPanel.FileTabPanel', {
                            iconCls: 'icon-file',
                            modelId: OrientExtUtil.ModelHelper.getModelId('T_RW_INFO', OrientExtUtil.FunctionHelper.getSchemaId(), false),
                            dataId: '',
                            layout:'border',
                            groupTask: me.groupTask,
                            nodeId: nodeId,
                            title: '上传附件',
                            hisTaskDetail: me.hisTaskDetail
                        });
                        me.remove(this);
                        me.insert(1, thisComponent);
                        me.setActiveTab(thisComponent);
                    }
                }
            });

            // 知识库标签页
            items.push({
                xtype: 'panel',
                iconCls: 'icon-basicDataType',
                layout: 'border',
                title: '知识库',
                listeners:{
                    activate: function () {
                        var fileModelId = OrientExtUtil.ModelHelper.getModelId('T_FILE', OrientExtUtil.FunctionHelper.getKnowledgeSchemaId());
                        var thisComponent = Ext.create('OrientTdm.Collab.ProjectMng.mainFrame.KnowledgeList', {
                            title: '知识库',
                            iconCls: 'icon-basicDataType',
                            modelId: fileModelId,
                            isPositive: '1',
                            taskId: me.upup.rwInfp.dataId, // record.raw.dataId,
                            isView: 0,
                            region: 'center',
                            padding: '0 0 0 5',
                            layout: 'fit',
                            hasToolBar: null != me.hisTaskDetail
                        });
                        me.remove(this);
                        me.insert(2, thisComponent);
                        me.setActiveTab(thisComponent);
                    }
                }
            });

            // 根据模版名称请求文件路径后组装
            items.push({
                id: 'collabFlowCustomParamImgTab',
                xtype: 'panel',
                layout: 'border',
                title: '条件、判据、过程',
                listeners:{
                    activate: function () {
                        var parmParam = [];

                        var itemArr = [
                            {tableName: 'T_SYTJ', title: '试验条件'},
                            {tableName: 'T_HGPJ', title: '合格判据'},
                            {tableName: 'T_GC', title: '试验过程'}
                        ];
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DocController/getRwParam.rdm',{
                            datadId: dataId
                        },false, function (response) {
                            var respons = Ext.decode(response.responseText);
                            if(respons.success){
                                var paramArr = respons.results;

                                for(var i = 0; i < itemArr.length; i++){
                                    var item = itemArr[i];
                                    item.local = paramArr[item.tableName];
                                }
                            }
                        });

                        me.remove(this);
                        me.insert(3, Ext.create('Ext.panel.Panel', {
                            id: 'collabFlowCustomParamImgTab',
                            title: '条件、判据、过程',
                            layout: 'fit',
                            items: Ext.create('Ext.panel.Panel', {
                                layout: 'hbox',
                                listeners : {
                                    afterrender : function (panel) {
                                        var local = this;
                                        //setTimeout(function () {
                                        var i = 0;
                                        var item0,item1,item2;
                                        for (i; i < 3; i++) {
                                            if(i == 0){
                                                item0 = itemArr[i];
                                            }else if(i == 1){
                                                item1 = itemArr[i];
                                            }else if(i == 2){
                                                item2 = itemArr[i];
                                            }

                                            console.log(i);
                                            var item = itemArr[i];
                                            var panel = {
                                                xtype: 'panel',
                                                title: item['title'],
                                                flex: 1,
                                                autoScroll: true,
                                                autoShow: true,
                                                height: '100%',
                                                items: [{
                                                    html: item.local.indexOf('app') > -1 ?
                                                        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在加载数据，请稍后......</h1>' :
                                                        '',
                                                    height: '100%'
                                                }],
                                                index_: i,
                                                listeners: {
                                                    afterrender : function (panel) {
                                                        var local = this;
                                                        var item;
                                                        if(local.index_ == 0){
                                                            item = item0;
                                                        }else if(local.index_ == 1){
                                                            item = item1;
                                                        }else if(local.index_ == 2){
                                                            item = item2;
                                                        }

                                                        console.log(serviceName + '/' + item.local);
                                                        if(item.local.indexOf('app') > -1){
                                                            setTimeout(function () {
                                                                local.removeAll();
                                                                local.add(Ext.create('Ext.Img', {
                                                                    autoScroll: true,
//renderTo: Ext.getBody(),
                                                                    src: serviceName + '/' + item.local
                                                                }));
                                                            }, 500);
                                                        }
                                                    }
                                                }
                                            };

                                            local.add(panel);
                                        }
                                        //}, 10);
                                    }
                                }
                            })
                        }));
                    }
                }
            });

            // 仪器
            items.push({
                xtype: 'panel',
                layout: 'border',
                title: '仪器',
                listeners:{
                    activate: function () {
                        var thisComponent = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TaskDeviceGridpanel', {
                            nodeId: nodeId,
                            //treeNode: treeNode,
                            //modelId : deviceModelId,
                            isShow : true,
                            isView : '0',
                            title : '仪器',
                            region : 'center',
                            usePage : true,
                            hasToolBar: true,
                            onlyBorrowButton: true,
                            hisTaskDetail: me.hisTaskDetail
                        });
                        me.remove(this);
                        me.insert(4, thisComponent);
                        me.setActiveTab(thisComponent);
                    }
                }
            });
        }

        if (null != me.hisTaskDetail) {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/gantt/getModelIdByName.rdm', {
                modelNames: [TDM_SERVER_CONFIG.TASK]
            }, false, function (response) {
                //计划模型信息
                var modelDataInfo = me.hisTaskDetail.getModelDataInfo(response.decodedData.results[TDM_SERVER_CONFIG.TASK]);
                //默认取第一个
                if (modelDataInfo.length > 0) {
                    var planInfo = modelDataInfo[0];
                    var modelDesc = Ext.decode(planInfo.modelDesc);
                    var modelData = planInfo.modelDataList[0];
                    //准备模型信息
                    me.rootModelName = TDM_SERVER_CONFIG.TASK;
                    me.rootModelId = modelDesc.modelId;
                    me.rootDataId = modelData['ID'];
                    params = me._initParam();
                }

                //组件信息
                var hisComponent = me._initComponentFromHistory();
                if (hisComponent) {
                    items.push(hisComponent);
                }
                //其他功能
                var commonPanels = me._initCommonPanelsFromHistory();
                items = Ext.Array.merge(items, commonPanels);
                //流程监控信息
                var belongedFlowDiagram = Ext.create('OrientTdm.Collab.common.collabFlow.collabFlowPanel', {
                    title: '所属流程',
                    iconCls: 'icon-flow',
                    readOnly: true,
                    hisTaskDetail: me.hisTaskDetail
                });
                items.push(belongedFlowDiagram);
            });
        } else {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/projectTree/nodeInfo/parent.rdm', params, false, function (response) {
                var respJson = response.decodedData;

                if(isCustom){
                    items.push({
                        xtype: 'panel',
                        iconCls: 'icon-flow',
                        title: '所属流程',
                        listeners:{
                            activate: function () {
                                var config = {};
                                if (dataId != '') {
                                    var thNodeId = OrientExtUtil.TreeHelper.getParentNodes(nodeId, 3);
                                    var thDataId = '';
                                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getPdmOrMesInfoByTableIdAndNodeId.rdm',{
                                        tableId: OrientExtUtil.ModelHelper.getModelId('T_TH', OrientExtUtil.FunctionHelper.getSchemaId(), false),
                                        tableName: 'T_TH',
                                        nodeId: thNodeId
                                    },false,function (response) {
                                        if (response.decodedData.success && response.decodedData.results[0]) {
                                            thDataId = response.decodedData.results[0].id;
                                            config.filterValue = OrientExtUtil.SysMgrHelper.getCustomRoleIds();
                                            config.filterType = '1';
                                            config.rwNodeId = nodeId;
                                            config.filterTH = thDataId;
                                        }
                                    });
                                }

                                Ext.apply(config,{
                                    iconCls: 'icon-flow',
                                    title: '所属流程',
                                    readOnly: false,
                                    modelName: respJson.modelName,
                                    dataId: respJson.dataId,
                                    unShowToolbarBtn: true
                                });
                                var thisComponent = Ext.create('OrientTdm.Collab.common.collabFlow.collabFlowPanel', config);
                                me.remove(this);
                                me.insert(5, thisComponent);
                                me.setActiveTab(thisComponent);
                            }
                        }
                    });
                }else{
                    items.push(Ext.create('OrientTdm.Collab.common.collabFlow.collabFlowPanel', {
                        iconCls: 'icon-flow',
                        title: '所属流程',
                        readOnly: false,
                        modelName: respJson.modelName,
                        dataId: respJson.dataId,
                        unShowToolbarBtn: true
                    }));
                }
            });
        }

        Ext.apply(me,{
            items: items,
            activeItem: 0,
            listeners: {
                afterLayout: function () {
                    me.fireEvent('tabchange', me, this.items.get(0));
                }
            }
        });

        me.callParent(arguments);
    },

    initEvents: function () {
        var me = this;
        me.callParent();
        me.on('tabchange', me.tabChanged, me);
    },

    tabChanged: function (tabPanel, newCard, oldCard) {
        var me = this;
        /*if (!newCard.hasInited) {
            newCard.hasInited = true;
            if (newCard.title == '任务处理' && !newCard.down('baseComponent')) {
                var componentItem = me._createComponent();
                newCard.add(componentItem);
                return;
            }
            var panel = CollabRightControlledPanelHelper.getPanelByTitle(newCard.title, {
                    region: 'center',
                    modelName: newCard.modelName,
                    dataId: newCard.dataId,
                    modelId: newCard.modelId
                }, {
                    '甘特图': {
                        readOnly: true,
                        enableControl: false
                    },
                    '设计数据': {
                        initPrivateData: true
                    },
                    '数据流': {
                        readOnly: true,
                        hisTaskDetail: newCard.hisTaskDetail,
                        isHistory: newCard.isHistory
                    },
                    '离线数据': {
                        hisTaskDetail: newCard.hisTaskDetail,
                        isHistory: newCard.isHistory
                    },
                    '工作组': {
                        hisTaskDetail: newCard.hisTaskDetail,
                        isHistory: newCard.isHistory
                    }
                }
            );

            if (!Ext.isEmpty(panel)) {
                newCard.removeAll();
                newCard.add(panel);
                newCard.doLayout();
            }
        }*/
    },

    _createComponent: function () {
        var me = this;
        var retVal = null;
        var componentBind = me.componentBind;
        var componentDesc = componentBind.belongComponent;
        if (componentDesc) {
            me.componentDesc = componentDesc;
            Ext.require(componentBind.componentExtJsClass);
            retVal = Ext.create(componentBind.componentExtJsClass, {
                //title: componentDesc.componentname,
                flowTaskId: me.rootData.flowTaskId,
                modelId: me.rootModelId,
                dataId: me.rootDataId,
                region: 'center',
                componentId: componentDesc.id
            });
        }
        return retVal;
    },

    _initParam: function () {
        var me = this;
        var params = {
            modelName: me.rootModelName,
            modelId: me.rootModelId,
            dataId: me.rootDataId
        };
        return params;
    },

    /**
     *
     * 为后台历史任务引擎，提供输入参数，历史引擎根据参数保存相关历史信息至数据库
     */
    getHistoryData: function () {
        var me = this;
        //保存基本信息
        var retVal = {
            modelDataRequestList: [],
            sysDataRequests: [],
            extraData: {
                functionDescs: Ext.encode(me.functionDescs),
                componentBind: Ext.encode(me.componentBind)
            }
        };
        //保存基本信息
        retVal.modelDataRequestList.push({
            modelId: me.rootModelId,
            dataIds: [me.rootDataId]
        });
        //组件信息
        if (me.componentDesc) {
            retVal.sysDataRequests.push({
                sysTableName: 'CWM_COMPONENT',
                sysTableDataList: [me.componentDesc]
            });
        }
        return retVal;
    },

    _initComponentFromHistory: function () {
        var me = this;
        var componentSysData = me.hisTaskDetail.getSysData('CWM_COMPONENT');
        var retVal = null;
        if (componentSysData) {
            var componentBind = Ext.decode(me.hisTaskDetail.getExtraData('componentBind'));
            var componentInfo = componentSysData.oriSysDataList[0];
            Ext.require(componentBind.componentExtJsClass);
            retVal = Ext.create(componentBind.componentExtJsClass, {
                title: componentInfo.componentname,
                region: 'center',
                iconCls: 'icon-taskprocess',
                dataId: me.rootDataId,
                modelId: me.rootModelId,
                flowTaskId: me.hisTaskDetail.taskId,
                hisTaskDetail: me.hisTaskDetail
            });
        }
        return retVal;
    },

    _initCommonPanelsFromHistory: function () {
        var me = this;
        var exceptTabNames = ['工作包分解', '控制流', '工作组', '数据流', '任务处理'];
        var retVal = [];
        var functionDescs = Ext.decode(me.hisTaskDetail.getExtraData('functionDescs'));
        if (functionDescs && Ext.isArray(functionDescs)) {
            Ext.each(functionDescs, function (functionDesc) {
                if (!Ext.Array.contains(exceptTabNames, functionDesc.name)) {
                    var panel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
                        layout: 'border',
                        title: functionDesc.name,
                        iconCls: functionDesc.iconCls,
                        modelName: me.rootModelName,
                        dataId: me.rootDataId,
                        modelId: me.rootModelId,
                        hisTaskDetail: me.hisTaskDetail,
                        isHistory: true
                    });
                    retVal.push(panel);
                }
            });
        }
        return retVal;
    }

});