/**
 * 消息详情
 */
Ext.define('OrientTdm.HomePage.homePageShow.MsgGridPortal', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.msgGridPortal',
    requires: [
        'OrientTdm.HomePage.Msg.CwmMsg'
    ],
    viewConfig: {
        stripeRows: true,
        autoFill: true,
        forceFit: true
    },
    statics: {
        showDetail: function (itemId, recordId) {
            var store = Ext.getCmp(itemId).getStore();
            var record = store.getById(recordId);
            var date = Ext.Date.format(new Date(record.raw.timestamp), "Y-m-d H:i:s");
            record.raw.timestamp = date;
            record.data.timestamp = date;

            var msgFormPanel = Ext.create('OrientTdm.HomePage.homePageShow.MsgFormPortal', {
                bindModelName: 'CwmMsg',
                successCallback: function (resp, callBackArguments) {
                    Ext.getCmp(itemId).fireEvent('refreshGrid');
                    if (callBackArguments) {
                        updateWin.close();
                    }
                },
                originalData: record,
                msgGridId: itemId,
                msgDataId: recordId
            });
            //弹出查看窗口
            var updateWin = Ext.create('Ext.Window', {
                title: '查看消息',
                plain: true,
                height: 350,
                width: 0.3 * globalWidth,
                layout: 'fit',
                //maximizable: true,
                modal: true,
                items: [msgFormPanel]
            });
            //关闭窗口时需要刷新信息数量
            updateWin.on('close', function () {
                OrientExtUtil.HomeHelper.refreshNoticeMsgCount();
            });
            updateWin.show();
        }
    },
    initComponent: function () {
        var me = this;
        me.frame = false;
        //不显示翻页
        me.usePage = true;

        this.callParent(arguments);

        me.initEvents();
        //me.on("cellclick", me.cellClickListener, me);
        this.addEvents('filterByFilter');
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'filterByFilter', me.filterByFilter, me);
    },
    createStore: function () {
        var retVal = Ext.create("Ext.data.Store", {
            autoLoad: true,
            model: 'OrientTdm.HomePage.Msg.CwmMsg',
            proxy: {
                type: 'ajax',
                api: {
                    // "read":  "msg/getUserMsgs.rdm?readed=false"
                    "read": "msg/getUserMsgs.rdm"
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'total',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParam: {
                    readed: false
                }
            }
        });

        this.store = retVal;
        return retVal;
    },
    createToolBarItems: function () {
        var me = this;

        var retVal = [];

        return retVal;
    },
    createColumns: function () {
        var me = this;
        return [
            {
                header: '标题',
                flex: 1,
                dataIndex: 'title',
                renderer: Ext.bind(me.renderName, me)
            },
            {
                header: '时间',
                dataIndex: 'timestamp',
                width: 140,
                renderer: function (value) {
                    return Ext.Date.format(new Date(value * 1000), "Y-m-d H:i:s");
                }
            },
            {
                header: '消息源',
                width: 100,
                dataIndex: 'src'
            }, {
                header: '状态',
                width: 100,
                dataIndex: 'readed',
                renderer: function (value) {
                    if (value) {
                        return "<span style='color: green'>已读 </span>";
                    } else {
                        return "<span style='color: red'>未读</span>";
                    }
                }
            }
        ];
    },
    cellClickListener: function (table, td, cellIndex, record, tr, rowIndex, e, eopts) {
        if (cellIndex !== 1 && 'take' !== eopts) {
            return;
        }
        //弹出查看窗口
        var updateWin = Ext.create('Ext.Window', {
            title: '查看消息',
            plain: true,
            height: 250,
            width: 0.3 * globalWidth,
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [Ext.create(OrientTdm.HomePage.homePageShow.MsgFormPortal, {
                bindModelName: 'CwmMsg',
                successCallback: function (resp, callBackArguments) {
                    me.fireEvent('refreshGrid');
                    if (callBackArguments) {
                        updateWin.close();
                    }
                },
                originalData: record
            })]
        });
        updateWin.show();
    },
    renderName: function (value, p, record) {
        var me = this;
        var recordId = record.getId();
        return '<span href="javascript:;" class="taskSpan" onclick="OrientTdm.HomePage.homePageShow.MsgGridPortal.showDetail(\'' + me.getId() + '\'' + ',' + recordId + ');">' + value + '</span>';
    },
    filterByFilter: function (filter) {
        for (var proName in filter) {
            var proValue = filter[proName];
            if (proName === 'startDate' || proName === 'endDate') {
                proValue = proValue.replace(/[年月日]/g, '-');
                proValue = proValue.substr(0, proValue.length - 1);
            }
            this.getStore().getProxy().setExtraParam(proName, proValue);
        }
        this.getStore().loadPage(1);
    },
    afterInitComponent: function () {
        var me = this;
        me.selModel = {};
        me.selType = "rowmodel";//不添加复选框
        me.store.getProxy().setExtraParam('start', 0);
        me.store.getProxy().setExtraParam('limit', msgPageCnt);
    }
});