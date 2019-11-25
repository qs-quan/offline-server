/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.TableEnumColumnDesc', {
    extend: 'Ext.form.field.Display',
    alias: 'widget.TableEnumColumnDesc',
    alternateClassName: 'OrientExtend.TableEnumColumnDesc',
    mixins: {
        CommonField: "OrientTdm.Common.Extend.Form.Field.CommonField"
    },
    config: {
        columnDesc: null,
        isMulti: false
    },
    submitValue: true,
    statics: {
        deleteEnum: function (fileId, belongItemId) {
            var field = Ext.getCmp(belongItemId);
            if (field) {
                //获取原来的data
                var data = field.data;
                //移除选中的data
                var index = -1;
                Ext.each(data, function (fileDesc, loopIndex) {
                    if (fileDesc.id == fileId) {
                        index = loopIndex;
                        return false;
                    }
                });
                data.splice(index, 1);
                field.setValue(data);
            }
        },
        detailEnum: function (dataId, belongItemId) {
            var field = Ext.getCmp(belongItemId);
            var refModelId = field.columnDesc.bindModelId;
            field.mixins.CommonField.detailModelData.call(field, refModelId, dataId);
        },
        modifyEnum: function (belongItemId) {
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
                modal: true,
                items: [
                    {
                        xtype: 'tableEnumPanel',
                        modelId: field.columnDesc.bindModelId,
                        isMulti: field.isMulti,
                        selectedValue: selectedValue
                    }
                ],
                listeners: {
                    beforeclose: function () {
                        var selectedData = this.down("tableEnumPanel").getSelectedData();
                        if (selectedData == undefined || selectedData == []) return;
                        var data = [];
                        for (var i = 0; i < selectedData.length; i++) {
                            var dataId = selectedData[i].ID;
                            var name = selectedData[i][columnDesc.displayColumnDBName];
                            data.push({
                                id: dataId,
                                name: name
                            });
                        }
                        field.setValue(data);
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
        //公用属性初始化
        this.mixins.CommonField.initCommonAttr.call(this, me.columnDesc);
        //增加特殊属性
        me.data = [];
        var writeTplArray = [
            '<tpl for=".">',
            '<span class="tableEnum-span">',
            '<span fileId="{id}" name="enum">',
            '<a class="tableEnum" target="_blank" onclick="OrientExtend.TableEnumColumnDesc.detailEnum(\'{id}\',\'' + itemId + '\')" title="{name}">',
            '{name}',
            '</a>',
            '</span>',
            '<a href="javascript:;" onclick="OrientExtend.TableEnumColumnDesc.detailEnum(\'{id}\',\'' + itemId + '\');" title="详细" class="detail">',
            '</a>',
            '&nbsp;',
            '<a href="javascript:;" onclick="OrientExtend.TableEnumColumnDesc.deleteEnum(\'{id}\',\'' + itemId + '\');" class="cancel">',
            '</a>',
            '</span>',
            '</tpl>',
            '<a href="javascript:;" class="link selectTableEnum" onclick="OrientExtend.TableEnumColumnDesc.modifyEnum(\'' + itemId + '\');">选择</a>'
        ];
        var readTplArray = [
            '<tpl for=".">',
            '<span class="tableEnum-span">',
            '<span fileId="{id}" name="enum">',
            '<a class="tableEnum" target="_blank" onclick="OrientExtend.TableEnumColumnDesc.detailEnum(\'{id}\',\'' + itemId + '\')" title="{name}">',
            '{name}',
            '</a>',
            '</span>',
            '<a href="javascript:;" onclick="OrientExtend.TableEnumColumnDesc.detailEnum(\'{id}\',\'' + itemId + '\');" title="详细" class="detail">',
            '</a>',
            '</span>',
            '</tpl>'
        ];
        //采用模板方式加载数据
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
        if (this.mixins.CommonField.isJsonStr.call(this, value)) {
            value = Ext.decode(value);
        }
        var showValue = Ext.isArray(value) ? me.tpl.apply(value) : value;
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
        var me = this;
        var customerFilter = me.isMulti == false ? new CustomerFilter(this.columnDesc.sColumnName, CustomerFilter.prototype.SqlOperation.Equal, "", filterValue) : new CustomerFilter(this.columnDesc.sColumnName, CustomerFilter.prototype.SqlOperation.Contains, "", filterValue);
        return customerFilter;
    },
    customReadOnly: function () {
        //自定义只读组件形态

    }
});