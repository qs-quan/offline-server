Ext.define("OrientTdm.TestBomBuild.Tree.Toolbar.LeftBomTreeButtonHandler", {
    extend: 'Ext.Base',

    constructor: function (config) {
        var me = this;
        this.buttonHandlerObj = {
            // 设置按钮状态
            _setButtonStatus: me._setButtonStatus,
            // 手动新增
            _addTreeNode: me._addTreeNode,
            // 军所检节点选择
            _focusOnChooseTestType: me._focusOnChooseTestType,
            // 编辑按钮
            _modifyTreeNode: me._modifyTreeNode,
            // 删除
            _deleteTreeNode: me._deleteTreeNode,
            // 导入试验项目模板
            _CreateNodeByImport: me._CreateNodeByImport,
            // 导出为模板
            _exportTemplate: me._exportTemplate
        };
    },

    /**
     * 设置按钮状态
     * @param record
     */
    _setButtonStatus: function (record) {
        var me = this;
        var lbar = this.down('toolbar[dock=left]');
        var btns = lbar.items.items;

        // 先重置所有可用
        if(record == undefined){
            Ext.each(btns, function (item) {
                if(item.itemId == 'create' || item.itemId == 'search' || item.itemId == 'add'){
                    item.setDisabled(false);
                }else{
                    item.setDisabled(true);
                }
            });
            return;

        }else{
            for (var i = 0; i < btns.length; i++) {
                btns[i].setDisabled(false);
            }
        }

        var info = record.data;
        // 手工创建的节点可删除
        /*if(me.hasDeletePower == false){
            lbar.down('button[itemId=delete]').setDisabled(true);
        }*/

        if (info.cj == 1) {
            me.hasBind = record.raw.displayText.indexOf('<font') == 0;

            if (!me.hasBind) {
                Ext.each(btns, function (item) {
                    item.setDisabled(true);
                    return;
                });
            }
        }
        lbar.down('button[itemId=delete]').setDisabled(true);

        // 非图号节点的新增按钮均不可用
        if (info.cj != 0) {
            lbar.down('button[itemId=create]').setDisabled(true);
        }

        // 试验大类节点，新增按钮提示信息改为“选择试验类型”
        if(info.cj == 1){
            lbar.down('button[itemId=add]').setTooltip('选择试验类型');
        }else{
            lbar.down('button[itemId=add]').setTooltip('新增');
        }
        if(info.cj == 5 || info.cj == 3){
            lbar.down('button[itemId=add]').setDisabled(true);
        }
        // 试验类型、试验大类节点可导入模板
        if(!(info.cj == 1 || info.cj == 2)){
            lbar.down('button[itemId=import]').setDisabled(true);
        }

        // 试验大类、试验类型、试验项节点可导出节点
        if(!(info.cj == 1 || info.cj == 2 || info.cj == 3)){
            lbar.down('button[itemId=export]').setDisabled(true);
        }

        if (info != 0) {
            var node = record;
            /*for (var i = 0; i < parseInt(info.cj); i++) {
                node = node.parentNode;
            }*/
            var localNode = node;
            while (node.parentNode && node.parentNode != me.getRootNode()) {
                node = node.parentNode;
            }
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomRoleController/getCollabPower.rdm',{
                thDataId : node.raw.dataId
            }, false, function (response) {
                if(response.decodedData.results == '-1'){
                    Ext.each(btns, function (item) {
                        item.setDisabled(true);
                    });
                }else {
                    // 图号节点，根据图号dataId 校验所有状态不等于未开始的试验项
                    if(info.cj == 0){
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/RwInfoController/checkRwInfoStatusByThDataId.rdm',{
                            thDataId : localNode.raw.dataId
                        }, false, function (response) {
                            if(response.decodedData == 'FAIL'){
                                lbar.down('button[itemId=delete]').setDisabled(false);
                            }
                        });
                    }
                }
            });
        }
    },

    /**
     * 手动新增功能
     */
    _addTreeNode: function () {
        var me = this;
        var selected = me.selModel.selected.items;

        // 未选择时创建根节点
        if(selected.length == 0){
            var node = me.store.getRootNode(),
                nodeId = "";
            // 选择时创建子节点
        }else{
            var node = selected[0],
                nodeId = node.raw.id,
                cj = node.raw.cj,
                nodeText = node.raw.text,
                nodeType = node.raw.type,
                gs = node.raw.gs;
        }

        // 图号
        if(cj == undefined || cj == 0) {
            // 点击图号节点手工创建时需先选择创建图号节点或者试验类型节点
            var tableId = OrientExtUtil.ModelHelper.getModelId("T_TH", OrientExtUtil.FunctionHelper.getSchemaId(), false);
            createWindow('新增图号信息节点', "", Ext.create('OrientTdm.TestBomBuild.Panel.FormPanel.LeftBomAddFormPanel', {
                modelId: tableId,
                treeNode: node,
                tableName: "T_TH",
                nodeId: nodeId,
                buttonAlign: 'center'
            }), {});

            // 试验阶段选择试验类型
        }else if(cj == 1){
            me._focusOnChooseTestType();

            // 试验类型节点创建试验项
        } else if (cj == 2) {
            // 新增试验项目节点（以前的试验任务）（直接调用新增按钮的代码，减少代码冗余）
            var gridpanel = me.ownerCt.down("#test_OP").down("gridpanel");
            gridpanel.onGridToolBarItemClicked(gridpanel.down('#PowerAddButton'));

            // 试验项的子节点们：仪器、实施人员、参试品、知识、数据（汇总）、文件（汇总）
        } else if (cj == 4 && nodeText != '仪器' && nodeText != '实施人员' && nodeType != 'file') {
            if (nodeText == '数据（汇总）') {
                me._customChildDataNode();
            } else if (nodeText == '参试品') {
                // 参试品选择，调用参试品按钮的实现代码，减少冗余代码
                me.ownerCt.down("#test_OP").down("gridpanel")._chooseFunction();
            } else if (nodeType == 'package') {
                // 直接调用列表上的新增按钮以减少代码冗余
                var gridpanel = me.ownerCt.down("#test_OP").down("gridpanel");
                gridpanel.onGridToolBarItemClicked(gridpanel.down('#PowerAddButton'));
            }

            // 试验项子节点的子节点们：仪器A、参试品A、数据表A
        } else if (cj == 5 && node.parentNode.raw.text == "设备") {
            var cj4Window = Ext.create('widget.window', {
                itemId: "choose01",
                title: '手动新增节点',
                width: 350,
                autoHeight: true,
                layout: 'fit',
                modal: true,
                buttonAlign:'center',
                items:[Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel',{
                    itemId: "choose01Panel",
                    bbar: [{
                        xtype: 'tbfill'
                    },{
                        itemId: "choose01Button",
                        xtype: 'button',
                        text: '确定',
                        handler: function() {
                            if(this.up("#choose01").down("#choose01Label").getValue().inputType == 'package'){
                                me._customChildDataNode(OrientExtUtil.FunctionHelper.getSYZYSchemaId(), cj4Window);
                            }else{
                                var tableId = OrientExtUtil.ModelHelper.getModelId("T_BOM", OrientExtUtil.FunctionHelper.getSchemaId(), false);
                                createWindow('新增文件夹节点', cj4Window, Ext.create('OrientTdm.TestBomBuild.Panel.FormPanel.LeftBomAddFormPanel', {
                                    modelId: tableId,
                                    treeNode: node,
                                    tableName: "T_BOM",
                                    nodeId: nodeId,
                                    gs: gs,
                                    nodeType: 'file',
                                    rid: node.raw.rid == "" ? nodeId : node.raw.rid,
                                    cj: parseInt(cj) + 1,
                                    buttonAlign: 'center'
                                }),{});
                            }
                        },
                        iconCls: 'icon-saveAndClose'
                    },{
                        xtype: 'tbfill'
                    }],
                    items:[{
                        itemId: "choose01Label",
                        name: "choose01Label",
                        xtype: 'radiogroup',
                        width: 300,
                        fieldLabel: '选择节点类型',
                        columns: 2,
                        vertical: true,
                        items: [
                            { boxLabel: '关联节点', name: 'inputType', inputValue: 'package', checked: true},
                            { boxLabel: '文件夹节点', name: 'inputType', inputValue: 'file'}
                        ]
                    }]
                })]
            });
            cj4Window.show();
        } else if (cj == 6 && nodeType == 'package') {
            if (nodeText == '数据') {
                me._customChildDataNode(OrientExtUtil.FunctionHelper.getSYZYSchemaId());
            } else {
                // 直接调用列表上的新增按钮以减少代码冗余
                var gridpanel = me.ownerCt.down("#test_OP").down("gridpanel");
                gridpanel.onGridToolBarItemClicked(gridpanel.down('#PowerAddButton'));
            }
        } else if (cj == 7 && node.parentNode.raw.text == '数据') {
            // 直接调用列表上的新增按钮以减少代码冗余
            var gridpanel = me.ownerCt.down("#test_OP").down("gridpanel");
            gridpanel.onGridToolBarItemClicked(gridpanel.down('#PowerAddButton'));
        }

        /**
         * 表单窗口
         * @param title
         * @param item
         */
        function createWindow(title, chooseWindow, item, initParams){
            if (initParams.listeners != undefined) {
                Ext.apply(initParams.listeners,{
                    show: function () {
                        if(chooseWindow != "") {
                            chooseWindow.close();
                        }
                    }
                })
            } else {
                initParams.listeners = {
                    show: function () {
                        if(chooseWindow != "") {
                            chooseWindow.close();
                        }
                    }
                }
            }
            Ext.applyIf(initParams,{
                title: title,
                autoWidth: false,
                autoHeight: false,
                layout: 'fit',
                modal: true,
                listeners: initParams.listeners,
                items: [item]
            });
            if (initParams.width == undefined) {
                initParams.autoWidth = true;
            }
            if (initParams.height == undefined) {
                initParams.autoHeight = true;
            }
            var win = Ext.create('widget.window', initParams);
            win.show();
            return win;
        }
    },

    _customChildDataNode: function (schemaId, parentWindow) {
        var me = this;
        var parentNode = me.selModel.selected.items[0];
        var parentNodeId = parentNode.raw.id;
        var modelTree = Ext.create('OrientTdm.TestBomBuild.Tree.PowerModelTree', {
            // width: 245,
            schemaId : OrientExtUtil.FunctionHelper.getTestDataSchemaId()
        });

        var win = Ext.create('widget.window', {
            title: '选择模型',
            width: 0.17 * globalWidth,
            height: 0.4 * globalHeight,
            parentNode: parentNode,
            parentNodeId: parentNodeId,
            buttonAlign: 'center',
            buttons: [{
                xtype: "button",
                text: "确定",
                iconCls: 'icon-saveAndClose',
                handler: function () {
                    var modelTreePanel = this.up('window').down('treepanel');
                    // 因为默认会选中数据类那个节点，所以不用在意出现数组为空选index为0时的情况
                    var selectedRecord = OrientExtUtil.TreeHelper.getSelectNodes(modelTreePanel)[0];
                    if (selectedRecord.isLeaf()) {
                        var tableId = selectedRecord.raw.id; //存到T_BOM的M_TABLEID里面
                        var tableText = selectedRecord.raw.text;  //如果要存到T_BOM的M_TABLENAME里的要去掉这个值最后的_500
                        // 首先进行判断该节点名称是否已经存在，如果存在就无法新建
                        OrientExtUtil.AjaxHelper.doRequest(serviceName  + '/TbomQueryController/checkNodeIsExist.rdm', {
                            pid: parentNode.raw.id,
                            cj: parentNode.raw.cj,
                            nodeName: tableText,
                            type: parentNode.raw.type
                        }, false, function (response) {
                            if (response.decodedData.success) {
                                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomInsertController/insertTableNodeByPid.rdm', {
                                    tableId: tableId,
                                    pid: parentNode.raw.id
                                }, false, function (response) {
                                    if(response.decodedData.success) {
                                        OrientExtUtil.Common.tip('提示', '新增节点成功');
                                        var childNodes = parentNode.childNodes;
                                        for (var i = childNodes.length -1; i >= 0; i--) {
                                            parentNode.removeChild(childNodes[i]);
                                        }
                                        parentNode.store.reload({node: parentNode});
                                        if (parentWindow) {
                                            parentWindow.close();
                                        }
                                    }
                                });
                            }
                        });

                        win.close();
                    } else {
                        OrientExtUtil.Common.info('提示', '请选择表或者视图');
                    }

                }
            }],
            layout: 'fit',
            modal: true,
            items: [modelTree]
        }).show();
    },

    /**
     * 试验种类选择
     * @param item 对应的field
     */
    _focusOnChooseTestType: function (addFormPanel) {
        var me = this;

        // 创建新的模板预览面板并显示
        var gridPanel = Ext.create('OrientTdm.TestInfo.ExperimentTypeMgr.ExperimentTypeMgrDashboard', {
            upId: 'sysjgl',
            param: {
                type: '0'
            }
        });

        var panel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel',{
            layout: 'fit',
            itemId: 'testTypePanel',
            bbar: [{
                xtype: 'tbfill'
            },{
                xtype: 'button',
                iconCls: 'icon-createbyimport',
                text: '导入试验类型',
                handler: function (btn) {
                    //var selected = OrientExtUtil.GridHelper.getSelectedRecord(btn.up("#testTypePanel").down("#testTypeGridpanel"));
                    var selected = OrientExtUtil.GridHelper.getSelectedRecord(btn.up("#testTypePanel").down("#ExperimentTree"));
                    if (selected.length == 0 || selected.length > 1) {
                        OrientExtUtil.Common.tip('提示','请选择一条记录');
                        return ;
                    } else {
                        var name = selected[0].raw["text"];
                        var modelName = selected[0].raw['modelName'];
                        var oldDataId = selected[0].raw['dataId']
                        if(oldDataId == '-1' ){
                            OrientExtUtil.Common.tip('提示','请选择一条记录');
                            return ;
                        }
                        if(modelName != 'T_SYLX'){
                            OrientExtUtil.Common.tip('提示','请选择试验类型');
                            return ;
                        }
                        var parentNode = me.selModel.selected.items[0];
                        importt();

                        /**
                         * 用户输入名称
                         */
                        function setName(tip) {
                            Ext.Msg.prompt(tip, '请输入试验类型名称:', function(btn, text){
                                if(btn == 'ok'){
                                    if(text.length == 0){
                                        setName('试验类型名称不能为空！');
                                    }else{
                                        name = text;
                                        checkNodeIsExist();
                                    }
                                }
                            })
                        }

                        /**
                         * 导入
                         */
                        function importt() {
                            // 刷新树
                            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/ExTemplate4SysjglController/create4Sysjgl.rdm", {
                                oldDataId: oldDataId,
                                type: '',
                                name: name,
                                nodePid: parentNode.raw.id,
                                thDataId: parentNode.parentNode.raw.dataId,
                                sylxPid: parentNode.raw.dataId,
                                rid: parentNode.raw.rid
                            }, false, function (response) {
                                // 关闭窗口
                                btn.up('window').close();
                                // 刷新树
                                parentNode.store.load({node: parentNode});
                            });
                        }
                    }
                }
            },{
                xtype: "tbfill"
            }],
            items: [gridPanel]
        });

        Ext.create('widget.window',{
            title: "试验模板",
            width: 0.8 * globalWidth,
            height: 0.8 * globalHeight,
            layout: 'fit',
            modal: true,
            items: [panel]
        }).show();
    },

    /**
     * 编辑按钮功能
     */
    _modifyTreeNode: function() {
        var me = this;
        var selected = me.getSelectionModel().getSelection();
        if(selected.length == 0){
            OrientExtUtil.Common.info("未选择节点","请选择要修改的节点！");
            return;
        }
        var treeNode = selected[0];
        if (treeNode.raw.type == 'file') {
            Ext.create('widget.window', {
                title: '修改【' + treeNode.raw.text + '】节点名称',
                items: [Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel',{
                    itemId: "fileNodeNameModifyPanel",
                    bbar: [{
                        xtype: 'tbfill'
                    },{
                        xtype: 'button',
                        text: '确定',
                        handler: function() {
                            var modelId = OrientExtUtil.ModelHelper.getModelId("T_BOM",OrientExtUtil.FunctionHelper.getSchemaId(),"0");
                            var nameValue = this.up('panel').down('textfield').getValue();
                            var dataList = {
                                ID: treeNode.raw.id
                            };
                            dataList['M_BH_' + modelId] = nameValue;
                            OrientExtUtil.ModelHelper.updateModelData(modelId, [dataList]);
                            var parentNode = treeNode.parentNode;
                            var childNodes = parentNode.childNodes;
                            for (var i = childNodes.length -1; i >= 0; i--) {
                                parentNode.removeChild(childNodes[i]);
                            }
                            parentNode.store.reload({node: parentNode});
                            this.up('window').close();
                        },
                        iconCls: 'icon-saveAndClose'
                    },{
                        xtype: 'tbfill'
                    }],
                    items:[{
                        itemId: "nodeName",
                        xtype: 'textfield',
                        width: 300,
                        fieldLabel: '名称'
                    }]
                })]
            }).show();
            // OrientExtUtil.ModelHelper.updateModelData(modelId, dataList);
        } else {
            OrientExtUtil.Common.info('提示','节点关联数据或表无法通过此按钮进行修改');
            return;
        }
    },

    /**
     * 删除节点功能
     */
    _deleteTreeNode: function () {
        var me = this;
        var selected = me.getSelectionModel().getSelection();
        if(selected.length == 0){
            OrientExtUtil.Common.info('未选择节点', '请选择要删除的节点');
            return;
        }

        var nodeId = selected[0].raw.id;
        var parNode = selected[0].parentNode;

        // 校验节点是否可删除
        if (selected[0].raw.cj == "6") {
            OrientExtUtil.Common.info('提示','试验必要的记录表无法删除')
        }

        Ext.MessageBox.confirm(OrientLocal.prompt.confirm, OrientLocal.prompt.deleteConfirm, function (btn) {
            if (btn == 'yes') {
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomDeleteController/deleteNodeRelationInfo.rdm', {
                    nodeId : nodeId
                }, false, function (response) {
                    if (response.decodedData.success) {
                        // 删除右边标签页
                        while(Ext.getCmp("test_OP").items.items.length > 0){
                            Ext.getCmp("test_OP").removeAll();
                        }
                        // 刷新父节点
                        parNode.removeAll();
                        parNode.store.load({node: parNode});
                    }
                });
            }
        });
    },

    /**
     * 导入试验项目模板
     * @param param
     * @private
     */
    _CreateNodeByImport: function (param) {
        var me = this;
        var selection = me.getSelectionModel().getSelection();
        var curNodeData = selection.length > 0 ? selection[0].data : this.rootNode;

        // 根据试验类型节点名称获取模板树节点Id
        /*var lxTemplateId;
        OrientExtUtil.AjaxHelper.doRequest(
            serviceName + '/TbomTemplateController/getIdByTemplateName.rdm',{
                templateName: curNodeData['text']
            }, false, function (response) {
                lxTemplateId = response.decodedData;
            }
        );*/

        var win = new Ext.Window({
            id: 'templateWindowId',
            title: '导入模板',
            height: 0.6 * globalHeight,
            width: 0.5 * globalWidth,
            layout: 'fit',
            modal: true,
            items: [
                Ext.create('OrientTdm.Collab.PrjTemplate.PrjTemplateMngDashboard', {
                    id: 'templateWindowPrjTemplate',
                    region: 'center',
                    layout: 'border',
                    sysjglParam: {
                        pname: curNodeData.tableName == "T_SYLX" ? curNodeData.text : '',
                        filterCreater: true
                    }
                })
            ],
            bbar:["->", {
                text: '导入',
                iconCls: 'icon-createbyimport',
                itemId: 'import',
                handler: function () {
                    // 获取模板信息
                    var prjTemplateListPanel = Ext.getCmp("prjTemplateListPanel");
                    var record = OrientExtUtil.GridHelper.getSelectedRecord(prjTemplateListPanel);
                    if(record.length != 1){
                        OrientExtUtil.Common.info('提示', '请选择一条数据！');
                        return;
                    }
                    var name = record[0].data['M_RID_' + prjTemplateListPanel.modelId];

                    // 获取节点信息
                    var selection = me.getSelectionModel().getSelection();
                    var curNodeData = selection.length > 0 ? selection[0].data : this.rootNode;
                    var pid = curNodeData['id'];
                    var tableName = curNodeData['tableName'];
                    var flagname = tableName != "T_SYLX" ? '试验类型' : '试验项';
                    checkNodeIsExist();

                    // 校验节点名称是否重复
                    function checkNodeIsExist() {
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomQueryController/checkNodeIsExist.rdm", {
                            pid: pid,
                            nodeName: name
                        }, false, function (response) {
                            var retV = response.decodedData;

                            // 导入
                            if (retV.success) {
                                importt();

                            }else{
                                // 让用户输入新的试验类型名称
                                setName(flagname + '名称【' + name + '】已存在！');
                            }
                        });
                    }

                    /**
                     * 用户输入名称
                     */
                    function setName(tip) {
                        Ext.Msg.prompt(tip, '请输入' + flagname + '名称:', function(btn, text){
                            if(btn == 'ok'){
                                if(text.length == 0){
                                    setName(flagname + '名称不能为空！');
                                }else{
                                    name = text;
                                    checkNodeIsExist();
                                }
                            }
                        })
                    }

                    /**
                     * 导入
                     */
                    function importt() {
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomTemplateController/importTemplate.rdm',{
                                rid: curNodeData['rid'],
                                pid: pid,
                                templateId: me.supportTemplateId,
                                name: name,
                                dataId: record[0].data['M_DID_' + prjTemplateListPanel.modelId],
                                model: record[0].data['M_TYPE_' + prjTemplateListPanel.modelId]
                            }, false, function (resp) {
                                var responseText = Ext.decode(resp.responseText);
                                if(responseText.success){
                                    //  关闭模板弹出框
                                    var templateWindow = Ext.getCmp('templateWindowId');
                                    templateWindow.close();

                                    // 刷新节点
                                    var parentNode = me.selModel.selected.items[0];
                                    parentNode.store.reload({node: parentNode});
                                }else{
                                    OrientExtUtil.Common.info('提示','导入失败！');
                                    return;
                                }

                            }
                        );
                    }
                }
            }, "->"]
        }).show();

    },

    /**
     * 导入模板-选择
     * @private
     */
    _chooseTemplate: function(window){
        var me = this;
        // 获取模板信息
        var prjTemplateListPanel = Ext.getCmp("prjTemplateListPanel");
        var record = OrientExtUtil.GridHelper.getSelectedRecord(prjTemplateListPanel);
        if(record.length != 1){
            OrientExtUtil.Common.info('提示', '请选择一条数据！');
            return;
        }
        var name = record[0].data['M_RID_' + prjTemplateListPanel.modelId];

        // 获取节点信息
        var selection = me.getSelectionModel().getSelection();
        var curNodeData = selection.length > 0 ? selection[0].data : this.rootNode;
        var pid = curNodeData['id'];
        var tableName = curNodeData['tableName'];
        var flagname = tableName != "T_SYLX" ? '试验类型' : '试验项';
        checkNodeIsExist();

        // 校验节点名称是否重复
        function checkNodeIsExist() {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomQueryController/checkNodeIsExist.rdm", {
                pid: pid,
                nodeName: name
            }, false, function (response) {
                var retV = response.decodedData;

                // 导入
                if (retV.success) {
                    importt();

                }else{
                    // 让用户输入新的试验类型名称
                    setName(flagname + '名称【' + name + '】已存在！');
                }
            });
        }

        /**
         * 用户输入名称
         */
        function setName(tip) {
            Ext.Msg.prompt(tip, '请输入' + flagname + '名称:', function(btn, text){
                if(btn == 'ok'){
                    if(text.length == 0){
                        setName(flagname + '名称不能为空！');
                    }else{
                        name = text;
                        checkNodeIsExist();
                    }
                }
            })
        }

        /**
         * 导入
         */
        function importt() {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomTemplateController/importTemplate.rdm',{
                    rid: curNodeData['rid'],
                    pid: pid,
                    templateId: me.supportTemplateId,
                    name: name,
                    dataId: record[0].data['M_DID_' + prjTemplateListPanel.modelId],
                    model: record[0].data['M_TYPE_' + prjTemplateListPanel.modelId]
                }, false, function (resp) {
                    var responseText = Ext.decode(resp.responseText);
                    if(responseText.success){
                        //  关闭模板弹出框
                        var templateWindow = Ext.getCmp('templateWindowId');
                        templateWindow.close();

                        // 刷新节点
                        var parentNode = me.selModel.selected.items[0];
                        parentNode.store.reload({node: parentNode});
                    }else{
                        OrientExtUtil.Common.info('提示','导入失败！');
                        return;
                    }
                }
            );
        }
    },

    /**
     * 导出项目为模板
     * @param param
     * @private
     */
    _exportTemplate: function () {
        var selection = this.getSelectionModel().selected.items[0];
        var curNodeData = selection.raw;
        var exportParams = {
            pName: selection.parentNode.raw['text'],
            nodeId: curNodeData.id,
            sfsy: false,
            url: serviceName + '/TbomTemplateController/createTempleate.rdm'
        };

        var win = new Ext.Window({
            title: '导出为模板',
            width: 0.4 * globalWidth,
            height: 0.2 * globalHeight,
            modal: true,
            plain: true,
            layout: 'fit',
            items: [
                Ext.create("OrientTdm.Collab.common.template.TemplateExportPanel", {
                    baseParams: exportParams,
                    successCallback: function () {
                        win.close();
                    }
                })
            ]
        });
        win.show();
    }

    /**
     * 判断是否具有节点删除权限
     */
/*,_checkDeletePower: function () {
    var hasDeletePower = false;
    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/checkDeletePower.rdm', {}, false, function (response) {
        hasDeletePower = response.decodedData;
    });

    return hasDeletePower;
}*/

});