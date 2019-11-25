Ext.define("OrientTdm.TestBomBuild.Panel.GridPanel.Toolbar.TestProjectGridToolbar_06", {
    extend: 'Ext.Base',

    constructor: function (config) {
        var local = this;
        var me = config.scope;
        this.scope = config.scope;

        // 校验权限
        // 判断是否是试验经理
        var isTestManger = false;
        var isDepManger = false;

        var node = null;
        try{
            node = me.treeNode.parentNode.parentNode.parentNode;
        }catch (e) {}
        // 校验是否是被试品负责人或试验团队中的试验经理
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomRoleController/getCollabPower.rdm',
            me.testDatePanel != undefined ? {
                thDataId : me.testDatePanel.rid,
                rwNodeId: me.testDatePanel.nodeId
            }: {
                thDataId : node.parentNode.parentNode.parentNode.raw.dataId,
                rwNodeId: node.raw.id
            }, false, function (response) {
                if (response.decodedData.results == '1') {
                    isTestManger = true;
                } else if (response.decodedData.results == '0') {
                    isDepManger = true;
                }
            }
        );

        if(me.treeNode.raw.tableName == 'T_XMCSWJ'){
            this.toolbar =  [{
                text: '附件导入',
                iconCls: "icon-attach",
                handler: function () {
                    local._importFile();
                }
            }];

        }else if(me.treeNode.raw.tableName == 'T_TEST_IMPORT'){
            this.toolbar =  [];

        }else{
            var retV = [];
            Ext.each(config.btnArr, function (btn) {
                if (btn.text == "详细" && btn.issystem == 0) {
                    btn.itemId = 'PowerDetailButton';
                    retV.push(btn);
                    return;

                } else if (btn.text == "查询" && btn.issystem == 0) {
                    btn.itemId = 'PowerQueryButton';
                    retV.push(btn);
                    return;

                } else if (btn.text == "查询全部") {
                    btn.itemId = 'system_searchAllButton';
                    retV.push(btn);
                    return;

                }/* else if(btn.issystem == 0 && btn.text == "新增" || btn.text == "修改" || btn.text == "删除"){
                    switch (btn.text) {
                        case '新增': btn.itemId = 'PowerAddButton'; break;
                        case '修改': btn.itemId = 'PowerModifyButton'; break;
                        //case '删除': btn.itemId = 'PowerDeleteButton'; break;
                    }

                    if (node == null) {
                        btn.disabled = local._checkButtonUserPower(btn.text);
                        retV.push(btn);
                    } else if (isTestManger) {
                        retV.push(btn);
                    }
                    return;
                }*/
            });

            retV.push({
                xtype: "button",
                text: "查看历史版本",
                iconCls: 'icon-createbyimport',
                handler: function () {
                    local._recoverVersion();
                }
            },{
                xtype: "button",
                text: "保存版本",
                iconCls: 'icon-exporttemplate',
                handler: function () {
                    local._saveVersion();
                }
            });

            this.toolbar = retV;
        }
    },

    /**
     * 导入数据界面按钮的新增,删除（增删试验经理），修改（导入人）权限判断
     */
    _checkButtonUserPower: function (text) {
        var me = this.scope;
        var hasPower = true;
        if (me.isFromData) {
            var nodeId = me.treeNode.raw.id;
            if(text == '修改'){
                hasPower = userId == me.importer;
            }else{
                var thNodeId = OrientExtUtil.TreeHelper.getParentNodes(nodeId, 5);
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomRoleController/checkButtonUserPowerFromData.rdm',{
                    buttonName: text,
                    thNodeId: thNodeId,
                    importer: me.importer
                }, false, function (response) {
                    if (response.decodedData) {
                        hasPower = response.decodedData.results;
                    }
                });
            }

        }
        return !hasPower;
    },

///////////////////////////////////////////            项目测试文件上传附件                     /////////////////////////////////////////////////////////////////////
    _importFile: function () {
        var me = this.scope;

        var win = Ext.create('Ext.Window', {
            plain: true,
            title: '数据采集',
            modal: true,
            items: [Ext.create('OrientTdm.TestBomBuild.Panel.PowerUploadImportFilePanel', {
                successCallback: function (resp) {
                    var cwmfileId =  Ext.isIE ? resp.result : resp.results.fileid;
                    // 文件已经保存，此时将路径给到项目测试记录表，以及创建子节点
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ProjectTestTableController/insertFileNode.rdm',{
                        rwDataId: me.treeNode.parentNode.parentNode.parentNode.raw.dataId,
                        fileId: cwmfileId,
                        pid: me.treeNode.raw.id
                    }, false, function (response) {
                        if (response.decodedData.success) {
                            win.close();
                            me.fireEvent('refreshGrid');

                            // 刷新自己，展示新增的子节点
                            me.treeNode.store.reload({node: me.treeNode});
                        }
                    });
                }
            })],
            listeners: {
                close: function () {
                    me.fireEvent('refreshGrid');
                }
            }
        }).show();
    },

///////////////////////////////////////////            数据表数据 - 恢复版本                     /////////////////////////////////////////////////////////////////////
    /**
     * 数据表数据 - 恢复版本
     * @private
     */
    _recoverVersion: function(){
        var me = this.scope;

        OrientExtUtil.WindowHelper.createWindow(Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TestDataVersion.TestDataVersionList', {
            nodeId: me.treeNode.raw.id
        }), {
            title: '历史版本',
            layout: "fit",
            width: 0.5 * globalWidth,
            height: 0.5 * globalHeight,
            buttonAlign: 'center'
        });
    },

    /**
     * 数据表数据 - 保存版本
     * @private
     */
    _saveVersion: function(){
        var me = this.scope;

        if(me.store.totalCount == 0){
            OrientExtUtil.Common.tip('提示','当前列表没有数据！');
            return;
        }

        Ext.MessageBox.prompt("提示", "请输入版本名称", function (btnId, text) {
            if (btnId == 'ok') {
                if(text == ''){
                    Ext.Msg.alert('提示', '版本名称不能为空！');
                    return
                }
                if(text == "."){
                    Ext.Msg.alert('提示', '版本名称不能为特殊字符【' + text + '】！');
                    return
                }
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TestDataController/saveVersion.rdm',{
                    nodeId : me.treeNode.raw.id,
                    customerFilter: Ext.encode(me.customerFilter),
                    modelId: me.modelId,
                    versionName: text
                }, false, function (response) {
                    OrientExtUtil.Common.tip('提示','保存版本成功！');
                });
            }
        });
    }

});