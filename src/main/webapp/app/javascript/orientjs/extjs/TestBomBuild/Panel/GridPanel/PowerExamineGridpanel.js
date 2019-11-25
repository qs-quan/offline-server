/**
 * modelGridPanel 只保留查询导出等（相当于只能读不可写）
 * Created by dailin on 2019/6/29 15:58.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.PowerExamineGridpanel',{
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.powerModelGridpanel',

    initComponent: function () {
        var me = this;
        me.customerFilter = [new CustomerFilter("T_RW_INFO_" + OrientExtUtil.FunctionHelper.getSchemaId() + "_ID", CustomerFilter.prototype.SqlOperation.In, "", me.dataId)]
        me.callParent(arguments);
    },

    createToolBarItems: function () {
        var me = this;
        var retVal = [];
        //获取模型操作描述
        var btns = me.modelDesc.btns;
        Ext.each(btns, function (btn) {

            if ((Ext.Array.contains(['详细','查询'], btn.name) && btn.issystem == 0) || (Ext.Array.contains(['查询全部','导出'], btn.name))) {
                retVal.push({
                    iconCls: 'icon-' + btn.code,
                    text: btn.name,
                    scope: me,
                    btnDesc: btn,
                    handler: Ext.bind(me.onGridToolBarItemClicked, me)
                });
                return;
            }
        });
        return retVal;
    }

});
