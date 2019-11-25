/**
 * Created by dailin on 2019/8/8 14:02.
 */

Ext.define('OrientTdm.TestInfo.ExperimentTypeMgr.Form.ExperimentAddForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientAddModelForm',
    alias: 'widget.experimentAddForm',

    initComponent: function () {
        var me = this;
        me.modelDesc = me.createModelDesc();
        me.bindModelName = me.modelDesc.dbName;
        me.actionUrl = serviceName + '/modelData/saveModelData.rdm';
        me.buttons = me.createButtons();
        me.callParent(arguments);
        // 设置所属试验类型
        me._rwInfo_initFormData();
    },

    /**
     * 获取表单结构
     * @returns {*}
     */
    createModelDesc: function() {
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
            // 被动新增
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ExperimentController/insertTreeNodeByDataInfo.rdm',{
                dataId: dataId,
                pid: me.pid,
                modelName: me.modelName,
                text: OrientExtUtil.ModelHelper.getDisplayDataByModelId(me.modelId, OrientExtUtil.FormHelper.getModelData(me))
            }, false, function (resp) {
                if (resp.decodedData.success) {
                    me.up('window').fireEvent('refresh');
                    me.up('window').close();
                }
            })
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
        },{
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

    _rwInfo_initFormData: function () {
        var me = this;
        var fieldsItems = me.getForm().getFields().items;
        var handleField = ['',''];
        Ext.each(fieldsItems, function (item) {
            switch (item.name) {
                case 'T_SYLX_' + OrientExtUtil.FunctionHelper.getExperimentSchemaId() + '_ID': {
                    handleField[0] = item;
                    break;
                }
                case 'T_SYLX_' + OrientExtUtil.FunctionHelper.getExperimentSchemaId() + '_ID_display': {
                    handleField[1] = item;
                    break;
                }
            }
        });

        handleField[1].setValue(new Ext.XTemplate(handleField[1]['template']['normalReadTplArray']).apply({
            'name':me.testTypeName,
            'id': me.testTypeId == '-1' ? '':me.testTypeId
        }));
        if (me.testTypeId != '-1') {
            handleField[0].setValue(me.testTypeId == '-1' ? '':me.testTypeId);
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
        if (retVal == false) {
            return retVal;
        }
        // 判断是否存在
        if (me.modelId == OrientExtUtil.ModelHelper.getModelId('T_RW_INFO', OrientExtUtil.FunctionHelper.getExperimentSchemaId(), false)
            ||  me.modelId == OrientExtUtil.ModelHelper.getModelId('T_SYLX', OrientExtUtil.FunctionHelper.getExperimentSchemaId(), false)) {
            var text = OrientExtUtil.ModelHelper.getDisplayDataByModelId(modelId, formData);
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ExperimentController/checkNodeNameValidate.rdm', {
                pid: me.pid,
                text: text
            }, false, function (response) {
                if (!response.decodedData.results) {
                    retVal = false;
                    var field = me.modelName == "T_RW_INFO" ? me.down('[name=M_BH_' + modelId + ']') : me.down('[name=M_MC_' + modelId + ']');
                    if (field.markInvalid) {
                        field.markInvalid('同级下该名称已存在！');
                    }
                }
            });
        }

        return retVal;
    }
});
