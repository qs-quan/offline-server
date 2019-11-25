/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.RelationColumnDescForDisplay', {
    extend: 'Ext.form.field.Display',
    alias: 'widget.RelationColumnDescForDisplay',
    alternateClassName: 'OrientExtend.RelationColumnDescForDisplay',
    mixins: {
        CommonField: "OrientTdm.Common.Extend.Form.Field.CommonField"
    },
    config: {
        columnDesc: null,
        defaultFilter: []
    },
    submitValue: true,
    statics: {
        deleteRelation: function (dataId, belongItemId) {
            var field = Ext.getCmp(belongItemId);
            if (field) {
                //获取原来的data
                var data = field.data;
                //移除选中的data
                var index = -1;
                Ext.each(data, function (fileDesc, loopIndex) {
                    if (fileDesc.id == dataId) {
                        index = loopIndex;
                        return false;
                    }
                });
                data.splice(index, 1);
                field.setValue(data);
            }
        },
        detailRelation: function (dataId, belongItemId) {
            var field = Ext.getCmp(belongItemId);
            var refModelId = field.columnDesc.refModelId;
            field.mixins.CommonField.detailModelData.call(field, refModelId, dataId);
        },
        detailManyToManyRelation: function (belongItemId) {
            var field = Ext.getCmp(belongItemId);
            var data = field.data;
            if (data.length == 0) {
                OrientExtUtil.Common.err(OrientLocal.prompt.info, '暂无数据');
            } else {
                var refModelId = field.columnDesc.refModelId;
                field.mixins.CommonField.detailManytoManyModelData.call(field, refModelId, data);
            }
        },
        modifyRelation: function (belongItemId) {
            var field = Ext.getCmp(belongItemId);
            //获取当前已经选中的值
            var selectedValue = [];
            Ext.each(field.data, function (relationDesc) {
                selectedValue.push(relationDesc.id);
            });
            //获取字段描述
            var columnDesc = field.columnDesc;
            //打开选择窗口
            new Ext.Window({
                width: 0.8 * globalWidth,
                title: '选择模型数据',
                height: 0.8 * globalHeight,
                layout: 'fit',
                items: [
                    {
                        xtype: 'relationPanel',
                        sModelName: columnDesc.sModelName,
                        refModelID: columnDesc.refModelId,
                        refModelName: columnDesc.refModelName,
                        refType: columnDesc.refType,
                        defaultFilter: field.defaultFilter,
                        selectedValue: selectedValue
                    }
                ],
                listeners: {
                    beforeclose: function () {
                        var selectedData = this.down("relationPanel").getSelectedData();
                        if (selectedData == undefined || selectedData == []) return;
                        var data = [];
                        for (var i = 0; i < selectedData.length; i++) {
                            var dataId = selectedData[i].ID;
                            var name = selectedData[i][columnDesc.refModelShowColumn];
                            data.push({
                                id: dataId,
                                name: name
                            });
                        }
                        field.setValue(data);
                        var submitData = field.getSubmitValue();
                        field.up('RelationColumnDesc').fireEvent('setHiddenData', submitData);
                        field.validate();
                    }
                },
                buttons: [{
                    text: '保存',
                    handler: function () {
                        this.up("window").close();
                    }
                }]
            }).show();
        }
    },
    initComponent: function () {
        var me = this;
        var itemId = me.getId();
        if (Ext.isEmpty(me.columnDesc)) {
            throw("未绑定字段描述");
        }
        var hiddenData = Ext.create('Ext.form.field.Hidden');
        this.mixins.CommonField.initCommonAttr.call(hiddenData, me.columnDesc);

        //公用属性初始化
        this.mixins.CommonField.initCommonAttr.call(this, me.columnDesc);
        me.name = me.columnDesc.sColumnName + '_display';
        //增加特殊属性
        me.data = [];
        //采用模板方式加载数据
        me.template = {
            manyToManyWriteTplArray: [
                '<span class="relation-span">',
                '<a href="javascript:;" onclick="OrientExtend.RelationColumnDescForDisplay.detailManyToManyRelation(\'' + itemId + '\');" title="详细" class="link detail">',
                '详细',
                '</a>',
                '</span>',
                '<a href="javascript:;" class="link selectRelation" onclick="OrientExtend.RelationColumnDescForDisplay.modifyRelation(\'' + itemId + '\');">选择</a>'
            ],
            manyToManyReadTplArray: [
                '<span class="relation-span">',
                '<a href="javascript:;" onclick="OrientExtend.RelationColumnDescForDisplay.detailManyToManyRelation(\'' + itemId + '\');" title="详细" class="link detail">',
                '详细',
                '</a>',
                '</span>'
            ],
            normalWriteTplArray: [
                '<tpl for=".">',
                '<span class="relation-span">',
                '<span fileId="{id}" name="relation">',
                '<a class="relation" target="_blank" onclick="OrientExtend.RelationColumnDescForDisplay.detailRelation(\'{id}\',\'' + itemId + '\')" title="{name}">',
                '{name}',
                '</a>',
                '</span>',
                '<a href="javascript:;" onclick="OrientExtend.RelationColumnDescForDisplay.detailRelation(\'{id}\',\'' + itemId + '\');" title="详细" class="detail">',
                '<a href="javascript:;" onclick="OrientExtend.RelationColumnDescForDisplay.deleteRelation(\'{id}\',\'' + itemId + '\');" class="cancel">',
                '</a>',
                '</span>',
                '</tpl>',
                '<a href="javascript:;" class="link selectRelation" onclick="OrientExtend.RelationColumnDescForDisplay.modifyRelation(\'' + itemId + '\');">选择</a>'
            ],
            normalReadTplArray: [
                '<tpl for=".">',
                '<span class="relation-span">',
                '<span fileId="{id}" name="relation">',
                '<a class="relation" target="_blank" onclick="OrientExtend.RelationColumnDescForDisplay.detailRelation(\'{id}\',\'' + itemId + '\')" title="{name}">',
                '{name}',
                '</a>',
                '</span>',
                '<a href="javascript:;" onclick="OrientExtend.RelationColumnDescForDisplay.detailRelation(\'{id}\',\'' + itemId + '\');" title="详细" class="detail">',
                '</a>',
                '</span>',
                '</tpl>'
            ]
        };
        var writeTplArray = me.columnDesc.refType == 4 ? me.template.manyToManyWriteTplArray : me.template.normalWriteTplArray;
        var readTplArray = me.columnDesc.refType == 4 ? me.template.manyToManyReadTplArray : me.template.normalReadTplArray;
        //TODO 采用不同CSS区分关系属性
        me.tpl = new Ext.XTemplate(
            me.columnDesc.editAble != false ? writeTplArray : readTplArray
        );
        var value = me.tpl.apply(me.data);
        Ext.apply(me, {
            value: value
        });
        me.callParent(arguments);
    },
    //重载设置值 增加传入文件描述json的支持
    setValue: function (value) {
        var me = this;
        value = value || "[]";
        if (this.mixins.CommonField.isJsonStr.call(this, value)) {
            value = Ext.decode(value);
        }
        var showValue = Ext.isArray(value) ? me.tpl.apply(value) : value;
        showValue = Ext.isEmpty(showValue) ? '[未选择]' : showValue;
        me.data = Ext.isArray(value) ? value : [];
        me.setRawValue(me.valueToRaw(showValue));
        return me.mixins.field.setValue.call(me, showValue);
    },
    //重载提交数据
    getSubmitValue: function () {
        var me = this;
        //采用逗号分隔
        var retVal = [];
        Ext.each(me.data, function (relationDesc) {
            retVal.push(relationDesc.id);
        });
        return retVal.join(",");
    },
    validate: function () {
        var me = this;
        if (me.data.length == 0 && me.allowBlank == false) {
            me.markInvalid("此项为必填项!");
            return false;
        } else {
            me.clearInvalid();
            return true;
        }
    },
    createCustomerFilter: function (filterValue) {
        if (Ext.isEmpty(filterValue)) {
            return null;
        }
        var customerFilter = new CustomerFilter(this.columnDesc.sColumnName, CustomerFilter.prototype.SqlOperation.BetweenAnd, "", filterValue);
        return customerFilter;
    }
});