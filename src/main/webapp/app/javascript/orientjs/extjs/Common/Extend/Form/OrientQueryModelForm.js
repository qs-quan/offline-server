/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.OrientQueryModelForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alternateClassName: 'OrientExtend.QueryModelForm',
    alias: 'widget.OrientQueryModelForm',
    config: {
        beforeInitForm: Ext.emptyFn,
        afterInitForm: Ext.emptyFn,
        rowNum: 2,//默认两列
        modelDesc: null//模型描述
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
        var queryColumnIds = me.modelDesc.queryColumnDesc;
        var formColumnDescs = [];
        Ext.each(columnDescs, function (column) {
            if (Ext.Array.contains(queryColumnIds, column.id)) {
                formColumnDescs[Ext.Array.indexOf(queryColumnIds, column.id)] = Ext.clone(column);
            }
        });
        me.convertToSearchColumn(formColumnDescs);
        //保存至当前作用域
        me.columnDesc = formColumnDescs;
        //构建
        var items = [];
        var lastFieldContainer = null;
        Ext.each(formColumnDescs, function (column, index) {
            column.defaultValue = null;
            //查询面板不需要默认值
            column.editAble = true;
            var columnItem = {
                xtype: column.className,
                margin: '0 5 0 5',
                columnDesc: column
            };
            if (index % me.rowNum == 0) {
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
            lastFieldContainer.items.push(columnItem);
        });
        Ext.apply(me, {
            items: items
        });
        me.callParent(arguments);
        //初始化后处理
        me.afterInitForm.call(me);
        me.addEvents("doQuery");
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'doQuery', me.doQuery, me);
    },
    /**
     * 文件类型转化为普通输入框
     * 数值类型转化为范围输入
     * 日期类型转化为范围输入
     * 关系属性统一修改为多对多
     * @param columnDesc
     */
    convertToSearchColumn: function (columnDesc) {
        Ext.each(columnDesc, function (column) {
            if (column.className == "DateColumnDesc" || column.className == "FileColumnDesc" || column.className == "DateTimeColumnDesc" || column.className == "NumberColumnDesc") {
                column.className = column.className + "ForSearch";
            } else if (column.controlType >= 17) {
                //表格类型
                column.className = "FormGridForSearch";
            }
            if (column.className == "RelationColumnDesc") {
                column.refType = "4";
            }
            if (column.className == "SimpleColumnDesc" && !Ext.isEmpty(column.selector)) {
                column.className = column.className + "ForSelector";
            }
            //去除非空校验
            column.isRequired = false;
        });
    },
    doQuery: function (successCallBack, modelGridPanel) {
        var me = this;
        //获取表单数据
        var form = this.getForm();
        var formValue = OrientExtUtil.FormHelper.generateFormData(form);
        var customerFilterArr = [];
        Ext.each(me.columnDesc, function (column) {
            var sColumnName = column.sColumnName;
            var columnValue = "";
            if (column.className == "DateColumnDescForSearch" || column.className == "DateTimeColumnDescForSearch" || column.className == "NumberColumnDescForSearch") {
                //区间值
                columnValue = formValue[sColumnName + "_START"] + "<!=!>" + formValue[sColumnName + "_END"];
            } else
                columnValue = formValue[sColumnName];
            if (!Ext.isEmpty(columnValue)) {
                var columnField = me.down(column.className + "[name=" + column.sColumnName + "]");
                var customerFilter = columnField.createCustomerFilter(columnValue);
                if (null != customerFilter) {
                    customerFilterArr.push(customerFilter);
                }
            }
        });
        modelGridPanel.setQueryFilter(customerFilterArr);
        //拼装CustomerFilter
        if (successCallBack) {
            successCallBack.call(me);
        }
    }
});