/**
 * 情报部门的导入数据按钮，算是某个特定情况下的定制
 * Created by dailin on 2019/4/24 11:39.
 */

Ext.define('OrientTdm.TestBomBuild.Button.PowerImportButton',{
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    triggerClicked: function (modelGridPanel) {
        // 先写成这样，excel需要有个确定的excel来试一试，解析应该可以，关键看回调的显示
        var me = this;
        var uploadImportFilePanel = Ext.create('OrientTdm.DataMgr.Import.UploadImportFilePanel', {
            actionUrl: serviceName + '/powerDataImportExport/uploadAndAnalysis.rdm',
            successCallback: function (resp) {
                this.up('window').close();
                OrientExtUtil.Common.info('提示','解析成功');
            }
        });
        // 将文件导入的一些信息放在window上
        var win = Ext.create('Ext.Window', {
            plain: true,
            title: '导入数据',
            maximizable: false,
            modal: true,
            items: [
                uploadImportFilePanel
            ]
        });
        win.show();
    }
});

