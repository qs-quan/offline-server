/**
 * Created by dailin on 2019/3/28 15:58.
 */
Ext.define('OrientTdm.TestBomBuild.Panel.FormPanel.LeftBomAddFormPanel', {
    extend: 'OrientTdm.Common.Extend.Form.OrientAddModelForm',
    alias: 'widget.leftBomAddFormPanel',

    initComponent: function () {
        var me = this;
        me.modelDesc = me.createModelDesc();
        me.bindModelName = me.modelDesc.dbName;
        me.actionUrl = serviceName + '/modelData/saveModelData.rdm';
        me.buttons = me.createButtons();
        me.callParent(arguments);
        if (me.tableName == "T_TH") {
            me._th_initFormData();
        } else if (me.tableName == "T_BOM") {
            me._bomInfo_initFormData();
        } else if (me.tableName == "T_RW_INFO") {
            me._rwInfo_initFormData();
        } else if (me.treeNode && me.treeNode.raw.cj == 2) {
            me._testRelation_initFormData(me.modelGridDataId);
        } else if (me.treeNode && me.treeNode.raw.cj == 5) {
            me._testData_initFormData();
        } else if (me.treeNode && me.treeNode.raw.tableName == "T_SYJ") {
            me._syj_initFormData();
        }
    },

    /**
     * 获取表单结构
     * @returns {*}
     */
    createModelDesc: function () {
        var me = this;
        var modelDesc;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDesc.rdm', {
            modelId: me.modelId,
            schemaId: OrientExtUtil.FunctionHelper.getSchemaId()
        }, false, function (response) {
            modelDesc = response.decodedData.results.orientModelDesc;
        });

        return modelDesc;
    },

    /**
     * 表单提交成功后的回调函数
     * @param response
     */
    successCallback: function (response) {
        var me = this;
        if (response.success) {
            var dataId = response.results;
            if (me.treeNode.raw.cj == '5' && me.treeNode.parentNode.raw.text == "数据（汇总）") {
                me.up('window').close();
                return;
            }
            if (me.treeNode.raw.cj == '2' && me.tableName == "T_SYTJ") {
                // 同步到数据字典
                /*OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DictionaryController/insertInfoToDictionary.rdm',{
                    dataId: dataId,
                    testTypeDataId: me.testTypeDataId,
                    modelName: me.tableName
                }, false, function () {});*/

                var testConditionId = OrientExtUtil.TreeHelper.getChildNode(3, me.nodeId, ["工况"]);
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomInsertController/insertNodeByData.rdm', {
                    pid: testConditionId,
                    tableName: "T_SYTJ",
                    tableId: me.modelId,
                    dataId: dataId,
                    cj: 4
                }, false, function (response) {
                    if (me.treeNode) {
                        // 重新加载这个节点有时候会没有用，就删除所有子节点重新再加载一次节点
                        var childNodes = me.treeNode.childNodes;
                        for (var i = childNodes.length - 1; i >= 0; i--) {
                            me.treeNode.removeChild(childNodes[i]);
                        }
                        me.treeNode.store.reload({node: me.treeNode});
                    }
                    me.up('window').close();
                });
            } else if (me.treeNode.raw.cj == '3' && me.tableName != "T_SYTJ") {
                me.up('window').close();
            } else if (me.tableName == "T_TH") {
                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomInsertController/synchronizationNode.rdm", {
                    pNodeId: me.treeNode.raw.id,
                    pDataId: me.treeNode.raw.dataId,
                    pRid: me.treeNode.raw.rid,
                    dataId: dataId
                }, false, function (response) {
                    if (response.decodedData.success) {
                        me.treeNode.store.reload({node: me.treeNode});
                        me.up('window').close();
                    }
                });
            } else if (me.tableName == "T_BOM" && me.cj == 1) {
                //主动新增
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomInsertController/bindNodeRelation.rdm', {
                    nodeId: dataId,
                    masterId: me.testTypeId,
                    relType: 'T_SYLX'
                }, false, function (response) {
                    // 重新加载这个节点有时候会没有用，就删除所有子节点重新再加载一次节点
                    /*var childNodes = me.treeNode.childNodes;
                    for (var i = childNodes.length -1; i >= 0; i--) {
                        me.treeNode.removeChild(childNodes[i]);
                    }*/
                    me.treeNode.store.load({node: me.treeNode});
                    // Ext.getCmp('leftBomTreePanel').expandPath(me.treeNode.getPath());

                    me.up('window').close();
                });
            } else if (me.tableName == 'T_BOM' && me.nodeType == 'file') {
                var childNodes = me.treeNode.childNodes;
                for (var i = childNodes.length - 1; i >= 0; i--) {
                    me.treeNode.removeChild(childNodes[i]);
                }
                me.treeNode.store.load({node: me.treeNode});
                me.up('window').close();
            } else {
                // 被动新增
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomInsertController/insertNodeByData.rdm', {
                    pid: me.treeNode.raw.id,
                    tableName: me.tableName,
                    tableId: me.modelId,
                    dataId: dataId,
                    // 层级加 1
                    cj: parseInt(me.treeNode.raw.cj) + 1
                }, false, function (response) {
                    if (response.decodedData.success) {
                        if (me.supportSuccessCallBack != undefined) {
                            me.supportSuccessCallBack(dataId);
                        }
                        // 重新加载这个节点有时候会没有用，就删除所有子节点重新再加载一次节点
                        var childNodes = me.treeNode.childNodes;
                        for (var i = childNodes.length - 1; i >= 0; i--) {
                            me.treeNode.removeChild(childNodes[i]);
                        }
                        me.treeNode.store.load({node: me.treeNode});

                        // me.up('window').dataIds = me.up('window').dataIds + "," + dataId;
                        me.up('window').close();
                    }
                });
            }
        }
    },

    createButtons: function () {
        var me = this;
        return [{
            itemId: 'save',
            text: '保存',
            scope: me,
            iconCls: 'icon-save',
            handler: function (btn) {
                var me = this;
                btn.up('form').fireEvent('saveOrientForm', {
                    modelId: me.modelId
                });
            }
        }, {
            itemId: 'back',
            text: '取消',
            scope: me,
            iconCls: 'icon-close',
            handler: function (btn) {
                btn.up("window").close();
            }
        }
        ]
    },

    /**
     * 初始化图号表单
     */
    _th_initFormData: function () {
        var me = this;
        var fieldsItems = me.getForm().getFields().items;

        // 节点Id 不等于空时获取对应的图号信息
        if (me.nodeId != "") {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getPdmOrMesInfoByTableIdAndNodeId.rdm', {
                tableId: me.modelId,
                tableName: me.tableName,
                nodeId: me.nodeId
            }, false, function (response) {
                if (response.decodedData.success && response.decodedData.results[0]) {
                    var retV = response.decodedData.results[0];
                    if (retV) {
                        // 填充父编号，父版本，项目编号，归属项目
                        Ext.each(fieldsItems, function (item) {
                            if (item.name.indexOf("M_FBH_") > -1) {
                                item.setValue(retV.bh);
                            } else if (item.name.indexOf("M_FBB_") > -1) {
                                item.setValue(retV.bb);
                            } else if (item.name.indexOf("M_XMBH_") > -1) {
                                item.setValue(retV.xmbh);
                            } else if (item.name.indexOf("M_GSXM_") > -1) {
                                item.setValue(retV.gsxm);

                                // 设置节点归属为“1”，用户创建节点
                            } else if (item.name.indexOf("M_JDGS_") > -1) {
                                item.setValue("1");
                                item.setHiddenState(true);
                            }
                        })
                    }
                }
            });
        }
    },

    _bomInfo_initFormData: function () {
        var me = this;
        var fieldsItems = me.getForm().getFields().items;
        if (me.cj == 1) {
            Ext.each(fieldsItems, function (item) {
                // 父节点，根节点
                if (item.name.indexOf("M_PID_") > -1) {
                    item.setValue(me.nodeId);
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_RID_") > -1) {
                    item.setValue(me.rid);
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_TYPE_") > -1) {
                    item.setValue('package');
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_SCHEMA_ID_") > -1) {
                    item.setValue(OrientExtUtil.FunctionHelper.getSchemaId());
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_TABLE_NAME_") > -1) {
                    item.setValue("T_RW_INFO");
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_TABLE_ID_") > -1) {
                    item.setValue(OrientExtUtil.ModelHelper.getModelId("T_RW_INFO", OrientExtUtil.FunctionHelper.getSchemaId(), false));
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_JDGS_") > -1) {
                    item.setValue("1");
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_CJ_") > -1) {
                    item.setValue(me.cj);
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_MJ_") > -1) {
                    item.setValue(me.treeNode.raw.mj);
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_STATE_") > -1) {
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_ICON_") > -1) {
                    item.setValue("icon-list-relation-node");
                    item.setHiddenState(true)
                } else if (item.name.indexOf("M_BJ_") > -1) {
                    item.setValue("yz");
                    item.setHiddenState(true)
                }
            })

        } else if (me.nodeType == 'file') {
            Ext.each(fieldsItems, function (item) {
                // 父节点，根节点
                if (item.name.indexOf("M_PID_") > -1) {
                    item.setValue(me.nodeId);
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_RID_") > -1) {
                    item.setValue(me.rid);
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_TYPE_") > -1) {
                    item.setValue('file');
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_SCHEMA_ID_") > -1) {
                    item.setValue("");
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_TABLE_NAME_") > -1) {
                    item.setValue("CWM_FILE");
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_TABLE_ID_") > -1) {
                    item.setValue('');
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_JDGS_") > -1) {
                    item.setValue("1");
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_CJ_") > -1) {
                    item.setValue(me.cj);
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_MJ_") > -1) {
                    item.setValue(me.treeNode.raw.mj);
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_STATE_") > -1) {
                    item.setHiddenState(true);
                } else if (item.name.indexOf("M_ICON_") > -1) {
                    item.setValue("icon-dir-node");
                    item.setHiddenState(true)
                } else if (item.name.indexOf("M_BJ_") > -1) {
                    item.setValue("");
                    item.setHiddenState(true)
                }
            })
        }
    },

    _rwInfo_initFormData: function () {
        var me = this;
        var fieldsItems = me.getForm().getFields().items;
        // 图号节点的dataId
        var node = me.treeNode;
        while (node.parentNode != me.treeNode.getOwnerTree().getRootNode()) {
            node = node.parentNode;
        }
        var dataId = node.raw.dataId;
        /*OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getPdmOrMesInfoByTableIdAndNodeId.rdm',{
            tableId: OrientExtUtil.ModelHelper.getModelId("T_TH", OrientExtUtil.FunctionHelper.getSchemaId(), false),
            tableName: "T_TH",
            nodeId: me.treeNode.parentNode.parentNode.raw.id
        },false,function (response) {
            if (response.decodedData.success && response.decodedData.results[0]) {
                dataId = response.decodedData.results[0].id;
            }
        });*/

        if (me.formPanelValue) {
            var formPanelValue = me.formPanelValue;
        }

        /*var depField = "";
        var depDisplayField = "";
        Ext.each(fieldsItems, function (item) {
            if (item.name.indexOf('M_DEP_') > -1 && item.name.indexOf("_display") == -1) {
                depField = item;
            } else if (item.name.indexOf('M_DEP_') > -1 && item.name.indexOf("_display") > -1) {
                depDisplayField = item;
            }
        });*/

        var roleIds = OrientExtUtil.SysMgrHelper.getCustomRoleIds();
        Ext.each(['M_ZRR_'/*, 'M_HJ_FZR_'*/], function (fieldName) {
            var responsibleField = me.down('SimpleColumnDescForSelector[name=' + fieldName + me.modelId + ']');
            // 设置角色ids
            var selectorDesc = Ext.decode(responsibleField.columnDesc.selector);
            selectorDesc.filterValue = roleIds;
            selectorDesc.filterTH = dataId;
            responsibleField.columnDesc.selector = Ext.encode(selectorDesc);
        });


        var handleField = ['', '', '', '', '', '', '', ''];
        Ext.each(fieldsItems, function (item) {
            switch (item.name) {
                /*case 'M_ZRR_' + me.modelId: {  //M_HJ_FZR_
                    handleField[0] = item;
                    break;
                }
                case 'M_ZRR_' + me.modelId + '_display': {  //M_HJ_FZR_
                    handleField[1] = item;
                    break;
                }
                case 'M_DEP_' + me.modelId: {
                    handleField[2] = item;
                    break;
                }
                case 'M_DEP_' + me.modelId + '_display': {
                    handleField[3] = item;
                    break;
                }*/
                case 'T_SYLX_' + OrientExtUtil.FunctionHelper.getSchemaId() + '_ID': {
                    handleField[4] = item;
                    break;
                }
                case 'T_SYLX_' + OrientExtUtil.FunctionHelper.getSchemaId() + '_ID_display': {
                    handleField[5] = item;
                    break;
                }
            }
        });

        /*handleField[0].addListener('change', function (item, newValue) {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getDepInfo.rdm', {
                userId: newValue
            }, false, function (response) {
                if (response.decodedData.success) {
                    var deptName = response.decodedData.results.deptName;
                    var deptId = response.decodedData.results.deptId;
                    handleField[3].setValue(depDisplayField.tpl.apply({'name':deptName,'id': deptId}));
                    handleField[2].setValue(deptId);
                }
            })
        });*/

        handleField[5].setValue(new Ext.XTemplate(handleField[5]['template']['normalReadTplArray']).apply({
            'name': me.treeNode.raw.text,
            'id': me.treeNode.raw.dataId
        }));
        handleField[4].setValue(me.treeNode.raw.dataId);
    },

    /**
     * 设置所属项目，并不可修改
     * @param dataId
     * @private
     */
    _testRelation_initFormData: function (dataId) {
        var me = this;
        var fieldsItems = me.getForm().getFields().items;
        Ext.each(fieldsItems, function (item) {
            if (item['name'] == "T_RW_INFO_" + OrientExtUtil.FunctionHelper.getSchemaId() + "_ID") {
                item.setValue(dataId);
            } else if (item['name'] == "T_RW_INFO_" + OrientExtUtil.FunctionHelper.getSchemaId() + "_ID" + "_display") {
                var taskInfo = OrientExtUtil.ModelHelper.getModelData("T_RW_INFO", OrientExtUtil.FunctionHelper.getSchemaId(), dataId);
                var displayValue = OrientExtUtil.ModelHelper.getDisplayDataByModelId(
                    OrientExtUtil.ModelHelper.getModelId("T_RW_INFO", OrientExtUtil.FunctionHelper.getSchemaId(), false), {formData: JSON.stringify({fields: taskInfo})});

                item.setValue(new Ext.XTemplate(item['template']['normalReadTplArray']).apply({
                    'name': displayValue,
                    'id': dataId
                }));
            }
        });

    },

    /**
     * 试验相关信息的选择（和试验类型进行绑定）
     * @param item 对应表单的具体label的item
     * @param testTypeId 试验类型id
     * @param tableName 管理相关信息数据的表
     * @param displayColumnName 要映射到表单上的列名称
     */
    focusOnChooseTestRelationAttribute: function (item, testTypeId, tableName, displayColumnName) {
        var me = this;
        var tableId = OrientExtUtil.ModelHelper.getModelId(tableName, OrientExtUtil.FunctionHelper.getSYZYSchemaId(), false);

        var initParams = {
            itemId: "testRelationAttributeGridpanel",
            modelId: tableId,
            isView: 0,
            region: 'center',
            customerFilter: [
                {
                    filterName: "T_SYLX_" + OrientExtUtil.FunctionHelper.getSYZYSchemaId() + "_ID",
                    filterValue: testTypeId,
                    operation: "Equal"
                }
            ],
            createToolBarItems: function () {
                return []
            }
        };
        var modelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", initParams);

        var panel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
            layout: 'fit',
            itemId: "testRelationAttributePanel",
            bbar: [{
                xtype: 'tbfill'
            }, {
                xtype: 'button',
                text: '确定',
                handler: function (btn) {
                    var grid = btn.up("#testRelationAttributePanel").down("#testRelationAttributeGridpanel");
                    if (OrientExtUtil.GridHelper.getSelectedRecord(grid).length == 0) {
                        item.setValue("");
                        btn.up('window').close();
                    } else {
                        var testRelationAttributeValue = Ext.Array.pluck(
                            Ext.Array.pluck(OrientExtUtil.GridHelper.getSelectedRecord(grid), 'raw'),
                            displayColumnName + "_" + tableId).join(";");
                        item.setValue(testRelationAttributeValue);
                        btn.up('window').close();
                    }
                }
            }, {
                xtype: "tbfill"
            }],
            items: [modelGrid]
        });

        Ext.create('widget.window', {
            title: "选择" + item['columnDesc']['text'],
            width: 600,
            height: 400,
            layout: 'fit',
            modal: true,
            items: [panel]
        }).show();
    },

    _testData_initFormData: function () {
        var me = this;
        var fieldsItems = me.getForm().getFields().items;
        // nodeId me.treeNode.raw.id
        Ext.each(fieldsItems, function (item) {
            if (item.name.indexOf("M_NODE_ID_") > -1) {
                item.setValue(me.treeNode.raw.id);
                item.setHiddenState(true);
            }
        });
    },

    /**
     * 试验件赋值
     * @private
     */
    _syj_initFormData: function () {
        var me = this;
        var fieldsItems = me.getForm().getFields().items;
        Ext.each(fieldsItems, function (item) {
            if (item.name.indexOf("C_PRJ_INFO_") > -1) {
                item.setValue(me.treeNode.parentNode.raw.text);
            } else if (item.name.indexOf('C_ZT_') > -1) {
                item.setValue("1");
            }
        });
        me.supportSuccessCallBack = function (dataId) {
            var dataList = {
                ID: dataId
            };
            dataList['C_PRJ_NODE_ID_' + me.modelId] = me.treeNode.parentNode.raw.id;
            OrientExtUtil.ModelHelper.updateModelData(me.modelId, [dataList]);
        }
    },

    /**
     * 表单校验
     * @returns {boolean}
     */
    customValidate: function () {
        var me = this;
        var retVal = true;
        var formData = OrientExtUtil.FormHelper.getModelData(this);
        var modelId = this.modelDesc.modelId;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/validateAll.rdm', {
            formData: formData,
            modelId: modelId
        }, false, function (resp) {
            var respData = resp.decodedData;
            if (respData.results != null && respData.results.length > 0) {
                retVal = false;
                var errorMsg = Ext.Array.pluck(respData.results, "errorMsg").join('</br>');
                OrientExtUtil.Common.err(OrientLocal.prompt.error, errorMsg, function () {
                    //清除错误
                    var columnDesc = me.modelDesc.createColumnDesc;
                    for (var i = 0; i < columnDesc.length; i++) {
                        var columns = me.modelDesc.columns;
                        for (var j = 0; j < columns.length; j++) {
                            if (columnDesc[i] == columns[j].id) {
                                var field = me.down('[name=' + columns[j].sColumnName + ']');
                                if (field) {
                                    field.clearInvalid();
                                }
                                break;
                            }
                        }
                    }
                    //markInvalid
                    Ext.each(respData.results, function (error) {
                        var errColumnName = error.columnSName;
                        if (!Ext.isEmpty(errColumnName)) {
                            var field = me.down('[name=' + errColumnName + ']');
                            if (field.markInvalid) {
                                field.markInvalid(error.errorMsg);
                            }
                        }
                    });
                });
            }
        });
        if (retVal == false || me.treeNode.raw.cj == '5') {
            return retVal;
        }
        // 校验图号节点
        if (me.treeNode.raw.cj == '0' || me.treeNode.raw.cj == undefined) {
            if (me.treeNode.raw.cj == undefined) {
                //判断试验类型是否可用， 2019年9月20日 子图号不需要判断
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/checkStatus.rdm', {
                    applyType: "",
                    th: this.getForm().getValues()["M_BH_" + modelId]
                }, false, function (response) {
                    retVal = response.decodedData.results;
                });
                if (!retVal) {
                    OrientExtUtil.Common.err('提示', '该图号下所有试验没有进行委托单申请或委托单还未通过审核');
                    return retVal;
                }

            } else {
                var rid = me.treeNode.raw.rid;
                if (rid == null) {
                    rid = me.treeNode.raw.id
                }
                // 校验图号结构树上是否存在相同图号的图号信息
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/PdmController/checkSameThCode4ThStructure.rdm', {
                    th: this.getForm().getValues()["M_BH_" + modelId],
                    rid: rid
                }, false, function (response) {
                    retVal = response.decodedData;
                    if (!retVal) {
                        OrientExtUtil.Common.err('提示', '已存在相同名称的图号');
                    }
                });
            }

            // 其他节点校验：同级节点名称禁止重复
        } else if (me.treeNode.raw.cj != '2' || (me.treeNode.raw.cj == '2' && me.tableName == "T_SYTJ")) {
            var displayValue = OrientExtUtil.ModelHelper.getDisplayDataByModelId(modelId, formData);
            if (displayValue == "") {
                OrientExtUtil.Common.tip('提示', '数据表需要设置主键显示值');
                return false;
            }
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/checkNodeIsExist.rdm', {
                pid: me.treeNode.raw.id,
                cj: me.treeNode.raw.cj,
                nodeName: displayValue
            }, false, function (response) {
                if (!response.decodedData.success) {
                    OrientExtUtil.Common.err('提示', '当前层级已存在相同名称的节点');
                    retVal = false;
                }
            });
        }
        //比较开始时间和结束时间
        var endDateStr = this.getForm().getValues()['M_JSSJ_' + modelId];
        if (endDateStr) {
            var startDate = new Date(this.getForm().getValues()['M_KSSJ_' + modelId]).getTime();
            var endDate = new Date(endDateStr).getTime();
            retVal = startDate < endDate ? retVal : false;
            OrientExtUtil.Common.err('提示', '结束时间不能早于开始时间');
        }
        return retVal;
    }


});
