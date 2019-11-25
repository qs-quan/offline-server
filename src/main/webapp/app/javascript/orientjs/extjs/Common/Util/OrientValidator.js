/**
 * Created by enjoy on 2016/3/17 0017.
 * 自定义字段校验器
 */

Ext.apply(Ext.form.field.VTypes, {
    //系统表唯一校验
    unique: function (val, field) {
        var retVal = false;
        var belongForm = field.findParentByType('form');
        var columnName = field.getName();
        var modelName = belongForm.bindModelName;
        var originalValue = "";
        if (belongForm.originalData) {
            if (belongForm.originalData instanceof Ext.data.Model) {
                originalValue = belongForm.originalData.get(columnName)
            }
            else {
                originalValue = belongForm.originalData[columnName];
            }
        }
        if (val != originalValue) {
            if (Ext.isEmpty(modelName)) {
                this.uniqueText = "bindModelName属性未定义";
            } else if (Ext.isEmpty(columnName)) {
                this.uniqueText = "name属性未定义";
            } else {
                if (field.columnName) {
                    columnName = field.columnName;
                }
                //Ajax验证
                Ext.Ajax.request({
                    url: serviceName + '/orientValidator/unique.rdm',
                    async: false,
                    params: {
                        columnName: columnName,
                        modelName: modelName,
                        toValidateValue: val
                    },
                    success: function (response) {
                        retVal = response.decodedData.success;
                    }
                });
            }
        } else
            retVal = true;
        return retVal;
    },
    uniqueText: '数据库中已经存在，请重新输入',
    //时间范围校验
    daterange: function (val, field) {
        var date = field.parseDate(val);
        if (!date) {
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = field.up('form').down('#' + field.startDateField);
            start.setMaxValue(date);
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = field.up('form').down('#' + field.endDateField);
            end.setMinValue(date);
            this.dateRangeMin = date;
        }
        return true;
    },
    daterangeText: '开始时间必须比结束时间早',
    //模型数值类型字段校验
    orientNumberValidate: function (val, field) {
        var me = this;
        var retVal = true;
        //整数格式校验
        if(field.columnDesc) {
            var columnDesc = field.columnDesc;
            if(columnDesc.type=="C_Integer" || columnDesc.type=="C_BigInteger") {
                if(!val || /^\-?\d+$/.test(val)) {
                    return true;
                }
                else {
                    me.orientNumberValidateText = '请输入有效整数';
                    return false;
                }
            }
            else {
                if(!val || /^\-?\d+(\.\d+)?$/.test(val)) {
                    return true;
                }
                else {
                    me.orientNumberValidateText = '请输入有效数字';
                    return false;
                }
            }
        }

        var dynamicRangeRestriction = field.dynamicRangeRestriction;
        //如果存在动态约束
        if (dynamicRangeRestriction == true) {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getDynamicRangeData.rdm', {
                columnId: field.columnId,
                modelId: field.modelId
            }, false, function (response) {
                var range = response.decodedData.results;
                if (!Ext.isEmpty(range.maxdata)) {
                    retVal = Number(val) <= Number(range.maxdata);
                    if (retVal === false) {
                        me.orientNumberValidateText = '该项值不得大于' + range.maxdata;
                    }
                }
                if (retVal && !Ext.isEmpty(range.mindata)) {
                    retVal = Number(val) >= Number(range.mindata);
                    if (retVal === false) {
                        me.orientNumberValidateText = '该项值不得小于' + range.mindata;
                    }
                }
            });
        }
        return retVal;
    },
    orientNumberValidateText: '数值范围有误',
    //唯一校验
    modelDataUnique: function (val, field) {
        var originalValue = "";
        var columnName = field.name;
        var belongForm = field.findParentByType('form');
        if (belongForm.originalData) {
            if (belongForm.originalData instanceof Ext.data.Model) {
                originalValue = belongForm.originalData.raw[columnName];
            }
            else {
                originalValue = belongForm.originalData[columnName];
            }
        }
        var retVal = true;
        if (Ext.isEmpty(val) || val == originalValue) {
            return retVal;
        } else {
            //后台校验
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/validateUnique.rdm', {
                columnId: field.columnId,
                modelId: field.modelId,
                columnValue: val
            }, false, function (response) {
                retVal = response.decodedData.results;
            });
        }
        return retVal;
    },
    modelDataUniqueText: '数据库中已经存在该数据，请重新输入'
});

