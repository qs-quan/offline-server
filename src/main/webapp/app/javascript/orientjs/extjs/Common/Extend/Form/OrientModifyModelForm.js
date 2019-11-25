/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.OrientModifyModelForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alternateClassName: 'OrientExtend.OrientModifyModelForm',
    alias: 'widget.orientModifyModelForm',
    config: {
        beforeInitForm: Ext.emptyFn,
        afterInitForm: Ext.emptyFn,
        rowNum: 2,//默认两列
        modelDesc: null,//模型描述
        formgridcollapsed: true//默認是否收起动态表格
    },
    initComponent: function () {
        var me = this;
        if (Ext.isEmpty(me.modelDesc)) {
            throw("未传入模型定义");
        }
        //初始化前处理
        me.beforeInitForm.call(me);
        //获取新增描述
        var columnDescs = me.modelDesc.columns;
        var modifyColumnDesc = me.modelDesc.modifyColumnDesc;
        var formColumnDescs = [];
        Ext.each(columnDescs, function (column) {
            if (Ext.Array.contains(modifyColumnDesc, column.id)) {
                formColumnDescs[Ext.Array.indexOf(modifyColumnDesc, column.id)] = Ext.clone(column);
            }
        });
        me._convertToUpdateColumn(formColumnDescs);
        //保存至当前作用域
        me.columnDescs = formColumnDescs;
        //构建 增加默认ID属性
        var items = [{
            xtype: 'hiddenfield',
            name: 'ID'
        }];
        var lastFieldContainer = null;
        var loopIndex = 0;
        var gridColumns = [];
        //默认设置控制字段是否可编辑
        me._controlColumnEditAble(formColumnDescs);
        Ext.each(formColumnDescs, function (column, index) {
            if(column.hidden && loopIndex%me.rowNum==0) {
                loopIndex--;
            }
            if (column.controlType < 17) {
                var columnItem = {
                    xtype: column.className,
                    margin: '0 5 0 5',
                    columnDesc: column,
                    editAble: !column.editAble,
                    hidden: column.hidden
                };
                if (loopIndex % me.rowNum == 0) {
                    lastFieldContainer = {
                        xtype: "fieldcontainer",
                        layout: 'hbox',
                        combineErrors: true,
                        defaults: {
                            flex: 1,
                            labelAlign: 'right'
                        },
                        items: []
                    };
                    items.push(lastFieldContainer);
                }
                loopIndex++;
                lastFieldContainer.items.push(columnItem);
            } else {
                gridColumns.push(column);
            }
        });
        var defaultFiledSet = Ext.create("Ext.form.FieldSet", {
            collapsible: true,
            title: "默认分组",
            items: items
        });
        var gridItems = OrientExtUtil.FormHelper.createGridByColumns(gridColumns, me.formgridcollapsed);
        var finalItems = Ext.Array.merge([defaultFiledSet], gridItems);
        Ext.apply(me, {
            items: finalItems
        });

        me.callParent(arguments);
        //初始化后处理
        me.afterInitForm.call(me);
    },
    /**
     * 如果普通字段存在选择器，则从前端转化为选择器字段
     * @param columnDescs
     * @private
     */
    _convertToUpdateColumn: function (columnDescs) {
        Ext.each(columnDescs, function (column) {
            if (column.className == "SimpleColumnDesc" && !Ext.isEmpty(column.selector)) {
                column.className = column.className + "ForSelector";
            }
        });
    },
    _controlColumnEditAble: function (formColumnDescs) {
        var me = this;
        Ext.each(formColumnDescs, function (formColumnDesc) {
            var editAbleType = formColumnDesc.editAbleType;
            if (editAbleType) {
                formColumnDesc.editAble = '2' != editAbleType ? true : false;
            }
            else {
                formColumnDesc.editAble = true;
            }

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

            if (me.modelDesc.disAbleModifyColumns && me.modelDesc.disAbleModifyColumns.length > 0) {
                formColumnDesc.editAble = !formColumnDesc.editAble || Ext.Array.contains(me.modelDesc.disAbleModifyColumns, columnName)
                    || Ext.Array.contains(me.modelDesc.disAbleModifyColumns, realColumnName) ? false : true;
            }
            if (!formColumnDesc.editAble) {
                formColumnDesc.isRequired = false;
            }

            if (me.modelDesc.hiddenModifyColumns && me.modelDesc.hiddenModifyColumns.length > 0) {
                formColumnDesc.hidden = formColumnDesc.hidden || Ext.Array.contains(me.modelDesc.hiddenModifyColumns, columnName)
                    || Ext.Array.contains(me.modelDesc.hiddenModifyColumns, realColumnName) ? true : false;
            }
        });
    },
    /**
     * 重写自定义校验
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
        return retVal;
    },
    getOriginalValue: function (columnName) {
        var originalValue = "";
        var me = this;
        if (me.originalData) {
            if (me.originalData instanceof Ext.data.Model) {
                originalValue = me.originalData.raw[columnName];
            }
            else {
                originalValue = me.originalData[columnName];
            }
        }
        return originalValue;
    }
});