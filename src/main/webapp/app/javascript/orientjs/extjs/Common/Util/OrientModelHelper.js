/**
 * Created by enjoy on 2016/4/1 0001.
 * 模型辅助类 提供模型相关静态方法及属性
 */

Ext.define("OrientTdm.Common.Util.OrientModelHelper", {
    extend: 'Ext.Base',
    alternateClassName: 'OrientModelHelper',
    requires: [
        'OrientTdm.Common.Extend.Form.Field.CheckColumnDesc',
        'OrientTdm.Common.Extend.Form.Field.DynamicFormGridDesc'
    ],
    statics: {
        createGridColumn: function (columnDesc) {
            var className = columnDesc.className;
            //增加默认属性
            var retVal = {
                header: columnDesc.text,
                // 定制该字段点击列头是否可排序
                sortable: columnDesc.sortable == undefined ? true : columnDesc.sortable,
                flex: 1,
                minWidth: 100,
                dataIndex: columnDesc.sColumnName,
                renderer: function (value, meta, record) {
                    value = value || '';
                    meta.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            };

            // 自定义 olumn 渲染
            if(columnDesc.renderer != undefined){
                retVal.renderer = columnDesc.renderer;
            }

            // columns 可编辑
            if(columnDesc.editor != undefined){
                retVal.editor = columnDesc.editor;
            }
            if ("SimpleColumnDesc" == className) {
                var selector = columnDesc.selector;
                if (!Ext.isEmpty(selector)) {
                    Ext.apply(retVal, {
                        renderer: function (value, column, record) {
                            var retVal = value;
                            if (!Ext.isEmpty(value)) {
                                var displayValue = record.raw[columnDesc.sColumnName + '_display'];
                                retVal = Ext.isEmpty(displayValue) ? retVal : displayValue;
                            }
                            return retVal;
                        }
                    });
                }
            } else if ("NumberColumnDesc" == className) {
                Ext.apply(retVal, {
                    xtype: 'numbercolumn',
                    renderer: function (value, column, record) {
                        var retVal = value;
                        if (!Ext.isEmpty(value)) {
                            var standValue = record.raw[columnDesc.sColumnName + '_STANDVALUE'];
                            retVal = Ext.isEmpty(standValue) ? retVal : standValue;
                        }
                        return retVal;
                    }
                });
                var unit = columnDesc.unit;
                if (!Ext.isEmpty(unit)) {
                    var unitDesc = Ext.decode(unit);
                    var baseUnitId = unitDesc.baseUnitId;
                    var selectorNames = unitDesc.selectorNames;
                    var baseUnitName;
                    Ext.each(unitDesc.selectorIds, function (selectorId, index) {
                        if (selectorId == baseUnitId) {
                            baseUnitName = selectorNames[index];
                        }
                    });
                    retVal.header = retVal.header + '(' + baseUnitName + ')'
                }
            } else if ("DateColumnDesc" == className) {
                if($.browser.msie) {//处理IE兼容
                    Ext.apply(retVal, {
                        //xtype: 'datecolumn',
                        //format: "Y-m-d",
                        width: 120
                    });
                }else {
                    Ext.apply(retVal, {
                        xtype: 'datecolumn',
                        format: "Y-m-d",
                        width: 120
                    });
                }
            } else if ("DateTimeColumnDesc" == className) {
                if($.browser.msie) {//处理IE兼容
                    Ext.apply(retVal, {//下面两行直接注释掉可以解决Ext4在IE8下日期显示的bug
                        //xtype: 'datecolumn',
                        //format: "Y-m-d H:i:s",
                        width: 180
                    });
                } else {
                    Ext.apply(retVal, {
                        xtype: 'datecolumn',
                        format: "Y-m-d H:i:s",
                        width: 180
                    });
                }

            } else if ("SingleEnumColumnDesc" == className) {

            } else if ("TextColumnDesc" == className) {
                Ext.apply(retVal, {});
            } else if ("MultiEnumColumnDesc" == className) {
                Ext.apply(retVal, {});
            } else if ("BooleanColumnDesc" == className) {
                Ext.apply(retVal, {
                        width: 60,
                        renderer: function (value) {
                            var retVal = "";
                            if ("1" == value + "") {
                                retVal = "是";
                            } else if ("0" == value + "") {
                                retVal = "否";
                            }
                            return retVal;
                        }
                    }
                )
                ;
            } else if ("RelationColumnDesc" == className) {
                Ext.apply(retVal, {
                        renderer: function (value, column, record) {
                            var retVal = "";
                            var displayValue = record.raw[columnDesc.sColumnName + '_display'];
                            if (!Ext.isEmpty(displayValue)) {
                                var relationDataJson = Ext.decode(displayValue);
                                Ext.each(relationDataJson, function (data) {
                                    retVal += data.name + ",";
                                })
                            }
                            retVal = retVal != "" ? retVal.substr(0, retVal.length - 1) : retVal;
                            return retVal;
                        }
                    }
                )
                ;
            } else if ("FileColumnDesc" == className) {
                Ext.apply(retVal, {
                    renderer: function (value) {
                        var retVal = "";
                        if (!Ext.isEmpty(value)) {
                            var template = "<a target='_blank' class='attachment'  onclick='OrientExtend.FileColumnDesc.handleFile(\"#fileId#\",\"#fileType#\")' title='#title#'><span class='taskSpan'>#name#</span></a>";
                            var fileJson = Ext.decode(value);
                            var fileSize = fileJson.length;
                            Ext.each(fileJson, function (fileDesc, index) {
                                var fileId = fileDesc.id;
                                var fileName = fileDesc.name;
                                var fileType = fileDesc.fileType;
                                retVal += template.replace("#name#", fileName).replace("#title#", fileName).replace("#fileId#", fileId).replace("#fileType#", fileType);
                                if (index != (fileSize - 1)) {
                                    retVal += "</br>";
                                }
                            });
                        }
                        return retVal;
                    }
                });
            } else if ("SingleTableEnumColumnDesc" == className || "MultiTableEnumColumnDesc" == className) {
                Ext.apply(retVal, {
                        renderer: function (value, column, record) {
                            var retVal = "";
                            var displayValue = record.raw[columnDesc.sColumnName + '_display'];
                            if (!Ext.isEmpty(displayValue)) {
                                var relationDataJson = Ext.decode(displayValue);
                                Ext.each(relationDataJson, function (data) {
                                    retVal += data.name + ",";
                                })
                            }
                            retVal = retVal != "" ? retVal.substr(0, retVal.length - 1) : retVal;
                            return retVal;
                        }
                    }
                );
            } else if ("CheckColumnDesc" == className) {
                // retVal = {
                //     xtype: 'actioncolumn',
                //     width: 20*columnDesc.text.length,
                //     align: 'center',
                //     header: columnDesc.text,
                //     items: [{
                //         icon: serviceName + '/app/images/icons/default/modeldata/checkColumnDetail.png',
                //         tooltip: '查看详细',
                //         handler: function (grid, rowIndex, colIndex) {
                //             var record = grid.store.getAt(rowIndex);
                //             //弹出窗口 展现检查结果
                //             var data = record.raw[columnDesc.sColumnName];
                //             var cloneColumn = Ext.decode(Ext.encode(columnDesc));
                //             cloneColumn.editAble = false;
                //             var checkColumGrid = Ext.create('OrientTdm.Common.Extend.Form.Field.CheckColumnDesc', {
                //                 columnDesc: cloneColumn,
                //                 listData:data
                //             });
                //             checkColumGrid.setValue(data);
                //             var win = OrientExtUtil.WindowHelper.createWindow(checkColumGrid, {
                //                 title: columnDesc.text + '详细',
                //                 buttons: [
                //                     {
                //                         text: '关闭',
                //                         iconCls: 'icon-close',
                //                         handler: function () {
                //                             win.close();
                //                         }
                //                     }
                //                 ]
                //             });
                //         }
                //     }]
                // };
                Ext.apply(retVal, {
                        renderer: function (value) {
                            var retVal = '';
                            if (!Ext.isEmpty(value)) {
                                var decodedData = Ext.decode(value);
                                //combineEmptyKey
                                Ext.each(decodedData, function (item, index) {
                                    var needEnter = true;
                                    var checkValue = item.inputValue;
                                    if (!Ext.isEmpty(item.labelName)) {
                                        retVal += item.labelName + ":";
                                    } else {
                                        needEnter = false;
                                    }
                                    if (typeof checkValue == 'boolean') {
                                        checkValue = checkValue == true ? '<font style="color: green; ">检查通过</font>' : '<font color=red>检查未通过</font>';
                                    } else if (checkValue.split('[orient-mid]').length == 2) {
                                        var splitArray = checkValue.split('[orient-mid]');
                                        checkValue = ("true" == splitArray[0] ? '<font style="color: green; ">检查通过</font>' : '<font color=red>检查未通过</font>') + "：" + splitArray[1];
                                    }
                                    if (needEnter) {
                                        retVal += checkValue + '</br>';
                                    } else if (index == 0) {
                                        retVal += checkValue;
                                    } else if (!Ext.isEmpty(checkValue)) {
                                        retVal += '(' + checkValue + ')';
                                    }


                                });
                            }
                            return retVal;
                        }
                    }
                );
            } else if ("DynamicFormGridDesc" == className) {
                retVal = {
                    xtype: 'actioncolumn',
                    width: 15 * columnDesc.text.length,
                    align: 'center',
                    header: columnDesc.text,
                    items: [{
                        icon: serviceName + '/app/images/icons/default/modeldata/detailDynamicColumn.png',
                        tooltip: '查看详细',
                        handler: function (grid, rowIndex, colIndex) {
                            var record = grid.store.getAt(rowIndex);
                            //弹出窗口 展现检查结果
                            var data = record.raw[columnDesc.sColumnName];
                            var cloneColumn = Ext.decode(Ext.encode(columnDesc));
                            cloneColumn.editAble = false;
                            var checkColumGrid = Ext.create('OrientTdm.Common.Extend.Form.Field.DynamicFormGridDesc', {
                                columnDesc: cloneColumn
                            });
                            checkColumGrid.setValue(data);
                            var win = OrientExtUtil.WindowHelper.createWindow(checkColumGrid, {
                                title: columnDesc.text + '详细',
                                buttons: [
                                    {
                                        text: '关闭',
                                        iconCls: 'icon-close',
                                        handler: function () {
                                            win.close();
                                        }
                                    }
                                ]
                            });
                        }
                    }]
                };
            }
            return retVal;
        },
        columnTypeRenderer: function (value) {
            var retVal = "";
            if ("C_Simple" == value) {
                retVal = "普通文本";
            } else if ("C_Double" == value || "C_Integer" == value || "C_BigInteger" == value || "C_Decimal" == value || "C_Float" == value) {
                retVal = "数值";
            } else if ("C_Date" == value) {
                retVal = "日期";
            } else if ("C_DateTime" == value) {
                retVal = "时间";
            } else if ("C_SingleEnum" == value) {
                retVal = "单选枚举";
            } else if ("C_Text" == value) {
                retVal = "大文本";
            } else if ("C_MultiEnum" == value) {
                retVal = "多选枚举";
            } else if ("C_Boolean" == value) {
                retVal = "是否";
            } else if ("C_Relation" == value) {
                retVal = "关系类型";
            } else if ("C_File" == value) {
                retVal = "文件";
            } else if ("C_SingleTableEnum" == value) {
                retVal = "单选表枚举";
            } else if ("C_MultiTableEnum" == value) {
                retVal = "多选表枚举";
            } else if ("C_Ods" == value) {
                retVal = "ODS文件";
            } else if ("C_Hadoop" == value) {
                retVal = "Hadoop文件";
            } else if ("C_Check" == value) {
                retVal = "检查表";
            } else if ("C_NameValue" == value) {
                retVal = "键值对类型";
            } else if ("C_SubTable" == value) {
                retVal = "子表类型";
            }
            return retVal;
        }
    }

});


