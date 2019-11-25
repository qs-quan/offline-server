Ext.define('OrientTdm.SysMgr.UserToolMgr.Common.CreateUserToolGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.createUserToolGrid',
    requires: [
        'OrientTdm.SysMgr.ToolMgr.Model.ToolExtModel'
    ],
    config: {
        toolGroupId: null
    },
    viewConfig: {
        stripeRows: true,
        autoFill: true,
        forceFit: true
    },
    initComponent: function () {
        var me = this;

        me.columns = [
            {
                header: '工具名称',
                flex: 1,
                sortable: true,
                dataIndex: 'toolName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '工具安装文件',
                width: 150,
                sortable: true,
                dataIndex: 'toolCode',
                renderer: function (value) {
                    var retVal = "";
                    if (!Ext.isEmpty(value)) {
                        var template = "<a target='_blank' class='attachment'  onclick='OrientExtUtil.FileHelper.doDownload(\"#fileId#\")' title='#title#'>#name#</a>";
                        var fileJson = Ext.decode(value);
                        var fileSize = fileJson.length;
                        Ext.each(fileJson, function (fileDesc, index) {
                            var fileId = fileDesc.id;
                            var fileName = fileDesc.name;
                            retVal += template.replace("#name#", fileName).replace("#title#", fileName).replace("#fileId#", fileId);
                            if (index != (fileSize - 1)) {
                                retVal += "</br>";
                            }
                        });
                    }
                    return retVal;
                }
            },
            {
                header: '工具版本',
                width: 60,
                sortable: true,
                dataIndex: 'toolVersion',
                filter: {
                    type: 'string'
                }
            }
        ];

        me.store = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.ToolMgr.Model.ToolExtModel',
            proxy: {
                type: 'ajax',
                url: serviceName + "/userTool/listUncreatedTools.rdm?toolGroupId=" + me.toolGroupId,
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            },
            autoLoad: true
        });

        me.selModel = Ext.create("Ext.selection.CheckboxModel", {
            mode: 'MULTI'
        });

        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: me.store,
            displayInfo: true,
            displayMsg: '{0} - {1} of {2}',
            emptyMsg: "没有数据"
        });

        me.callParent();
    },
    getSelectedIds: function() {
        var me = this;
        var sels = this.getSelectionModel().getSelection();
        var ids = [];
        for(var i=0; i<sels.length; i++) {
            var data = sels[i].raw;
            ids.push(data.id);
        }
        return ids;
    },
    refreshGrid: function () {
        this.getSelectionModel().clearSelections();
        var store = this.getStore();
        var lastOptions = store.lastOptions;
        store.reload(lastOptions);
    }
});