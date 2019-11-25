/**
 * Created by FZH  on 2016/10/24.
 */
Ext.define('OrientTdm.TestResourceMgr.StaffMgr.StaffGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.EquipmentGrid',
    config: {
        USER_STAFF_MAP: {}
    },
    requires: [

    ],
    initComponent: function () {
        var me = this;
        this.callParent(arguments);
    },
    afterInitComponent: function () {
        var me = this;

        var schemaId = me.modelDesc.dbName.split('_')[2];
        var modelId = me.modelDesc.modelId;
        me.USER_STAFF_MAP = {
            id: "C_XTYH_"+modelId,
            allName: "C_XM_"+modelId,
            sex: "C_XB_"+modelId,
            birthday: "C_SR_"+modelId,
            phone: "C_DH_"+modelId,
            mobile: "C_SJ_"+modelId,
            email: "C_YJ_"+modelId,
            post: "C_ZW_"+modelId,
            grade: "C_MJ_"+modelId
        };

        me.modelDesc.disAbleModifyColumns = ["T_RYFL_"+schemaId+"_ID"];
        me.modelDesc.disAbleAddColumns = ["T_RYFL_"+schemaId+"_ID"];

        var toolbar = me.dockedItems[0];
        var addButton = toolbar.child('[text=新增]');
        if(addButton){
            Ext.Function.interceptAfter(addButton, 'handler', function (button) {
                //新增表单出现后 相关定制
                var customPanel = button.orientBtnInstance.customPanel;
                if (customPanel) {
                    customPanel.USER_STAFF_MAP = me.USER_STAFF_MAP;
                    var userCmp = customPanel.down('[name=C_XTYH_' + modelId + ']');
                    if(userCmp){
                        userCmp.on('afterChange', me._doUserChange, customPanel);
                    }
                }
            });
        }
    },
    afterRender: function() {
        var me = this;
        this.callParent(arguments);

        var treeNode = me.bindNode;
        var tbomModels = treeNode.raw.tBomModels;
    },
    _doUserChange: function(user) {
        var me = this;
        if(!user || user.length==0) {
            return;
        }

        var modelId = me.modelDesc.modelId;
        var schemaId = me.modelDesc.dbName.split('_')[2];
        var userId = user[0].id;
        var staff = OrientExtUtil.ModelHelper.createDataQuery("T_SYRY", schemaId, [
            new CustomerFilter("C_XTYH_"+modelId, CustomerFilter.prototype.SqlOperation.Equal, "", userId)
        ]);
        if(staff && staff.length>0) {
            OrientExtUtil.Common.tip('提示', "该用户已添加到试验人员中，请不要重复操作！");
            var userCmp = me.down('[name=C_XTYH_' + modelId + ']');
            userCmp._clearValue();
            return;
        }

        var user = OrientExtUtil.SysMgrHelper.getUserInfo(userId, "");
        var vals = {};
        vals[me.USER_STAFF_MAP.allName] = user.allName;
        vals[me.USER_STAFF_MAP.sex] = user.sex;
        vals[me.USER_STAFF_MAP.birthday] = user.birthday;
        vals[me.USER_STAFF_MAP.phone] = user.phone;
        vals[me.USER_STAFF_MAP.mobile] = user.mobile;
        vals[me.USER_STAFF_MAP.email] = user.email;
        vals[me.USER_STAFF_MAP.post] = user.post;
        vals[me.USER_STAFF_MAP.grade] = user.grade;
        me.getForm().setValues(vals);
    }
});