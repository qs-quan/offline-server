/**
 * Created by enjoy on 2016/4/19 0019.
 * 自定义field 辅助类
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.CommonField', {
    extend: 'Ext.Base',
    alias: 'widget.CommonField',
    initCommonAttr: function (columnDesc) {
        var me = this;
        //初始化通用属性
        Ext.apply(me, {
            fieldLabel: columnDesc.text,
            labelAlign: 'right',
            anchor: '100%',
            name: columnDesc.sColumnName,
            columnId: columnDesc.id,
            modelId: columnDesc.modelId,
            validateOnChange: false,
            validateOnBlur: false
        });
        //是否必填
        if (columnDesc.isRequired == true && columnDesc.editAble == true) {
            Ext.apply(me, {
                allowBlank: false,
                afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="必填项">*</span>'
            });
        }
        //正则表达式校验
        if (!Ext.isEmpty(columnDesc.validRule)) {
            Ext.apply(me, {
                regexText: columnDesc.validRule
            });
        }
        //最大长度
        if (!Ext.isEmpty(columnDesc.charLen)) {
            Ext.apply(me, {
                maxLength: columnDesc.charLen
            });
        }
        //是否可编辑
        if (columnDesc.editAble == false) {
            Ext.apply(me, {
                readOnly: true
            });
            if (me.customReadOnly) {
                me.customReadOnly.call(me);
            } else {
                Ext.apply(me, {
                    fieldBodyCls: "x-item-disabled"
                });
            }
        }
        //是否唯一
        if (columnDesc.isUnique == true) {
            Ext.apply(me, {
                vtype: 'modelDataUnique'
            });
        }

        //是否唯一
        if (columnDesc.isSysUnique == true) {
            Ext.apply(me, {
                vtype: 'unique'
            });
        }

        //确省值
        if (!Ext.isEmpty(columnDesc.defaultValue)) {
            Ext.apply(me, {
                value: columnDesc.defaultValue
            });
        }
    },
    isJsonStr: function (str) {
        var isJson = false;
        if (str && typeof(str) == 'string') {
            try {
                Ext.decode(str);
                isJson = true;
            } catch (err) {

            }
        }
        return isJson;
    },
    detailModelData: function (refModelId, refDataId) {
        var me = this;
        //查看默认的详细信息
        var params = {
            modelId: refModelId,
            dataId: refDataId
        };
        //查看模型数据详细信息
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelData/getGridModelDescAndData.rdm", params, false, function (response) {
            //1.获取模型字段描述 字段名称 显示名 类型...
            //2.获取模型操作描述 新增/修改/删除/查询/导入/导出...
            var modelDesc = response.decodedData.results.orientModelDesc;
            var modelData = response.decodedData.results.modelData;
            var detailForm = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
                    title: '查看【<span style="color: red; ">' + modelDesc.text + '</span>】数据',
                    buttonAlign: 'center',
                    buttons: [
                        {
                            itemId: 'back',
                            text: '关闭',
                            scope: me,
                            handler: function () {
                                detailWin.close();
                            }
                        }
                    ],
                    successCallback: me.successCallBack,
                    bindModelName: modelDesc.dbName,
                    modelDesc: modelDesc,
                    originalData: modelData
                })
                ;
            var detailWin = new Ext.Window({
                width: 0.8 * globalWidth,
                height: 0.8 * globalHeight,
                layout: 'fit',
                items: [
                    detailForm
                ]
            });
            detailWin.show();
        });
    },
    detailManytoManyModelData: function (refModelId, refData) {
        var me = this;
        //查看默认的详细信息
        var item = Ext.create('OrientTdm.Common.Extend.Form.Common.ManyToManyModelDataDetailPanel', {
            data: Ext.decode(Ext.encode(refData)),
            modelId: refModelId
        });
        var detailWin = new Ext.Window({
            width: 0.8 * globalWidth,
            height: 0.8 * globalHeight,
            layout: 'fit',
            items: [
                item
            ],
            title: '关联数据详细信息'
        });
        detailWin.show();
    },
    showHeadModifyWin: function (headData) {
        var me = this;
        var columns = [
            {
                header: "列头名称",
                flex: 1,
                dataIndex: "name",
                editor: {
                    xtype: 'textfield'
                }
            }
        ];
        var store = Ext.create("Ext.data.Store", {
            fields: ['name'],
            data: headData
        });
        var cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2
        });
        var toolBarItems = [
            {
                iconCls: 'icon-create',
                text: '新增',
                itemId: 'create',
                handler: function () {
                    var grid = this.up("window").down("grid");
                    var store = grid.getStore();
                    var rec = {
                        name: '新增列头'
                    };
                    store.insert(store.getCount(), rec);
                }
            },
            {
                iconCls: 'icon-delete',
                text: '删除',
                itemId: 'delete',
                handler: function () {
                    var grid = this.up("window").down("grid");
                    var store = grid.getStore();
                    store.remove(OrientExtUtil.GridHelper.getSelectedRecord(grid));
                }
            },
            {
                iconCls: 'icon-up',
                text: '上移',
                itemId: 'up',
                handler: function () {
                    var grid = this.up("window").down("grid");
                    var store = grid.getStore();
                    var selectedRecords = grid.getSelectionModel().getSelection();
                    if (selectedRecords.length == 0) {
                        OrientExtUtil.Common.tip(OrientLocal.prompt.info, "请至少选择一条已选字段记录");
                    } else {
                        var index = store.indexOf(selectedRecords[0]);
                        if (index != 0) {
                            store.remove(selectedRecords);
                            store.insert(index - 1, selectedRecords);
                            grid.getSelectionModel().select(selectedRecords);
                        } else {
                            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.alreadyTop);
                        }
                    }
                }
            },
            {
                iconCls: 'icon-down',
                text: '下移',
                itemId: 'down',
                handler: function () {
                    var grid = this.up("window").down("grid");
                    var store = grid.getStore();
                    var selectedRecords = grid.getSelectionModel().getSelection();
                    if (selectedRecords.length == 0) {
                        OrientExtUtil.Common.tip(OrientLocal.prompt.info, "请至少选择一条已选字段记录");
                    } else {
                        var index = store.indexOf(selectedRecords[selectedRecords.length - 1]);
                        if (index != store.getCount() - 1) {
                            store.remove(selectedRecords);
                            store.insert(index + 1, selectedRecords);
                            grid.getSelectionModel().select(selectedRecords);
                        } else {
                            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.alreadyBottom);
                        }
                    }
                }
            },
            {
                iconCls: 'icon-save',
                text: '保存',
                itemId: 'save',
                handler: function () {
                    var grid = this.up("window").down("grid");
                    //判断是否有有重复的列
                    var store = grid.getStore();
                    var headArray = [];
                    var containsRepeat = false;
                    store.each(function (record) {
                        var headName = record.get("name");
                        if (!Ext.Array.contains(headArray, headName)) {
                            headArray.push(headName);
                        } else {
                            containsRepeat = true;
                        }
                    });
                    if (containsRepeat === true) {
                        OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.containsRepeatHead);
                    } else {
                        //重新整理数据
                        me._reconfigGridByHead(headArray);
                        var belongWin = this.up("window");
                        belongWin.close();
                    }
                }
            },
            {
                iconCls: 'icon-close',
                text: '关闭',
                itemId: 'close',
                handler: function () {
                    var belongWin = this.up("window");
                    belongWin.close();
                }
            }
        ];
        var toolBar = Ext.create('Ext.toolbar.Toolbar', {
            items: toolBarItems
        });
        var headModifyGrid = Ext.create("Ext.grid.Panel", {
            columns: columns,
            plugins: [cellEditing],
            store: store,
            bbar: Ext.create('Ext.ux.statusbar.StatusBar', {
                text: '双击单元格即可编辑列头名称',
                iconCls: 'x-status-error'
            }),
            cellEditing: cellEditing,
            selModel: {
                mode: 'MULTI'
            },
            selType: "checkboxmodel"
        });
        var win = Ext.create('Ext.Window', {
            plain: true,
            height: 350,
            width: 400,
            layout: 'fit',
            maximizable: false,
            title: '列头设置',
            modal: true,
            items: [
                headModifyGrid
            ],
            dockedItems: [toolBar]
        });
        win.show();
    }
});