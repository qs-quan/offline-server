/**
 * Created by enjoy on 2016/3/15 0015.
 * 模板管理首页
 */
Ext.define('OrientTdm.BackgroundMgr.DashBoard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.BackgroundMgrDashBord',
    requires:[
      "OrientTdm.BackgroundMgr.CodeGenerate.GenerateCodeForm"
    ],
    initComponent: function () {
        var me = this;
        /*var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [{
                iconCls: 'icon-create',
                text: '生成代码',
                itemId: 'generateCode',
                scope: this,
                handler: me.openGenerateCodeWin
            }]
        });*/
        Ext.apply(this, {
            title: '',//'简介',
            iconCls: 'icon-basicInfo',
            //dockedItems:[toolbar],
            html: ''//'<h1>模板管理...此处可也添加HTML，介绍功能点主要用途</h1>'
        });
        this.callParent(arguments);
    }/*,
    openGenerateCodeWin : function(){
        //弹出新增面板窗口
        var win = Ext.create('Ext.Window', Ext.apply({
            title:"代码生成器",
            plain: true,
            height: 0.7 * globalHeight,
            width: '70%',
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [
                Ext.create("OrientTdm.BackgroundMgr.CodeGenerate.GenerateCodeForm")
            ],
            buttons: [
            {
                text: '保存',
                handler: function () {
                    win.down("generateCodeForm").fireEvent("doGenerateCodeEvent",function(zipName){
                        var path = serviceName + "/codeTemplate/download.rdm?zipName=" + zipName+"&moduleName="+this.down("textfield[name=name]").getValue();
                        var h = screen.availHeight - 35;
                        var w = screen.availWidth - 5;
                        var vars = "top=0,left=0,height=" + h + ",width=" + w + ",status=no,toolbar=no,menubar=no,location=no,resizable=1,scrollbars=1";
                        window.open(path, '_blank', vars);
                        win.close();
                    });
                }
            }
        ]
        },{}));
        win.show();
    }*/
});