/**
 * 构造试验数据管理 bom 树的左侧按钮栏
 */
Ext.define("OrientTdm.TestBomBuild.Tree.Toolbar.LeftBomTreeLeftToolbar", {
    extend: 'Ext.Base',

    constructor: function (config) {
        var local = this;
        var me = config.scope;
        local.scope = config.scope;

        if (!me.isShowCruBtn) {
            this.toolbar = [];
        }

        this.toolbar = [
            {
                // 新增按钮
                iconCls: 'icon-back',
                itemId: 'create',
                tooltip: '同步',
                handler: function () {
                    local._createWindow();
                }
            }, '-', {
                // 手工新增按钮
                iconCls: "icon-create",
                tooltip: '新增',
                itemId: 'add',
                handler: function () {
                    me._addTreeNode();
                }
            },
            // }, {
            //     // 编辑按钮
            //     iconCls: 'icon-update',
            //     itemId: 'modify',
            //     disabled: true,
            //     tooltip: '编辑',
            //     handler:function () {
            //         me._modifyTreeNode();
            //     }
            // },
                {
                // 删除按钮
                iconCls: 'icon-delete',
                itemId: 'delete',
                disabled: true,
                tooltip: '删除',
                handler: function () {
                    me._deleteTreeNode();
                }
            }, '-', {
                // 从模板导入项目
                iconCls: 'icon-createbyimport',
                itemId: 'import',
                disabled: true,
                tooltip: '从模板导入项目',
                handler: function () {
                    me._CreateNodeByImport();
                }
            }, {
                // 导出为模版
                iconCls: 'icon-exporttemplate',
                itemId: 'export',
                disabled: true,
                tooltip: '导出为模版',
                handler: function () {
                    me._exportTemplate();
                }
            }, '-', {
                // 查询按钮
                iconCls: 'icon-query',
                itemId: 'search',
                tooltip: '搜索',
                handler: function () {
                    local._searchDrawingNumberInfo();
                }
            }
        ];
    },

/////////////////////////////////////////////////               从 mes 或 pdm 获取结构按钮点击处理结束                    ////////////////////////////////////////////////////////
    /**
     * 创建点击新增按钮时弹出的窗口
     */
    _createWindow: function () {
        var local = this;
        var me = this.scope;

        Ext.create('widget.window', {
            id: "inputInfoWindow",
            itemId: "inputInfoWindow",
            title: '通过产品编号或图号获取Bom数据',
            width: 380,
            autoHeight: true,
            layout: 'fit',
            modal: true,
            buttonAlign:'center',
            items:[
                // 新增时输入选项的panel
                Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel',{
                    itemId: "inputInfoPanel",
                    bbar: ['->', {
                        itemId: "searchOrConfirmButton",
                        xtype: 'button',
                        text: '同步',// '查询',
                        handler: function() {
                            var searchVal = this.up("#inputInfoPanel").down("#inputLabel").value;
                            // 单选，被选中的组件值 = true
                            var searchValSourceType = Ext.getCmp("queryBomSourceType").items.items[0].value;

                            // 查询条件不可为空
                            if(searchVal == undefined){
                                OrientExtUtil.Common.info('提示',this.text == "查询" ?
                                    "产品编号不可为空！" :
                                    "产品图号不可为空！");
                            }
                            // 判断图号是否已通过委托单申请
                            var hasBind = false;
                            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/checkStatus.rdm', {
                                applyType: '',
                                th: searchVal,
                                isSwbs: searchValSourceType
                            }, false, function (response) {
                                hasBind = response.decodedData.results;
                            });
                            if(hasBind == false){
                                OrientExtUtil.Common.info('提示', '【<font color="red">'+ searchVal + '</font>】不可用，可能原因：<br>1.没有进行委托单申请<br>2.委托单还未通过审批');
                                return;
                            }

                            if(searchValSourceType){
                                // 产品编号查询
                                local._getDataByMesAnd(searchVal);

                            }else {
                                // 图号查询
                                local._getDataJustByPdmSystem(searchVal)
                            }
                        },
                        iconCls: 'icon-saveAndClose'
                    }, '->'],
                    items:[
                        {
                            id: 'queryBomSourceType',
                            xtype: 'radiogroup',
                            width:300,
                            fieldLabel: '选择输入类型',
                            columns: 2,
                            vertical: true,
                            items: [
                                { boxLabel: '产品编号', name: 'inputType', inputValue: 'swbh', checked: true},
                                { boxLabel: '产品图号', name: 'inputType', inputValue: 'th'}
                            ]
                        },{
                            margin: '5 15 5 15',
                            xtype:'textfield',
                            itemId: "inputLabel",
                            name: "inputLabel",
                            fieldLabel:'请输入',
                            width: 300,
                            emptyText:'输入不可为空'
                        }
                    ]
                })
            ]
        }).show();
    },

    /**
     * 根据产品编号向 mes 获取bom 结构
     * @param inputInfo 产品编号
     */
    _getDataByMesAnd: function (inputInfo) {
        var local = this;
        var me = this.scope;
        var selected = me.getSelectionModel().getSelection();

        // 阻塞等待
        var wait = Ext.MessageBox.wait('正在链接 MES 系统获取产品结构......', '', {text: '请稍后...'});

        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/MesController/productNumber.rdm', {
            productNumber: inputInfo
        }, false, function (response) {
            wait.hide();
            // 判断调用 pdm 成功，提示关闭弹出框
            if(response.decodedData.success == true){
                var thWindow = Ext.getCmp("thDataWindow");
                if(thWindow != undefined){
                    thWindow.close();
                }
                var inputWindow = Ext.getCmp("inputInfoWindow");
                if(inputWindow != undefined){
                    inputWindow.close();
                }

                try {
                    if(selected.length == 0){
                        me.getStore().load();
                    }else{
                        selected[0].store.load({node: selected[0]});
                    }
                }catch (e) {
                    console.error('刷新失败，对象不存在');
                }
            }else {
                OrientExtUtil.Common.info('提示', response.decodedData.msg);
            }
        });
    },

    /**
     * 选择图号调用 pdm 系统获取图号结构，同时根据实物标识调用 mes 系统获取实物数据列表
     * @param inputInfo 图号
     * @param inputInfoWindow
     */
    _getDataJustByPdmSystem: function (inputInfo) {
        var local = this;
        var me = this.scope;
        var selected = me.getSelectionModel().getSelection();

        // 关闭新增窗口
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/PdmController/getPdmInfo.rdm', {
            swbs : me.swbs,
            th : inputInfo
        }, false, function (response) {
            // 判断调用 pdm 成功，提示关闭弹出框
            if(response.decodedData.success == true){
                var wait = Ext.MessageBox.wait(response.decodedData.msg, '"获取数据', {text: '请稍后...'});

                var thWindow = Ext.getCmp("thDataWindow");
                if(thWindow != undefined){
                    thWindow.close();
                }
                var inputWindow = Ext.getCmp("inputInfoWindow");
                if(inputWindow != undefined){
                    inputWindow.close();
                }

                // 查询图号记录dataId
                var queryThRecordDataId = response.decodedData.results/*['queryThRecordDataId']*/;

                var intervalCount = 0;
                // 轮询判断 pdm 系统是否已返回
                var task = setInterval(function(){
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/PdmController/checkPDMPushState.rdm', {
                        queryThRecordDataId : queryThRecordDataId
                    }, false, function (response) {
                        var result = response.decodedData.results;
                        var state = result.state;
                        if(state.length != 0){
                            // 停止轮询
                            clearInterval(task);
                            wait.hide();

                            if(state == 'endfail'){
                                // 提示用户获取数据失败
                                OrientExtUtil.Common.info('提示', result.msg);
                            }else if(state == 'success'){
                                // 提示用户获取数据成功
                                /* OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomUpdateController/updateTeamByRecordDataId.rdm",{
                                     recordDataId: queryThRecordDataId
                                 },false);*/
                                OrientExtUtil.Common.info('成功', result.msg);
                                try {
                                    if(selected.length == 0){
                                        me.getStore().load();
                                    }else{
                                        selected[0].store.load({node: selected[0]});
                                    }
                                }catch (e) {
                                    // todo 刷新失败，对象不存在
                                }
                            }
                        }
                    });

                    if(intervalCount > 60){
                        OrientExtUtil.Common.info('提示', "获取产品结构已超时！");
                        // 停止轮询
                        clearInterval(task);
                        wait.hide();
                        return;
                    }

                    intervalCount++;
                }, 5000);
            }else {
                OrientExtUtil.Common.info('提示', response.decodedData.msg);
            }
        });
    },
/////////////////////////////////////////////////               从 mes 或 pdm 获取结构按钮点击处理结束                    ////////////////////////////////////////////////////////
/////////////////////////////////////////////////               搜索按钮点击处理开始                    /////////////////////////////////////////////////////////////////////////
    /**
     * 搜索图号信息
     */
    _searchDrawingNumberInfo: function () {
        var local = this;
        var me = this.scope;

        var searchDrawingNumberInfoPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel',{
            itemId: "searchDrawingNumberInfoPanel",
            bbar: [{
                xtype: 'tbfill'
            },{
                itemId: "searchDrawingNumberButton",
                xtype: 'button',
                text: '查询',
                handler: function() {
                    // 输入为空时，还原正常状态，输入内容时进行模糊查询
                    var searchVal = this.up("#searchDrawingNumberInfoWindow").down("#inputDrawingNumberLabel").value;
                    if(searchVal == undefined){
                        searchVal = '';
                    }
                    local._createDrawingInfoPanel(searchVal);
                    searchDrawingNumberInfoWindow.close();
                },
                iconCls: 'icon-saveAndClose'
            },{
                xtype: 'tbfill'
            }],
            items:[{
                margin: '5 15 5 15',
                xtype:'textfield',
                itemId: "inputDrawingNumberLabel",
                name: "inputDrawingNumberLabel",
                fieldLabel:'请输入图号',
                width: 300,
                emptyText:'图号为空时则退出搜索状态'
            }]
        });
        var searchDrawingNumberInfoWindow = Ext.create('widget.window', {
            itemId: "searchDrawingNumberInfoWindow",
            title: '搜索图号',
            width: 380,
            autoHeight: true,
            layout: 'fit',
            modal: true,
            buttonAlign:'center',
            items:[searchDrawingNumberInfoPanel]
        }).show();
    },

    /**
     * 图号搜索
     * @param searchVal
     */
    _createDrawingInfoPanel: function (searchVal) {
        var me = this.scope;
        // 清空节点
        me.getRootNode().removeAll();
        // 设置根节点属性
        me.getRootNode().raw.text = searchVal;
        // 加载对应数据
        me.getStore().load();
    }
/////////////////////////////////////////////////               搜索按钮点击处理结束                    /////////////////////////////////////////////////////////////////////////

});