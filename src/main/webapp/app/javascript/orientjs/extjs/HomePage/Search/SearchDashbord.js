/**
 * Created by panduanduan on 14/04/2017.
 */
Ext.define('OrientTdm.HomePage.Search.SearchDashbord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.searchDashbord',
    requires: [
        'OrientTdm.HomePage.Search.Search.LuceneSearchPanel',
        'OrientTdm.HomePage.Search.Model.LuceneFileExtModel'
    ],
    initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            model: "OrientTdm.HomePage.Search.Model.LuceneFileExtModel",
            autoLoad: false,
            proxy: {
                type: 'ajax',
                actionMethods: {
                    create: 'POST'
                },
                api: {
                    "read": Ext.isEmpty(me.queryUrl) ? serviceName + "/home/luceneSearch.rdm" : me.queryUrl
                },
                extraParams: {},
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    idProperty: 'fileid',
                    messageProperty: 'msg'
                },
                listeners: {}
            }
        });
        var footBar = {
            xtype: 'pagingtoolbar',
            store: store,
            dock: 'bottom',
            displayInfo: true
        };
        Ext.apply(me, {
            layout: 'border',
            items: [
                {
                    xtype: 'luceneSearchPanel',
                    region: 'north',
                    height: 80
                },
                {
                    xtype: 'grid',
                    dockedItems: [footBar],
                    store: store,
                    columns: [
                        {
                            header: '文件名称',
                            width: 200,
                            sortable: true,
                            dataIndex: 'filename',
                            filter: {
                                type: 'string'
                            }
                        }, {
                            header: '文件描述',
                            flex: 1,
                            sortable: true,
                            dataIndex: 'filedescription',
                            filter: {
                                type: 'string'
                            }
                        }, {
                            header: '文件大小',
                            width: 100,
                            sortable: true,
                            dataIndex: 'filesize',
                            renderer: function (v) {
                                return Ext.util.Format.fileSize(v);
                            }
                        }, {
                            header: '上传人',
                            width: 150,
                            sortable: true,
                            dataIndex: 'uploadUserName'
                        }, {
                            header: '上传时间',
                            width: 150,
                            sortable: true,
                            dataIndex: 'uploadDate'
                        }, {
                            header: '文件密级',
                            width: 150,
                            sortable: true,
                            dataIndex: 'filesecrecy'
                        }, {
                            xtype: 'actioncolumn',
                            align: 'center',
                            header: '下载',
                            width: 50,
                            items: [{
                                icon: serviceName + '/app/images/icons/default/common/download.png',
                                tooltip: '下载',
                                handler: function (grid, rowIndex, colIndex) {
                                    var id = grid.store.getAt(rowIndex).get('id');
                                    OrientExtUtil.FileHelper.doDownload(id);
                                }
                            }]
                        }
                    ],
                    plugins: [{
                        ptype: 'rowexpander',
                        selectRowOnExpand: true,
                        rowBodyTpl: new Ext.XTemplate(
                            '{content}')
                    }],
                    viewConfig: {
                        stripeRows: true,
                        listeners: {
                            refresh: function (view) {
                                var grid = view.up('grid');
                                grid.getStore().data.each(function (record, index) {
                                    var rowNode = view.getNode(index);
                                    var row = Ext.fly(rowNode, '_rowExpander');
                                    var isCollapsed = row.hasCls(grid.plugins[0].rowCollapsedCls);
                                    if (isCollapsed) {
                                        grid.plugins[0].toggleRow(index, record);
                                    }
                                });
                            }
                        }
                    },
                    region: 'center'
                }
            ]
        });
        me.callParent(arguments);
        this.addEvents('doSearch');
    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'doSearch', me.doSearch, me);
        me.callParent();
    },
    doSearch: function (keyWord) {
        var me = this.down('grid');
        var store = me.getStore();
        var proxy = store.getProxy();
        proxy.setExtraParam('keyWord', keyWord);
        store.load();
    }
});