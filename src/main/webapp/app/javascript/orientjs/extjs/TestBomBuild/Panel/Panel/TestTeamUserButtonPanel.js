/**
 * 单独写这个界面是因为复用原界面，参数无法修改，会容易混淆参数
 * 按钮界面，实现添加，删除用户的方法
 * Created by dailin on 2019/8/13 14:28.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.Panel.TestTeamUserButtonPanel',{
    extend: 'OrientTdm.SysMgr.RoleMgr.Common.AssignPanel',

    doRefreshStore: function () {
        var me = this;
        var sonPanels = this.query("assignGrid");
        Ext.each(sonPanels, function (sonPanel) {
            sonPanel.getStore().getProxy().setExtraParam("relationId", me.relationId);
            sonPanel.getStore().load();
        });
    },

    saveAssign: function (selectedIds, direction) {
        var me = this;
        var unselectedGrid = me.down("assignGrid[assigned=false]");
        var saveUrl = unselectedGrid.saveUrl;
        OrientExtUtil.AjaxHelper.doRequest(saveUrl, {
            selectedIds: selectedIds,
            direction: direction,
            roleId: me.roleId,
            thId: me.thId
        }, false, function (resp) {
            var respData = resp.decodedData;
            if (respData.success == true) {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.assignSuccess);
                me.fireEvent("activate");
                me.assignCallback(selectedIds, direction);
            } else
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, Ext.isEmpty(respData.msg)? OrientLocal.prompt.assignFail : respData.msg);
        });
    }
});