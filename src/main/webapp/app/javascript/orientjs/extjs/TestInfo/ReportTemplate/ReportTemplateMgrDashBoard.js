/**
 * 报告模板管理
 * Created by dailin on 2019/8/24 20:55.
 */

Ext.define('OrientTdm.TestInfo.ReportTemplate.ReportTemplateMgrDashBoard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.reportTemplateMgrDashBoard',
    initComponent: function () {
        var me = this;
        var hasBar = me.hasBar == undefined ? true : false;
        var centerPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
            region: 'center',
            layout: 'fit',
            activeTabName : '',
            padding: '0 0 0 5'
        });

        var leftPanel = Ext.create('OrientTdm.TestInfo.ReportTemplate.Tree.ReportTemplateTree', {
            itemId: 'reportTemplateTree',
            bodyStyle: 'overflow-x:hidden; overflow-y:scroll',
            useArrows: false,
            hasBar: hasBar,
            rootVisible: false,
            isShowCruBtn: true,
            collapsible: true,
            width: 280,
            region: 'west',
            isTemplate: me.upId != undefined,
            title: me.upId != undefined ? '选择 <span class="icon-dir-node">__</span> 试验类型后导入' : '',
            upup: me
        });

        var param = {
            layout: 'border',
            items: [leftPanel, centerPanel],
            westPanel: leftPanel,
            centerPanel: centerPanel
        }
        if(me.upId != undefined){
            param.id = me.upId
        }
        Ext.apply(this, param);

        this.callParent(arguments);
    }
});