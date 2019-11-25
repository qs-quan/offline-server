/**
 * Created by enjoy on 2016/3/16 0016.
 */
Ext.define('OrientTdm.BackgroundMgr.Component.ComponentList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.componentList',
    requires: [
        'OrientTdm.BackgroundMgr.Component.Model.ComponentExtModel',
        'OrientTdm.BackgroundMgr.Component.Common.ComponentForm'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var addConfig = {
            title: '新增组件',
            height: 200,
            formConfig: {
                formClassName: "OrientTdm.BackgroundMgr.Component.Common.ComponentForm",
                appendParam: function () {
                    return {
                        bindModelName: "CWM_COMPONENT",
                        actionUrl: me.store.getProxy().api.create,
                        successCallback: function (resp, callBackArguments) {
                            me.fireEvent("refreshGrid");
                            if (callBackArguments) {
                                this.up("window").close();
                            }
                        }
                    }
                }
            }
        };

        var updateConfig = {
            title: '修改组件',
            height: 200,
            formConfig: {
                formClassName: "OrientTdm.BackgroundMgr.Component.Common.ComponentForm",
                appendParam: function () {
                    return {
                        bindModelName: "CWM_COMPONENT",
                        actionUrl: me.store.getProxy().api.update,
                        originalData: this.getSelectedData()[0],
                        successCallback: function () {
                            me.fireEvent("refreshGrid");
                            this.up("window").close();
                        }
                    }
                }
            }
        };
        var retVal = [{
            iconCls: 'icon-create',
            text: '新增',
            itemId: 'create',
            scope: this,
            handler: Ext.bind(me.onCreateClick, me, [addConfig], false)
        }, {
            iconCls: 'icon-delete',
            text: '批量删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.onDeleteClick
        }];
        me.actionItems = [{
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            handler: Ext.bind(me.onUpdateClick, me, [updateConfig], false)
        }, retVal[1], {
            iconCls: 'icon-preview',
            text: '预览',
            disabled: false,
            itemId: 'preview',
            scope: this,
            handler: this.onPreviewBtnClick
        }];
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '组件名称',
                width: 150,
                sortable: true,
                dataIndex: 'componentname',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '组件绑定类',
                flex: 1,
                sortable: true,
                dataIndex: 'classname',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '备注',
                flex: 1,
                dataIndex: 'remark'
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.Component.Model.ComponentExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/Component/list.rdm',
                    'create': serviceName + '/Component/create.rdm',
                    'update': serviceName + '/Component/update.rdm',
                    'delete': serviceName + '/Component/delete.rdm'
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
                    writeAllFields: false,
                    root: 'data'
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    onPreviewBtnClick: function () {
        var me = this;
        if (OrientExtUtil.GridHelper.hasSelectedOne(me)) {
            //填写参数
            Ext.MessageBox.show({
                title: '初始化组件',
                msg: '请输入参数(Json格式):',
                width: 300,
                buttons: Ext.MessageBox.OKCANCEL,
                multiline: true,
                fn: function (btn, text) {
                    if ('ok' == btn) {
                        try {
                            Ext.decode(text);
                        } catch (e) {
                            OrientExtUtil.Common.err(OrientLocal.error, '请输入有效的json字符');
                            return;
                        }
                        text = text || "{}";
                        var selectedId = OrientExtUtil.GridHelper.getSelectRecordIds(me)[0];
                        var params = {
                            componentId: selectedId
                        };
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/Component/getComponentJSClass.rdm', params, true, function (resp) {
                            var results = resp.decodedData.results;
                            if (!Ext.isEmpty(results)) {
                                Ext.require(results, function () {
                                    var item = Ext.create(results, Ext.decode(text));
                                    if (item.xtype != 'window') {
                                        OrientExtUtil.WindowHelper.createWindow(item, {
                                            title: '组件预览'
                                        });
                                    }
                                });
                            } else {
                                OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.unBindExtClass);
                            }
                        });
                    }
                }
            });
        }
    }
});
