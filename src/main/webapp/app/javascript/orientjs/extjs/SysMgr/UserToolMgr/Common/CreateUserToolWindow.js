Ext.define('OrientTdm.SysMgr.UserToolMgr.Common.CreateUserToolWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.createUserToolWin',
    requires: [
        'OrientTdm.SysMgr.UserToolMgr.Common.CreateUserToolGrid'
    ],
    config: {
        toolGroupId: null,
        userToolGrid: null
    },
    height: globalHeight * 0.6,
    width: globalWidth * 0.6,
    plain: true,
    modal: true,
    layout: 'fit',
    title: '新增用户工具',
    closeAction: 'destroy',
    initComponent: function () {
        var me = this;
        var createUserToolGrid = Ext.create("OrientTdm.SysMgr.UserToolMgr.Common.CreateUserToolGrid", {
            toolGroupId: me.toolGroupId
        });

        Ext.apply(me, {
            createUserToolGrid: createUserToolGrid,
            items: [createUserToolGrid],
            buttons: [{
                text: '确定',
                iconCls: 'icon-save',
                handler: function () {
                    var sels = createUserToolGrid.getSelectedIds();
                    if(sels.length == 0) {
                        Ext.MessageBox.alert("提示", "请选择至少一条记录");
                        return;
                    }
                    me.createUserTool(sels);
                }
            }, {
                text: '关闭',
                iconCls: 'icon-close',
                handler: function () {
                    me.close();
                }
            }]
        });
        me.callParent();
    },
    createUserTool: function(ids) {
        var me = this;
        var wait = Ext.MessageBox.wait("正在新增用户工具，请稍后...", "新增用户工具", {text: "请稍后..."});
        Ext.Ajax.request({
            url : serviceName + "/userTool/create.rdm",
            method : 'POST',
            jsonData: Ext.encode(ids),
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            success : function(response, options) {
                wait.hide();
                var data = response.decodedData;
                me.userToolGrid.fireEvent("refreshGrid");
                me.close();
            },
            failure : function(result, request) {
                wait.hide();
                Ext.MessageBox.alert("错误", "新增用户工具出错");
            }
        });
    }
});