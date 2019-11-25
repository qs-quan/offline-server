/**
 * 修改界面，无法编辑M_BH字段
 * Created by dailin on 2019/4/12 9:23.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.FormPanel.PowerModifyFormPanel', {
    extend: 'OrientTdm.Common.Extend.Form.OrientModifyModelForm',
    alias: 'widget.powerModifyFormPanel',

    initComponent: function() {
        var me = this;
        me.callParent(arguments);
        if (me.tableName == "T_RW_INFO") {
            me._handleField();
        } else if (me.treeNode && me.treeNode.raw.cj == 2) {
            me._testRelation_initFormData();
        }
    },

    _testRelation_initFormData: function () {
        var me = this;
        var handleFieldName = "T_RW_INFO_" + OrientExtUtil.FunctionHelper.getSchemaId() + "_ID_display";
        //var data = JSON.parse(me.originalData[handleFieldName])[0];
        var fieldItems = me.getForm().getFields().items;
        Ext.each(fieldItems, function (item) {
            if (item.name == handleFieldName) {
                item.tpl = new Ext.XTemplate(item['template']['normalReadTplArray']);
            }
        });
    },

    /**
     * 处理试验任务的字段
     * @private
     */
    _handleField: function() {
        var me = this;
        // 图号节点的dataId
        var node = me.treeNode;
        while (node.parentNode != me.treeNode.getOwnerTree().getRootNode()) {
            node = node.parentNode;
        }
        var dataId = node.raw.dataId;

        var roleIds = OrientExtUtil.SysMgrHelper.getCustomRoleIds();
        //Ext.each(['M_ZRR_'], function (fieldName) {
            var responsibleField = me.down('SimpleColumnDescForSelector[name=M_ZRR_' + me.modelId + ']');
            // 设置角色ids
            var selectorDesc = Ext.decode(responsibleField.columnDesc.selector);
            selectorDesc.filterValue = roleIds;
            selectorDesc.filterTH = dataId;
            responsibleField.columnDesc.selector = Ext.encode(selectorDesc);
        //});

        var fieldsItems = me.getForm().getFields().items;
        Ext.each(fieldsItems, function (item) {
            if(item.name == ('T_SYLX_' + OrientExtUtil.FunctionHelper.getSchemaId() + '_ID_display')){
                item.refType = 10;
                item.editAble = false;
                //item.setValue(new Ext.XTemplate(item.template.normalReadTplArray).apply());
                //item.tpl = new Ext.XTemplate(item.template.normalReadTplArray).apply();
            }
            /*if (item.name.indexOf('M_DEP_') > -1 && item.name.indexOf("_display") == -1) {
                depField = item;
            } else if (item.name.indexOf('M_DEP_') > -1 && item.name.indexOf("_display") > -1) {
                depDisplayField = item;
            }*/
        });

/*        if(depField == undefined || depDisplayField == undefined){
            return;
        }
        Ext.each(fieldsItems, function (item) {
            if (item.name.indexOf("M_ZRR_") > -1 && item.name.indexOf("_display") == -1) { //M_HJ_FZR_
                item.addListener('change', function (item, newValue) {
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getDepInfo.rdm', {
                        userId: newValue
                    }, false, function (response) {
                        if (response.decodedData.success) {
                            var deptName = response.decodedData.results.deptName;
                            var deptId = response.decodedData.results.deptId;
                            depDisplayField.setValue(depDisplayField.tpl.apply({'name':deptName,'id': deptId}));
                            depField.setValue(deptId);
                        }
                    })
                });
            }
        });*/
    },

    /**
     * 试验相关信息的选择（和试验类型进行绑定）
     * @param item 对应表单的具体label的item
     * @param testTypeId 试验类型id
     * @param tableName 管理相关信息数据的表
     * @param displayColumnValue 要映射到表单上的列名称
     * @private
     */
    _focusOnChooseTestRelationAttribute: function(item, testTypeId, tableName, displayColumnValue) {
        var me = this;
        var tableId = OrientExtUtil.ModelHelper.getModelId(tableName, OrientExtUtil.FunctionHelper.getSYZYSchemaId(), false);
        return;
        var initParams = {
            itemId: 'testRelationAttributeGridpanel',
            modelId: tableId,
            isView: 0,
            region: 'center',
            customerFilter: [
                {
                    filterName: "T_SYLX_"+ OrientExtUtil.FunctionHelper.getSYZYSchemaId() + "_ID",
                    filterValue: testTypeId,
                    operation: "Equal"
                }
            ],
            createToolBarItems: function () {
                return [];
            }
        };
        var modelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", initParams);

        // 嵌到一层panel的原因，按钮放window上很不好看
        var panel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel',{
            layout: 'fit',
            itemId: 'testRelationAttributePanel',
            bbar: [{
                xtype: 'tbfill'
            },{
                xtype: 'button',
                text: '确定',
                handler: function (btn) {
                    var grid = btn.up("#testRelationAttributePanel").down("#testRelationAttributeGridpanel");
                    if (OrientExtUtil.GridHelper.getSelectedRecord(grid).length() == 0) {
                        item.setValue("");
                    } else {
                        var testRelationAttributeValue = Ext.Array.pluck(
                            Ext.Array.pluck(OrientExtUtil.GridHelper.getSelectedRecord(grid), 'raw'),
                            displayColumnValue + "_" + tableId).join(";");
                        item.setValue(testRelationAttributeValue);
                    }
                    btn.up('window').close();
                }
            }]
        });

        Ext.create('widget.window',{
            title: '选择' + item['columnDesc']['text'],
            width: 600,
            height: 400,
            layout: 'fit',
            modal: true,
            items: [panel]
        }).show();
    },

    /**
     * 默认设置控制字段是否可编辑，
     * @param formColumnDescs
     * @private
     */
    _controlColumnEditAble: function (formColumnDescs) {
        var me = this;

        Ext.each(formColumnDescs, function (formColumnDesc) {

            // 设置字段是否可以编辑
            var editAbleType = formColumnDesc.editAbleType;
            if (editAbleType) {
                // 由于试验类型是和节点绑定的，为了和节点保持一致所以设置为无法修改，编号的话类似同理
                if (formColumnDesc.sColumnName == "M_BH_" + formColumnDesc.modelId || formColumnDesc.sColumnName == "M_RW_TYPE_" + formColumnDesc.modelId
                    /*||(me.treeNode.raw.cj == 2 && formColumnDesc.sColumnName == "T_RW_INFO_" + OrientExtUtil.FunctionHelper.getSchemaId() + "_ID")*/) {
                    formColumnDesc.editAble = false;
                } else {
                    formColumnDesc.editAble = '2' != editAbleType ? true : false;
                }
            }
            else {
                formColumnDesc.editAble = true;
            }

            // 设置字段是否显示
            var hiddenType = "0";
            if (hiddenType) {
                formColumnDesc.hidden = "1" == hiddenType ? true : false;
            }
            else {
                formColumnDesc.hidden = false;
            }

            var columnName;
            var realColumnName;
            if (formColumnDesc.className == 'RelationColumnDesc') {
                realColumnName = formColumnDesc.sColumnName;
                columnName = realColumnName.substring(0, realColumnName.lastIndexOf('_')).substring(0, realColumnName.lastIndexOf('_'));
            }
            else {
                realColumnName = formColumnDesc.sColumnName;
                columnName = realColumnName.substring(0, realColumnName.lastIndexOf('_'));
            }

            // 这段应该是产品在前端处理限制修改的字段，但实际情况是disAbleModifyColumns是undefined
            if (me.modelDesc.disAbleModifyColumns && me.modelDesc.disAbleModifyColumns.length > 0) {
                formColumnDesc.editAble = !formColumnDesc.editAble || Ext.Array.contains(me.modelDesc.disAbleModifyColumns, columnName)
                || Ext.Array.contains(me.modelDesc.disAbleModifyColumns, realColumnName) ? false : true;
            }

            // 如果字段是不可编辑的，设置为非必要
            if (!formColumnDesc.editAble) {
                formColumnDesc.isRequired = false;
            }

            // 这段应该是产品在前端处理隐藏的字段，但实际情况是hiddenModifyColumns是undefined
            if (me.modelDesc.hiddenModifyColumns && me.modelDesc.hiddenModifyColumns.length > 0) {
                formColumnDesc.hidden = formColumnDesc.hidden || Ext.Array.contains(me.modelDesc.hiddenModifyColumns, columnName)
                || Ext.Array.contains(me.modelDesc.hiddenModifyColumns, realColumnName) ? true : false;
            }
        });
    },

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
                    var columnDesc = me.modelDesc.modifyColumnDesc;
                    for(var i=0; i<columnDesc.length; i++) {
                        var columns = me.modelDesc.columns;
                        for(var j=0; j<columns.length; j++) {
                            if(columnDesc[i] == columns[j].id) {
                                var field = me.down('[name=' + columns[j].sColumnName + ']');
                                if(field) {
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
