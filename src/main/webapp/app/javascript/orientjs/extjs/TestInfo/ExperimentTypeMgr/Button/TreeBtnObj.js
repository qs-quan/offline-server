Ext.define('OrientTdm.TestInfo.ExperimentTypeMgr.Button.TreeBtnObj', {
    alias: 'widget.TreeBtnObj',

    initComponent: function (up, isMenu, recordData) {
        var me = this;

        var toolbar = [];
        me._pushBtn(toolbar, {
            name: 'createfolder',
            iconCls: 'icon-createfolder',
            disabled: isMenu,
            handler: Ext.bind(me._onCreateNode, up, [{toCreateModelName: 'T_SYLX'}])
        }, isMenu, '新增试验类型');
        toolbar.push(' ', ' ', ' ');

        me._pushBtn(toolbar, {
            name: 'createbyhand',
            iconCls: 'icon-createbyhand',
            handler: Ext.bind(me._onCreateNode, up, [{toCreateModelName: 'T_RW_INFO'}]),
            disabled: !isMenu ?
                true:
                recordData.modelName == 'T_SYLX' ?
                    false : true
        }, isMenu, '新增试验项');
        toolbar.push(' ', ' ', ' ');

        me._pushBtn(toolbar, {
            iconCls: 'icon-delete',
            handler: Ext.bind(me._onDeleteNode, up),
            name: 'delete',
            disabled: !isMenu
        }, isMenu, '删除');
        toolbar.push('-', ' ');

        /*me._pushBtn(toolbar, {
            name: 'import',
            iconCls: 'icon-import',
            disabled: !isMenu ?
                false:
                recordData.modelName == 'T_SYLX' ?
                    false : true,
            handler: Ext.bind(me._onImportInfo, up)
        }, isMenu,  '从模板导入');
        toolbar.push(' ', ' ', ' ');

        me._pushBtn(toolbar, {
            iconCls: 'icon-export',
            handler: Ext.bind(me._onExportInfo, up),
            name: 'export',
            disabled: !isMenu
        }, isMenu, '导出为模板');
        toolbar.push('-', ' ');*/

        me._pushBtn(toolbar, {
            name: 'import_private',
            iconCls: 'icon-import',
            disabled: !isMenu ?
                false:
                recordData.modelName == 'T_SYLX' ?
                    false : true,
            handler: Ext.bind(me._onImportPrivateInfo, up)
        }, isMenu,  '从私有模板导入');

        return isMenu ?
            Ext.create('Ext.menu.Menu',{
                items: toolbar
            }):
            toolbar;
    },

    /**
     * 创建子节点
     * @param param
     * @param fromRoot
     * @private
     */
    _onCreateNode: function (param, fromRoot) {
        var me = this;
        var mainModelName = param.toCreateModelName;
        var selection = this.getSelectionModel().getSelection();
        var parentNode = fromRoot == true ? this.getRootNode() : selection[0];
        var curNodeData;
        // todo 判断情况可能少了一些
        if (selection.length == 0 && mainModelName == "T_SYLX") {
            curNodeData = this.rootNode;
        } else {
            curNodeData = selection[0].data;
        }

        var combobox = Ext.create('OrientTdm.Common.Extend.Form.Field.OrientComboBox', {
            initFirstRecord: false,
            remoteUrl: serviceName + '/ExperimentController/getTestInfoCombobox.rdm?treeNodeId='
                + curNodeData.id + '&mainModelName=' + mainModelName,
            queryMode: 'remote',
            anchor: '100%',
            name: 'pdId',
            fieldLabel: mainModelName == "T_SYLX" ? '选择试验类型' : '选择试验项',
            emptyText: '--请选择--',
            editable: false,
            listeners : {
                // 用正则实现根据输入的过滤，方便查找和添加
                'beforequery':function(e){
                    var combo = e.combo;
                    if(!e.forceAll){
                        var input = e.query;
                        // 检索的正则
                        var regExp = new RegExp(".*" + input + ".*");
                        // 执行检索
                        combo.store.filterBy(function(record,id){
                            // 得到每个record的项目名称值
                            var text = record.get(combo.displayField);
                            return regExp.test(text);
                        });
                        combo.expand();
                        return false;
                    }
                }
            }

        });

        var comboboxForm = new Ext.form.FormPanel({
            width: 400,
            split: true,
            border: false,
            bodyStyle: 'padding:5px',
            labelWidth: 15,
            items: [{
                layout: 'column',
                border: false,
                items: [combobox]
            }]
        });

        var win = new Ext.Window({
            title: mainModelName == "T_SYLX" ? '新增试验类型' : '新增试验项',
            width: 350,
            height: 95,
            layout: 'fit',
            modal: true,
            items: [
                comboboxForm
            ],
            listeners: {
                'refresh': function () {
                    me._refreshNode(curNodeData.id, false);
                }
            },
            buttons:[{
                text: '保存',
                handler: function () {
                    var field = this.up('window').down('orientComboBox');
                    var value = field.getValue();
                    var displayValue = field.getDisplayValue();

                    // 进行判断：1、是否为空 2、获取输入的值或者选中的值 3、为空判断 4、唯一性判断 5、被动新增(数据字典表，试验类型表，关联表，树表)
                    if (value == null || value == '' || displayValue == '') {
                        field.markInvalid("选择不可为空!");
                        return;
                    } else {
                        check(displayValue);

                        /**
                         * 判断名称是否重复
                         */
                        function check(displayValue){
                            // 判断试验信息选择
                            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ExperimentController/checkTestInfoInvalid.rdm', {
                                value: value,
                                displayValue: displayValue,
                                modelName: mainModelName,
                                treeNodeId: curNodeData.id
                            }, false, function (response) {
                                if (response.decodedData.success) {
                                    var resp = response.decodedData.results;
                                    if (!resp.isValid){
                                        // 重置名称
                                        setName(resp.msg);
                                        // 关闭窗口
                                        field.up('window').close();
                                    }else{
                                        saveData(resp);
                                    }
                                }
                            });
                        }

                        /**
                         * 重置名称
                         */
                        function setName(tipInfo) {
                            Ext.Msg.prompt(tipInfo, '请输入名称：', function(btn, text) {
                                if (btn == 'ok') {
                                    if(text == ''){
                                        setName('名称不能为空');
                                    }else{
                                        check(text);
                                    }
                                }
                            });
                        }

                        /**
                         * 保存数据
                         */
                        function saveData(resp) {
                            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ExperimentController/insertTestInfoAndNode.rdm', {
                                value: resp.value,
                                displayValue: resp.displayValue,
                                modelName: mainModelName,
                                pNodeId: curNodeData.id,
                                pDataId: curNodeData.dataId
                            }, false, function (responseData) {
                                me._refreshNode(curNodeData.id, false);
                                field.up('window').close();
                            });
                        }
                    }
                }
            }]
        });
        win.show();

    },

    /**
     * 删除节点
     * @private
     */
    _onDeleteNode: function () {
        var me = this;
        var selection = this.getSelectionModel().getSelection();
        if(selection.length  == 0 ){
            //Ext.Msg.alert("提示", '至少填写一项查询条件！');
            return;
        }
        var selectedData = selection[0].raw;

        Ext.Msg.confirm('提示', '是否删除?', function (btn, text) {
            if (btn == 'yes') {
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ExperimentController/deleteAll.rdm', {
                    oldDataId: selectedData['dataId'],
                    type: selectedData['modelName']
                }, false, function (responseData) {
                    var result = Ext.decode(responseData.responseText);
                    if(result.success){
                        me._refreshNode(selectedData['pid'], false);
                    }
                })
            }
        });
    },

    /**
     * 导入私有模板
     * @private
     */
    _onImportPrivateInfo: function(){

    },

    /**
     * 导入
     * @private
     */
    _onImportInfo: function (a, b, c, d, e, f, g) {
        var me = this;

        var treeDataId = -1;
        var selecteds = me.getSelectionModel().getSelection();
        if(selecteds.length == 1){
            treeDataId = selecteds[0].raw.dataId
        }

        var win = new Ext.Window({
            title: '导入模板',
            height: 0.8 * globalHeight,
            width: 0.8 * globalWidth,
            layout: 'fit',
            modal: true,
            items: [
                Ext.create("OrientTdm.TestInfo.ExperimentTypeMgr.Template.TemplateDashboard", {
                    layout: 'fit',
                    treeDataId: treeDataId
                })
            ]
        }).show();
    },

    /**
     * 导出
     * @private
     */
    _onExportInfo: function () {
        var selection = this.getSelectionModel().selected.items[0];
        var curNodeData = selection.raw;
        var exportParams = {
            url: serviceName + '/ExTemplateController/createTempleate.rdm',
            sfsy: '',
            type: selection.data.modelName == 'T_SYLX' ? 'LX' : 'RW',
            dataId: selection.data.dataId
        };

        var win = new Ext.Window({
            title: '导出模板',
            width: 0.6 * globalWidth,
            height: 0.22 * globalHeight,
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
        }).show();
    },

    /**
     * 根据按钮栏的的不同设置按钮属性
     * @param toolbar
     * @param btn
     * @param isShowText
     * @param text
     * @private
     */
    _pushBtn : function (toolbar, btn, isShowText, text) {
        if(isShowText){
            btn.text = text;
        }else{
            btn.tooltip = text;
        }
        toolbar.push(btn);
    }

});