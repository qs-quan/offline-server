/**
 * 可编辑树形表格
 * Created by Administrator on 2016/7/21 0021.
 */
Ext.define('OrientTdm.Collab.Data.DevData.Common.DevDataInstance', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.devDataInstance',
    config: {
        beforeInitComponent: Ext.emptyFn,
        afterInitComponent: Ext.emptyFn,
        modelId: '',
        dataId: '',
        type: '',
        //是否在任务管理中
        apiConfig: {},
        localMode: false,
        localData: null
    },
    requires: [
        'Ext.ux.statusbar.StatusBar',
        'OrientTdm.Collab.Data.DevData.Model.DevDataExtModel',
        'OrientTdm.Collab.Data.DevData.Common.DataTypeSelectorWin',
        'OrientTdm.Collab.Data.DevData.Common.UploadFileWin'
    ],
    initComponent: function () {
        var me = this;
        me.beforeInitComponent.call(me);
        me.readOnly = me.type == '2' || me.localMode;
        me.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2
        });
        var store = me.createStore.call(me);
        store.pageSize = globalPageSize || 25;
        var columns = me.createColumn.call(me);
        var toolBarItems = me.createToolBarItems.call(me);
        var toolBar = toolBarItems ? Ext.create('Ext.toolbar.Toolbar', {
            items: toolBarItems
        }) : null;
        var bbar = me.createBBar.call(me);
        Ext.apply(me, {
            columns: columns,
            dockedItems: [toolBar],
            bbar: bbar,
            store: store,
            plugins: [me.cellEditing],
            useArrows: true,
            rootVisible: false,
            multiSelect: true,
            viewConfig: {
                getRowClass: me._changeRowClass
            }
        });
        me.callParent(arguments);
        me.afterInitComponent.call(me);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'checkchange', me.selectionchange, me);
        me.mon(me, 'celldblclick', me.celldblclick, me);
        me.mon(me, 'select', me.select, me);

    },
    createStore: function () {
        var me = this;
        if (me.localMode) {
            return Ext.create('Ext.data.TreeStore', {
                model: 'OrientTdm.Collab.Data.DevData.Model.DevDataExtModel',
                root: {
                    text: 'root',
                    id: '-1',
                    expanded: true,
                    children: me.type == 1 ? me.localData.publicDataInstances : me.localData.privateDataInstances
                }
            });

        } else {
            return Ext.create('Ext.data.TreeStore', {
                model: 'OrientTdm.Collab.Data.DevData.Model.DevDataExtModel',
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    api: {
                        "read": me.apiConfig["read"],
                        "create": me.apiConfig["create"],
                        "update": me.apiConfig["update"],
                        "destroy": me.apiConfig["destroy"]
                    },
                    reader: {
                        type: 'json',
                        successProperty: 'success',
                        totalProperty: 'totalProperty',
                        root: 'results',
                        messageProperty: 'msg'
                    },
                    writer: {
                        type: 'json',
                        allowSingle: false,
                        root: 'data'
                    },
                    extraParams: {
                        modelId: me.modelId,
                        dataId: me.dataId,
                        isglobal: me.type
                    }
                },
                listeners: {
                    beforesync: function () {
                        me.down("statusbar").showBusy();
                    }
                }
            });
        }
    },
    createColumn: function () {
        var me = this;
        var editMarker = me.readOnly == true ? '' : '(★)';
        return [
            {
                xtype: 'treecolumn',
                header: '名称' + editMarker,
                width: 200,
                sortable: true,
                dataIndex: 'dataobjectname',
                editor: {
                    xtype: 'textfield'
                },
                renderer: function (value, p, record) {
                    var retVal = value;
                    if (me.isSelfData(record)) {
                        retVal = '<span style="color:red;">' + value + '</span>';
                    }
                    return retVal;

                }
            }, {
                header: '类型' + editMarker,
                width: 150,
                sortable: true,
                dataIndex: 'dataTypeShowName',
                editor: {
                    xtype: 'textfield'
                }
            }, {
                header: '值' + editMarker,
                flex: 1,
                sortable: true,
                dataIndex: 'value',
                renderer: function (value, p, record) {
                    var retVal = value;
                    var extendsTypeRealName = record.get('extendsTypeRealName');
                    if ('date' == extendsTypeRealName && value) {
                        retVal = Ext.isDate(value) ? Ext.Date.format(value, 'Y-m-d') : value.substr(0, value.indexOf('T'));
                    } else if ('file' == extendsTypeRealName) {
                        //json串
                        if (!Ext.isEmpty(value)) {
                            retVal = '';
                            var gridId = me.id;
                            var recordId = record.getId();
                            var templateArray = [
                                "<span class='attachement-span'>",
                                "<a target='_blank' class='attachment'  onclick='OrientExtend.FileColumnDesc.handleFile(\"#fileId#\",\"C_File\")' title='#title#'>#name#</a>",
                                '<a href="javascript:;" onclick="OrientExtend.FileColumnDesc.handleFile(\'{id}\',\'C_File\');" title="下载" class="download">',
                                '</a>',
                                '&nbsp;',
                                '<a href="javascript:;" onclick="OrientExtend.FileColumnDesc.deleteGridFile(\'' + gridId + '\',\'' + recordId + '\',\'value\');" class="cancel">',
                                '</a>',
                                '</span>'
                            ];
                            var template = templateArray.join('');
                            var fileJson = Ext.decode(value);
                            var fileSize = fileJson.length;
                            Ext.each(fileJson, function (fileDesc, index) {
                                var fileId = fileDesc.id;
                                var fileName = fileDesc.name.length > 10 ? (fileDesc.name.substr(0, 6) + '...') : fileDesc.name;
                                retVal += template.replace("#name#", fileName).replace("#title#", fileName).replace("#fileId#", fileId);
                                if (index != (fileSize - 1)) {
                                    retVal += "</br>";
                                }
                            });
                        }
                    }
                    return retVal;
                }
            }, {
                header: '单位',
                width: 80,
                sortable: true,
                dataIndex: 'unit'
            }, {
                header: '版本',
                width: 120,
                sortable: true,
                dataIndex: 'version',
                renderer: function (value, column, record) {
                    var retVal = '';
                    if (record.parentNode.isRoot()) {
                        retVal = value;
                    }
                    return retVal;
                }
            }, {
                header: '修改人',
                width: 120,
                sortable: true,
                dataIndex: 'modifiedUser'
            }, {
                header: '修改时间',
                xtype: 'datecolumn',
                format: "Y-m-d H:i:s",
                width: 150,
                sortable: true,
                dataIndex: 'modifytime'
            }, {
                header: '历史版本',
                xtype: 'actioncolumn',
                width: 60,
                align: 'center',
                sortable: false,
                menuDisabled: true,
                items: [{
                    icon: 'app/images/icons/default/common/detail.png',
                    tooltip: '历史版本',
                    scope: this,
                    handler: function (grid, rowIndex, colIndex, column, event, record) {
                        var dataObjId = record.get("id");
                        if (dataObjId) {
                            var layout = me.ownerCt.getLayout();
                            var hisPanel = layout.getNext();
                            hisPanel.getStore().getProxy().setExtraParam("dataObjId", dataObjId);
                            hisPanel.getStore().load();
                            layout.setActiveItem(1);
                        }
                    },
                    isDisabled: function (view, rowIdx, colIdx, item, record) {
                        return !record.parentNode.isRoot();
                    }
                }]
            }
        ];
    },
    createToolBarItems: function () {
        var me = this;
        if (me.readOnly == true) {
            return null;
        }
        var retVal = [];

        retVal.push({
            iconCls: 'icon-create',
            text: '新增',
            itemId: 'create',
            scope: this,
            handler: me._onCreateClick
        }, {
            iconCls: 'icon-delete',
            text: '删除',
            itemId: 'delete',
            scope: this,
            handler: me._onDeleteClick
        }, {
            iconCls: 'icon-up',
            text: '上移',
            disabled: false,
            itemId: 'up',
            scope: this,
            handler: me._onMove
        }, {
            iconCls: 'icon-down',
            text: '下移',
            disabled: false,
            itemId: 'down',
            scope: this,
            handler: me._onMove
        });

        retVal.push({
            iconCls: 'icon-save',
            text: '保存',
            disabled: false,
            itemId: 'save',
            scope: this,
            handler: me._onSaveClick
        }, {
            iconCls: 'icon-refresh',
            text: '刷新',
            disabled: false,
            itemId: 'refresh',
            scope: this,
            handler: me._onRefreshClick
        });
        if ('0' == me.type) {
            //如果是私有数据 可以推送至 共享数据
            retVal.push({
                iconCls: 'icon-share',
                text: '共享',
                disabled: false,
                itemId: 'push',
                scope: this,
                handler: me._onPushClicked
            });
        } else {
            //如果是共享数据 可以撤回 私有数据
            retVal.push({
                iconCls: 'icon-cancleShare',
                text: '取消共享',
                disabled: false,
                itemId: 'undo',
                scope: this,
                handler: me._onUndoClicked
            });
            //只有任務節點的數據可以提交
            if (me.modelId) {
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getModelSNameByModelId.rdm', {modelId: me.modelId}, false, function (resp) {
                    if (resp.decodedData.results && resp.decodedData.results.indexOf('CB_TASK_') != -1) {
                        me.mustSubmitData = true;
                        retVal.push({
                            iconCls: 'icon-submitData',
                            text: '数据提交',
                            disabled: false,
                            itemId: 'dataSumbit',
                            scope: me,
                            handler: me._onDataSubmitClicked
                        });
                    }
                });
            }
        }
        retVal.push('->', {
            xtype: 'tbtext',
            text: '<span style="color: red">★所在列可双击编辑</span>'
        });
        return retVal;
    },
    createBBar: function () {
        return Ext.create("Ext.ux.statusbar.StatusBar", {
            text: '已保存',
            iconCls: 'x-status-valid'
        });
    },
    _onCreateClick: function () {
        var me = this;
        var childNodes = this.getRootNode().childNodes;
        var maxOrder = 1;
        Ext.each(childNodes, function (childNode) {
            var orderNumber = Number(childNode.get('ordernumber'));
            maxOrder = Math.max(orderNumber, maxOrder);
        });
        var record = Ext.create('OrientTdm.Collab.Data.DevData.Model.DevDataExtModel', {
            dataobjectname: '新增参数',
            dataTypeShowName: '文件',
            datatypeId: '5',
            leaf: true,
            isref: '1',
            extendsTypeRealName: 'file',
            isglobal: me.type,
            checked: false,
            modelid: me.modelId,
            dataid: me.dataId,
            createBy: me.type
        });
        var root = me.getRootNode();
        root.insertChild(0, record);
    },
    _onDeleteClick: function () {
        var me = this;
        var selectedRecords = me.getCheckedRecords();
        Ext.each(selectedRecords, function (record) {
            record.remove();
        });
    },
    _onSaveClick: function () {
        var me = this;
        this.store.sync({
            success: function () {
                if (null == me.successCallBack) {
                    me._onRefreshClick();
                } else {
                    me.successCallBack.call(me);
                }
            }
        });
    },
    _onRefreshClick: function () {
        this.down("statusbar").setStatus({
            text: '已保存',
            iconCls: 'x-status-valid'
        });
        this.getSelectionModel().clearSelections();
        var store = this.getStore();

        var root = this.getRootNode();
        store.load({node: root});
    },
    _onMove: function (button) {
        var me = this;
        //先保存
        var store = me.getStore();
        var dirty = store.getNewRecords().length > 0 || store.getUpdatedRecords().length > 0 || store.getRemovedRecords().length > 0;
        if (dirty) {
            Ext.Msg.confirm(OrientLocal.prompt.confirm, '有未保存的数据，是否需要保存', function (btn) {
                if (btn == 'yes') {
                    me._onSaveClick();
                }
            });
        } else {
            //请求数据库 保存排序
            var records = me.getCheckedRecords(false);
            var node = records[0];
            var toChaneNode = button.text == '上移' ? node.previousSibling : node.nextSibling;
            if (toChaneNode) {
                me._swapDataObjOrderNum(node, toChaneNode);
            } else {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, button.text == '上移' ? OrientLocal.prompt.alreadyTop : OrientLocal.prompt.alreadyBottom);
            }
        }
    },
    selectionchange: function (node, checked) {
        var me = this;
        //勾选父节点 以及 兄弟节点
        var parentNode = node.parentNode;
        if (!parentNode.isRoot()) {
            parentNode.set("checked", checked);
            //勾选兄弟节点
            parentNode.eachChild(function (child) {
                child.set("checked", checked);
            });
        }
        //递归勾选子节点
        node.expand(true, function () {
            node.eachChild(function (child) {
                child.set("checked", checked);
                me.fireEvent('checkchange', child, checked);
            });
        });
    },
    celldblclick: function (view, td, cellIndex, record, tr, rowIndex) {
        var me = this;
        if (me.isHistory == true) {
            //历史数据只能查看 不可修改
            return false;
        }
        if (me.readOnly == true) {
            //只读数据
            return false;
        }
        var belongGrid = view.up('devDataInstance');
        var clickedColumn = belongGrid.columns[cellIndex];
        var clickedcolumnIndex = clickedColumn.dataIndex;
        if ('dataTypeShowName' == clickedcolumnIndex) {
            //类型选择器
            me._popDataTypeSelectorWin(record);
            return false;
        } else if ('value' == clickedcolumnIndex) {
            //如果拥有子节点 则说明为复杂类型 无法修改
            if (record.childNodes.length > 0) {
                OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.complicateUnEditable);
                return false;
            } else
                return me._switchValueEditor(record, clickedColumn);
        }
    },
    select: function (rowModel, record, index) {
        //record.set("checked", true);
        //this.fireEvent('checkchange', record, true);
    },
    _popDataTypeSelectorWin: function (record) {
        var me = this;
        //判断是否有父节点 如果有父节点 则不可修改类型
        if (record.parentNode.isRoot() == false) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.unModifyAble);
        } else if (!Ext.isEmpty(record.get('id'))) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.reAddParam);
        } else {
            //弹出选择参数类型的窗口
            Ext.create('OrientTdm.Collab.Data.DevData.Common.DataTypeSelectorWin', {
                bindRecord: record,
                afterSelected: function () {
                    //me._onSaveClick()
                }
            });
        }
    },
    _switchValueEditor: function (record, clickedColumn) {
        var me = this;
        //根据参数类型 初始化不同的值输入器
        var extendsTypeRealName = record.get('extendsTypeRealName');
        var isref = record.get('isref');
        if ('4' == String(isref)) {
            //枚举类型 动态枚举
            var dataTypeId = record.get('datatypeId');
            var enumCombobox = Ext.create('OrientTdm.Common.Extend.Form.Field.OrientComboBox', {
                editable: false,
                remoteUrl: serviceName + '/DataSubType/getDataSubType.rdm?dataTypeID=' + dataTypeId,
                displayField: 'datasubname',
                valueField: 'datasubname',
                initFirstRecord: true
            });
            clickedColumn.setEditor(enumCombobox);
        } else if ('8' == String(isref)) {
            //复杂类型 只可编辑子项
            return false;
        } else {
            if ('date' == extendsTypeRealName) {
                clickedColumn.setEditor({
                    xtype: 'datefield',
                    format: 'Y-m-d',
                    editable: false,
                    listeners: {
                        "focus": function () {
                            if (!this.readOnly) {
                                this.expand();
                            }
                        },
                        "blur": function () {
                            this.collapse();
                        },
                        "change": function (field, newValue) {

                        }
                    }
                });
            } else if ('file' == extendsTypeRealName) {
                //弹出文件窗口
                Ext.create('OrientTdm.Collab.Data.DevData.Common.UploadFileWin', {
                    bindRecord: record
                });
                return false;
            } else if ('boolean' == extendsTypeRealName) {
                //checkbox
                clickedColumn.setEditor({
                    xtype: 'checkbox'
                });
            } else if ('integer' == extendsTypeRealName) {
                clickedColumn.setEditor({
                    xtype: 'numberfield',
                    decimalPrecision: 0
                });
            } else if ('double' == extendsTypeRealName) {
                clickedColumn.setEditor({
                    xtype: 'numberfield',
                    decimalPrecision: 10
                });
            } else {
                clickedColumn.setEditor({
                    xtype: 'textfield'
                });
            }
        }
        return true;
    },
    _onPushClicked: function () {
        var me = this;
        var records = me.getCheckedRecords();
        Ext.each(records, function (record) {
            record.set('isglobal', 1);
        });
        me._refreshAllDataPanel('push');

    },
    _onUndoClicked: function () {
        var me = this;
        //只有个人数据才可以取消共享
        var records = me.getCheckedRecords();
        var errParamNames = [];
        Ext.each(records, function (record) {
            if (record.get('createBy') == 1) {
                errParamNames.push(record.get('dataobjectname'));
            }
        });
        if (errParamNames.length == 0) {
            Ext.each(records, function (record) {
                record.set('isglobal', 0);
            });
            me._refreshAllDataPanel('undo');
        } else {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.onlyPrivateCanUnShare + '：【' + errParamNames.join(',') + '】不符合');
        }

    },
    _onDataSubmitClicked: function () {
        var me = this;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/dataTask/submit.rdm', {
            modelId: me.modelId,
            dataId: me.dataId
        }, false, function (resp) {
            //如果是数据任务，则关闭当前面板 并刷新数据任务表格
            var dataTaskDetailPanel = me.up('dataTaskDetailPanel');
            if (dataTaskDetailPanel) {
                dataTaskDetailPanel.fireEvent('afterSubmitDataTask');
            }
        });
    },
    _containsSonParam: function (records) {
        //判断是否包含子项
        var containsSonParam = false;
        var idArray = Ext.Array.pluck(records, 'id');
        Ext.each(records, function (record) {
            if (!record.parentNode.isRoot() && !Ext.Array.contains(idArray, record.parentNode.id)) {
                containsSonParam = true;
            }
        });
        if (containsSonParam == true) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.onlyMainParam);
        }
        return containsSonParam;
    },
    _refreshAllDataPanel: function (type) {
        var me = this;
        //刷新所有 数据面板
        var dataDashBord = me.up('devDataDashBord');
        if (dataDashBord) {
            var sharePanel = dataDashBord.down('devDataCard#shareData devDataInstance');
            var privateShare = dataDashBord.down('devDataCard#privateData devDataInstance');
            //先后保存顺序
            if ('undo' == type) {
                if (sharePanel) {
                    sharePanel._onSaveTypeChange.call(sharePanel, privateShare);
                }

            } else if ('push' == type) {
                if (privateShare) {
                    privateShare._onSaveTypeChange.call(privateShare, sharePanel);
                }

            }
        }
    },
    _swapDataObjOrderNum: function (node, toSwapNode) {
        node.setDirty();
        toSwapNode.setDirty();
        var me = this;
        var proxy = me.getStore().getProxy();
        var originalUrl = proxy.api['update'];
        proxy.api['update'] = serviceName + '/DataObj/swapDataObjOrderNum.rdm';
        me.store.sync({
            callback: function () {
                proxy.api['update'] = originalUrl;
                me._onRefreshClick();
            }
        });
    },
    _onSaveTypeChange: function (targetPanel) {
        var me = this;
        var proxy = me.getStore().getProxy();
        var originalUrl = proxy.api['update'];
        proxy.api['update'] = serviceName + '/DataObj/convertShareAbleDataObj.rdm';
        me.store.sync({
            callback: function () {
                proxy.api['update'] = originalUrl;
                me._onRefreshClick();
                targetPanel._onRefreshClick();
            }
        });
    },
    _changeRowClass: function (record, rowIndex, rowParams, store) {
        //var me = this;
        //var treeGrid = me.up('devDataInstance');
        //if (record.get('dataid') == treeGrid.dataId && record.get('modelid') == treeGrid.modelId) {
        //    //必填项
        //    return 'x-grid-record-yellow'
        //}
    },
    getCheckedRecords: function (containsSon) {
        var retVal = [];
        var me = this;
        var rootNode = me.getRootNode();
        getCheckData(rootNode);
        function getCheckData(node) {
            Ext.each(node.childNodes, function (childNode) {
                var extraFlag = containsSon == false ? childNode.parentNode.isRoot() : true;
                if (extraFlag && childNode.get('checked') == true) {
                    retVal.push(childNode);
                }
                getCheckData(childNode);
            });
        }

        return retVal;
    },
    canMove: function (button) {
        var me = this;
        //请求数据库 保存排序
        var records = me.getCheckedRecords(false);
        var node = records[0];
        if (records.length == 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else if (records.length > 1) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.onlyCanSelectOne);
        } else {
            var containsSonParam = me._containsSonParam(records);
            if (containsSonParam == false) {
                var toChaneNode = button.text == '上移' ? node.previousSibling : node.nextSibling;
                if (toChaneNode) {
                    //比对dataid是否一致
                    if (node.get('dataid') == toChaneNode.get('dataid')) {
                        return true;
                    } else {
                        OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.canNotMove);
                    }
                } else {
                    OrientExtUtil.Common.tip(OrientLocal.prompt.info, button.text == '上移' ? OrientLocal.prompt.alreadyTop : OrientLocal.prompt.alreadyBottom);
                }
            }
        }
        return false;
    },
    isSelfData: function (record) {
        var me = this;
        var retVal = false;
        if (me.mustSubmitData && record.get('dataid') == me.dataId && record.get('modelid') == me.modelId) {
            //必填项
            retVal = true;
        }
        return retVal;
    }
});

