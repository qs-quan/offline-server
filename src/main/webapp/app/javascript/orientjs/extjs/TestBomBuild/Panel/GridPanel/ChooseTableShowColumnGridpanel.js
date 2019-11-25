/**
 * 设置项目，显示的列表
 * Created by dailin on 2019/9/9 15:14.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.ChooseTableShowColumnGridpanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    requires: [
        "OrientTdm.Common.Util.OrientExtUtil",
        'OrientTdm.TestBomBuild.Model.ChooseTableShowColumnModel'
    ],
    alias: 'widget.chooseTableShowColumnGridpanel',
    config: {
        usePage: false,
        extraFilter: ''
    },
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,

    initComponent: function () {
        var me = this;
        me.usePage = false;
        me.extraFilter = {};
        me.region = 'center';
        me.hasToolBar = false;
        me.showAnalysisBtns = false;
        me.isView = 0;
        me.padding = '0 0 0 5';
        Ext.merge(me, {
            listeners: {
                deselect: function (model, record, index, event) {
                    if (record.data["DISPLAY_NAME"] == "产品编号") {
                        OrientExtUtil.Common.info('提示', "为了区分多个实物标识，产品编号为必选");
                        me.getSelectionModel().select(index, true);
                    }
                }
            }
        });

        me.callParent(arguments);
    },

    initEvents: function () {
        var me = this;
        me.callParent();
    },

    //视图初始化
    createToolBarItems: function () {
        var me = this;
        return [];
    },

    createColumns: function() {
        return [
            {
                header: '字段名称',
                flex: 2,
                sortable: true,
                dataIndex: 'DISPLAY_NAME',
                filter: {
                    type: 'string'
                }
            }
        ];
    },

    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.TestBomBuild.Model.ChooseTableShowColumnModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/ProjectTestRecordController/getAllTableColumns.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    totalProperty: 'totalProperty',
                    messageProperty: 'msg'
                },
                extraParams: {
                    modelId: me.modelId
                },
                writer: {
                    type: 'json',
                    writeAllFields: false,
                    root: 'data'
                },
                listeners: {
                    exception: function (proxy, response, operation) {
                        Ext.MessageBox.show({
                            title: '读写数据异常',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }
                }
            },
            listeners: {
                write: function (proxy, operation) {

                },
                load: function () {
                    var length = me.getStore().getCount();
                    var index = null;
                    for(var i=0;i < length; i++){
                        if(me.getStore().getAt(i).data["DISPLAY_NAME"] == "产品编号"){
                            index = i;
                        }
                    }
                    if (index) {
                        me.getSelectionModel().select(index, true);
                    }
                }
            }
        });
        this.store = retVal;
        return retVal;
    }

});
