Ext.define('OrientTdm.TestInfo.PieChart.UserTestDataInfoGrid.UserTesTDataGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    requires: [],
    alias: 'widget.UserTesTDataGrid',

    initComponent: function () {
        var me = this;
        me.pageSize = 5;
        me.beforeInitComponent.call(me);
        Ext.apply(me, {
            layout: "border"
        });
        this.callParent(arguments);
        me.afterInitComponent.call(me);
    },

    createToolBarItems: function () {
        var me = this;
        var retval = [{
            iconCls: 'icon-query',
            text: "查询",
            scope: this,
            handler: me.doQuery
        }, {
            iconCls: 'icon-export',
            text: "导出",
            scope: this,
            handler: function () {
                var fields = [];
                Ext.each(me.columns, function (head) {
                    if (!head.hidden) {
                        var columnObj = {};
                        columnObj.dbColumnName = head.dataIndex;
                        columnObj.header = head.text;
                        fields.push(columnObj)
                    }
                });
                me.doExport(fields);
            }
        }];
        return retval;
    },

    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: [
                // 委托单号
                {name: 'atdWtdh'},
                // 部门（试验申请的申请人）
                {name: 'depName'},
                // 工号（试验申请申请人工号）
                {name: 'uNo'},
                // 名称（试验申请的图号）
                {name: 'atdTh'},
                // 产品编号（图号信息增加的字段：产品编号（实物标识））
                {name: 'thCpth'},
                // 交验类型
                {name: 'atdJylx'},
                // 产品级别
                {name: 'atdCpjb'},
                // 数量（默认1）
                {name: 'count'},
                // 检验员（试验项协同任务的最后一个节点（检验人员检验）的执行人）
                {name: 'issryNamed'},
                // 检验时间（空则）
                {name: 'jysj'},
                // 检验类型（试验类型）
                {name: 'sylxMc'}
            ],
            remoteSort: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/UserTestDataInfoStatisticsController/query.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    totalProperty: 'totalProperty',
                    messageProperty: 'msg'
                }
            },
            listeners: {
                /**
                 * 设置查询参数
                 * @param store
                 * @param operation
                 */
                beforeLoad: function (store, operation) {
                    store.getProxy().setExtraParam("startIndex", operation.start);
                    store.getProxy().setExtraParam("maxIndex", operation.limit);
                    store.getProxy().setExtraParam("uId", userId);
                }
            }
        });

        this.store = retVal;
        return retVal;
    },

    createColumns: function () {
        var me = this;
        return [
            {
                header: '委托单号',
                flex: 1,
                sortable: true,
                dataIndex: 'atdWtdh',
                renderer: Ext.bind(me.renderName, me)
            }, {
                // 部门（试验申请的申请人）
                header: '部门',
                flex: 1,
                sortable: true,
                dataIndex: 'depName',
                renderer: Ext.bind(me.renderName, me)
            }, {
                // 工号（试验申请申请人工号）
                header: '工号',
                flex: 1,
                sortable: true,
                dataIndex: 'uNo',
                renderer: Ext.bind(me.renderName, me)
            }, {
                // 名称（试验申请的图号）
                header: '名称',
                flex: 1,
                sortable: true,
                dataIndex: 'atdTh',
                renderer: Ext.bind(me.renderName, me)
            }, {
                // 产品编号（图号信息增加的字段：产品编号（实物标识））
                header: '产品编号',
                flex: 1,
                sortable: true,
                dataIndex: 'thCpth',
                renderer: Ext.bind(me.renderName, me)
            }, {
                // 交验类型
                header: '交验类型',
                flex: 1,
                sortable: true,
                dataIndex: 'atdJylx',
                renderer: Ext.bind(me.renderName, me)
            }, {
                // 产品级别
                header: '产品级别',
                flex: 1,
                sortable: true,
                dataIndex: 'atdCpjb',
                renderer: Ext.bind(me.renderName, me)
            }, {
                // 数量（默认1）
                header: '数量',
                flex: 1,
                sortable: true,
                dataIndex: 'count',
                renderer: Ext.bind(me.renderName, me)
            }, {
                // 检验员（试验项协同任务的最后一个节点（检验人员检验）的执行人）
                header: '检验员',
                flex: 1,
                sortable: true,
                dataIndex: 'ssryName',
                renderer: Ext.bind(me.renderName, me)
            }, {
                // 检验时间（空着）
                header: '检验时间',
                flex: 1,
                sortable: true,
                dataIndex: 'jysj',
                renderer: Ext.bind(me.renderName, me)
            }, {
                // 检验类型（试验类型）
                header: '检验类型',
                flex: 1,
                sortable: true,
                dataIndex: 'sylxMc',
                renderer: Ext.bind(me.renderName, me)
            }
        ];
    },

    /**
     * 字段渲染
     * @param value
     * @param meta
     * @param record
     * @returns {*|string}
     */
    renderName: function (value, meta, record) {
        value = value || '';
        meta.tdAttr = 'data-qtip="' + value + '"';
        return value;
    },

    doQuery: function () {
        var me = this;
        var firstRow = Ext.create("Ext.form.FieldContainer", {
            layout: "hbox",
            width: "100%",
            combineErrors: true,
            items: [
                {
                    xtype: "textfield",
                    flex: 1,
                    labelAlign: 'right',
                    margin: '5 5 0 5',
                    name: "工号",
                    fieldLabel: "委托单号"
                },
                {
                    flex: 1,
                    labelAlign: 'right',
                    margin: '5 5 0 5',
                    xtype: "textfield",
                    name: "工号",
                    fieldLabel: "工号"
                }
            ]
        });
        var secondRow = Ext.create("Ext.form.FieldContainer", {
            layout: "hbox",
            width: "100%",
            combineErrors: true,
            items: [
                {
                    flex: 1,
                    labelAlign: 'right',
                    margin: '5 5 0 5',
                    xtype: "textfield",
                    name: "工号",
                    fieldLabel: "名称"
                },
                {
                    flex: 1,
                    labelAlign: 'right',
                    margin: '5 5 0 5',
                    xtype: "textfield",
                    name: "工号",
                    fieldLabel: "产品单号"
                }
            ]
        });
        var queryForm = Ext.create('OrientTdm.Common.Extend.Form.OrientForm', {
            region: "center",
            layout: "vbox",
            width: "100%",
            items: [firstRow, secondRow]
        });
        var win = OrientExtUtil.WindowHelper.createWindow(queryForm, {
            title: "查询",
            layout: "border",
            buttons: ["->",
                {
                    iconCls: 'icon-query',
                    text: "查询",
                    handler: function () {

                    }
                },
                {
                    iconCls: 'icon-query',
                    text: "取消",
                    handler: function (btn) {
                        win.close();
                    }
                }, "->"
            ]
        }, 200, 800);
    },

    doExport: function (fields) {
        var me = this;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/customExport/exportData.rdm", {
            fields: Ext.encode(fields)
        }, true, function (resp) {
            window.location.href = serviceName + "/orientForm/downloadByName.rdm?fileName=" + resp.decodedData.results;
        })
    }


});