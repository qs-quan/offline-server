/**
 * Created by Administrator on 2016/8/3 0003.
 */
Ext.define('OrientTdm.Example.ManualBuildExtForm', {
    extend: 'Ext.window.Window',
    requires: [
        'OrientTdm.BaseRequires'
    ],
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            autoScroll: true,
            autoShow: true,
            width: 800,
            height: 800,
            items: [
                {
                    xtype: 'form',
                    frame: false,
                    bodyPadding: 10,
                    bodyStyle: 'border-width:0 0 0 0; background:transparent',
                    defaults: {
                        anchor: '100%',
                        msgTarget: 'side'
                    },
                    defaultType: 'textfield',
                    items: [
                        {
                            xtype: 'fieldset',
                            border: '1 1 1 1',
                            collapsible: true,
                            title: '普通属性',
                            items: [
                                {
                                    xtype: 'SimpleColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "SimpleColumnDesc",
                                        controlType: 0,
                                        isMultiUnique: true,
                                        isRequired: false,
                                        isUnique: true,
                                        modelId: "226",
                                        sColumnName: "C_STRING_226",
                                        sModelName: "T_TEST_161",
                                        selector: null,
                                        text: "字符串",
                                        validRule: null
                                    }
                                },
                                {
                                    xtype: 'TextColumnDesc',
                                    columnDesc: {
                                    editAble: true,
                                    className: "TextColumnDesc",
                                    controlType: 13,
                                    isMultiUnique: false,
                                    isRequired: false,
                                    isUnique: false,
                                    modelId: "226",
                                    sColumnName: "C_TEXT_226",
                                    sModelName: "T_TEST_161",
                                    text: "大文本",
                                    validRule: null
                                }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            border: '1 1 1 1',
                            collapsible: true,
                            title: '时间属性',
                            items: [
                                {
                                    xtype: 'DateColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "DateColumnDesc",
                                        controlType: 6,
                                        dateFmt: "yyyy-MM-dd",
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        modelId: "226",
                                        sColumnName: "C_DATE_226",
                                        sModelName: "T_TEST_161",
                                        text: "日期",
                                        validRule: null
                                    }
                                },
                                {
                                    xtype: 'DateTimeColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "DateTimeColumnDesc",
                                        controlType: 7,
                                        dateFmt: "yyyy-MM-dd HH:mm:ss",
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        modelId: "226",
                                        sColumnName: "C_DATETIME_226",
                                        sModelName: "T_TEST_161",
                                        text: "时间",
                                        validRule: null
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            border: '1 1 1 1',
                            collapsible: true,
                            title: '数值属性',
                            items: [
                                {
                                    xtype: 'NumberColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "NumberColumnDesc",
                                        controlType: 1,
                                        isMultiUnique: true,
                                        isRequired: false,
                                        isUnique: false,
                                        maxColumnId: null,
                                        maxTableId: null,
                                        maxValue: null,
                                        minColumnId: null,
                                        minTableId: null,
                                        minValue: null,
                                        modelId: "226",
                                        numberLength: 100,
                                        numberPrecision: 0,
                                        sColumnName: "C_NUMBER_226",
                                        sModelName: "T_TEST_161",
                                        text: "数值",
                                        unit: null,
                                        validRule: null
                                    }
                                }, {
                                    xtype: 'NumberColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "NumberColumnDesc",
                                        controlType: 0,
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        maxColumnId: null,
                                        maxTableId: null,
                                        maxValue: 100,
                                        minColumnId: null,
                                        minTableId: null,
                                        minValue: 1,
                                        modelId: "226",
                                        numberLength: 100,
                                        numberPrecision: 0,
                                        sColumnName: "C_RANGE_226",
                                        sModelName: "T_TEST_161",
                                        text: "范围约束",
                                        unit: null,
                                        validRule: null
                                    }
                                },
                                {
                                    xtype: 'NumberColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "NumberColumnDesc",
                                        controlType: 0,
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        maxColumnId: "1227",
                                        maxTableId: "226",
                                        maxValue: null,
                                        minColumnId: "1226",
                                        minTableId: "226",
                                        minValue: null,
                                        modelId: "226",
                                        numberLength: 100,
                                        numberPrecision: 0,
                                        sColumnName: "C_D_RANGE_226",
                                        sModelName: "T_TEST_161",
                                        text: "动态范围约束",
                                        unit: null,
                                        validRule: null
                                    }
                                }, {
                                    xtype: 'NumberColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "NumberColumnDesc",
                                        controlType: 1,
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        maxColumnId: null,
                                        maxTableId: null,
                                        maxValue: null,
                                        minColumnId: null,
                                        minTableId: null,
                                        minValue: null,
                                        modelId: "226",
                                        numberLength: 100,
                                        numberPrecision: 0,
                                        sColumnName: "C_MAX_226",
                                        sModelName: "T_TEST_161",
                                        text: "最大值",
                                        unit: null,
                                        validRule: null
                                    }
                                },{
                                    xtype: 'NumberColumnDesc',
                                    columnDesc:{
                                        className: "NumberColumnDesc",
                                        controlType: 1,
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        maxColumnId: null,
                                        maxTableId: null,
                                        maxValue: null,
                                        minColumnId: null,
                                        minTableId: null,
                                        minValue: null,
                                        modelId: "240",
                                        numberLength: 100,
                                        numberPrecision: 0,
                                        sColumnName: "C_NUMBER_240",
                                        sModelName: "T_NUMBER_180",
                                        text: "带单位",
                                        unit: '{"baseUnitId":"2","selectorIds":["1","2","3","15"],"selectorNames":["Pa","KPa","MPa","atm"],"unitName":"pressure","unitShowName":"压强"}',
                                        validRule: null
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            border: '1 1 1 1',
                            collapsible: true,
                            title: '关系属性',
                            items: [
                                {
                                    xtype: 'RelationColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "RelationColumnDesc",
                                        controlType: 5,
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        modelId: "226",
                                        refModelId: "225",
                                        refModelName: "T_S_S_161",
                                        refModelShowColumn: "C_NAME_225",
                                        refType: "1",
                                        sColumnName: "T_S_S_161_ID",
                                        sModelName: "T_TEST_161",
                                        text: "一对一",
                                        validRule: null
                                    }
                                },
                                {
                                    xtype: 'RelationColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "RelationColumnDesc",
                                        controlType: 5,
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        modelId: "226",
                                        refModelId: "229",
                                        refModelName: "T_MUL_161",
                                        refModelShowColumn: "C_NAME_229",
                                        refType: "3",
                                        sColumnName: "T_MUL_161_ID",
                                        sModelName: "T_TEST_161",
                                        text: "多对一",
                                        validRule: null
                                    }
                                },
                                {
                                    xtype: 'RelationColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "RelationColumnDesc",
                                        controlType: 5,
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        modelId: "226",
                                        refModelId: "228",
                                        refModelName: "T_SINGLE_161",
                                        refModelShowColumn: "C_NAME_228",
                                        refType: "4",
                                        sColumnName: "T_SINGLE_161_ID",
                                        sModelName: "T_TEST_161",
                                        text: "多对多",
                                        validRule: null
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            border: '1 1 1 1',
                            collapsible: true,
                            title: '附件属性',
                            items: [
                                {
                                    xtype: 'FileColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "FileColumnDesc",
                                        controlType: 15,
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        modelId: "226",
                                        sColumnName: "C_ODS_226",
                                        sModelName: "T_TEST_161",
                                        text: "ods字段",
                                        validRule: null
                                    }
                                },
                                {
                                    xtype: 'FileColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "FileColumnDesc",
                                        controlType: 16,
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        modelId: "226",
                                        sColumnName: "C_HADOOP_226",
                                        sModelName: "T_TEST_161",
                                        text: "Hadoop字段",
                                        validRule: null
                                    }
                                },

                                {
                                    xtype: 'FileColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "FileColumnDesc",
                                        controlType: 14,
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        modelId: "226",
                                        sColumnName: "C_FILE_226",
                                        sModelName: "T_TEST_161",
                                        text: "附件",
                                        validRule: null
                                    }
                                }
                            ]
                        }, {
                            xtype: 'fieldset',
                            border: '1 1 1 1',
                            collapsible: true,
                            title: '枚举属性',
                            items: [
                                {
                                    xtype: 'SingleEnumColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "SingleEnumColumnDesc",
                                        controlType: 9,
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        modelId: "226",
                                        sColumnName: "C_ENUM_226",
                                        sModelName: "T_TEST_161",
                                        text: "单选枚举",
                                        validRule: null,
                                        aryOptions: {
                                            a: "a",
                                            b: "b",
                                            c: "c"
                                        }
                                    }
                                },

                                {
                                    xtype: 'SingleTableEnumColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        bindModelId: "227",
                                        className: "SingleTableEnumColumnDesc",
                                        controlType: 11,
                                        displayColumnDBName: "C_NAME_227",
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        modelId: "226",
                                        sColumnName: "C_T_ENUM_226",
                                        sModelName: "T_TEST_161",
                                        text: "表枚举",
                                        validRule: null,
                                        aryOptions: {}
                                    }
                                }
                            ]
                        }, {
                            xtype: 'fieldset',
                            border: '1 1 1 1',
                            collapsible: true,
                            title: '选择器属性',
                            items: [
                                {
                                    xtype: 'SimpleColumnDescForSelector',
                                    columnDesc: {
                                        isRequired: true,
                                        sColumnName: 'modelid',
                                        text: '选择模型',
                                        editAble: true,
                                        selector: "{'selectorType': '2','multiSelect': false,'selectorName': '选择模型'}"
                                    }
                                },
                                {
                                    xtype: 'SimpleColumnDescForSelector',
                                    columnDesc: {
                                        isRequired: true,
                                        sColumnName: 'userid',
                                        text: '选择用户',
                                        editAble: true,
                                        selector: "{'selectorType': '1','multiSelect': false,'selectorName': '选择用户'}"
                                    }
                                },
                                {
                                    xtype: 'SimpleColumnDescForSelector',
                                    columnDesc: {
                                        isRequired: true,
                                        sColumnName: 'depId',
                                        text: '选择部门',
                                        editAble: true,
                                        selector: "{'selectorType': '0','multiSelect': false,'selectorName': '选择部门'}"
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            border: '1 1 1 1',
                            collapsible: true,
                            title: '检查字段',
                            items: [
                                {
                                    xtype: 'CheckColumnDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "CheckColumnDesc",
                                        controlType: 17,
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        modelId: "226",
                                        sColumnName: "C_CHECK_226",
                                        sModelName: "T_TEST_161",
                                        text: "检查字段",
                                        validRule: null
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            border: '1 1 1 1',
                            collapsible: true,
                            title: '键值对',
                            items: [
                                {
                                    xtype: 'DynamicFormGridDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "DynamicFormGridDesc",
                                        controlType: 18,
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        modelId: "226",
                                        sColumnName: "C_KEYVALUE_226",
                                        sModelName: "T_TEST_161",
                                        text: "键值对",
                                        validRule: null
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            border: '1 1 1 1',
                            collapsible: true,
                            title: '键值对',
                            items: [
                                {
                                    xtype: 'DynamicFormGridDesc',
                                    columnDesc: {
                                        editAble: true,
                                        className: "DynamicFormGridDesc",
                                        controlType: 19,
                                        isMultiUnique: false,
                                        isRequired: false,
                                        isUnique: false,
                                        modelId: "226",
                                        sColumnName: "C_SUBTABLE_226",
                                        sModelName: "T_TEST_161",
                                        text: "子表",
                                        validRule: null
                                    }
                                }
                            ]
                        }
                    ],
                    buttons: [
                        {
                            text: '保存',
                            handler: function () {
                                var form = this.up('form');
                                var formValue = OrientExtUtil.FormHelper.generateFormData(form.getForm());
                                if (form.isValid()) {

                                }

                            }
                        }
                    ],
                    listeners: {
                        afterRender: function () {
                            var formValue = {
                                C_STRING_226: "121",
                                C_TEXT_226: "1212",

                                C_DATE_226: "2016-08-04",
                                C_DATETIME_226: "2016-08-04 09:47:20",

                                C_NUMBER_226: "121",
                                C_RANGE_226: "1",
                                C_D_RANGE_226: "3",
                                C_MAX_226: "121",
                                C_NUMBER_240: "1.0",
                                C_NUMBER_240_STANDVALUE: "1000",
                                C_NUMBER_240_unit: "3",

                                T_MUL_161_ID: '[{"name":"5555","id":"1"}]',
                                T_SINGLE_161_ID: '[{"name":"1","id":"1"}]',
                                T_S_S_161_ID: '[{"name":"666666666","id":"1"}]',


                                C_ODS_226: '[{"id":"1226","name":"secondarytile.png"}]',
                                C_HADOOP_226: '[{"id":"1227","name":"secondarytile.png"}]',
                                C_FILE_226: '[{"id":"1228","name":"secondarytile.png"}]',

                                C_ENUM_226: "a",
                                C_T_ENUM_226: '[{"name":"1111","id":"1"}]',

                                depId: "142",
                                depId_display: "CAE研发部",
                                modelid: "240",
                                modelid_display: "数值测试",
                                userid: "180",
                                userid_display: "潘端端",


                                C_CHECK_226: '[{"labelName":"\u68c0\u67e5\u9879","inputValue":true},{"labelName":"aa","inputValue":"bbb"}]',
                                C_KEYVALUE_226: '[{"key":"1","value":"2"}]',
                                C_SUBTABLE_226: '[{"a":"a","b":"b","c":"c","d":"d"}]'

                            };
                            this.getForm().setValues(formValue);
                        }
                    }
                }
            ]

        });
        this.callParent(arguments);
    }
});