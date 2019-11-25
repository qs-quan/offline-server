/**
 * Created by Seraph on 16/7/11.
 */
Ext.define("OrientTdm.Collab.common.team.roleUserMng.AssignUserGrid", {
    extend: 'OrientTdm.SysMgr.RoleMgr.Common.AssignGrid',
    //查询url
    queryUrl: serviceName + '/collabTeam/usersToAssign.rdm',
    //保存url
    saveUrl: serviceName + '/collabTeam/saveAssignedUsers.rdm',
    requires: [
        "OrientTdm.Common.Extend.Form.Field.OrientComboBoxTree"
    ],
    initComponent: function () {
        var me = this;
        Ext.apply(me, {});
        this.callParent(arguments);
    },
    createGridColumns: function () {
        return [
            {
                header: '用户名',
                sortable: true,
                dataIndex: 'userName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '真实姓名',
                flex: 1,
                sortable: true,
                dataIndex: 'allName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '部门',
                flex: 1,
                sortable: true,
                dataIndex: 'department'
            }
        ];
    },
    createGridToolBar: function () {
        var me = this;
        //增加查询过滤
        return Ext.create('Ext.toolbar.Toolbar', {
            items: [{
                name: 'userName',
                xtype: 'textfield',
                fieldLabel: '名称',
                margin: '0 5 5 0',
                labelWidth: 50,
                width: "38%"
            }, {
                xtype: 'orientComboboxTree',
                name: 'department',
                fieldLabel: '部门',
                margin: '0 5 5 0',
                grow: true,
                root: {
                    text: 'root',
                    id: '-1',
                    expanded: true
                },
                url: serviceName + '/dept/getByPid.rdm',
                displayField: "text",
                valueField: "id",
                width: "38%",
                labelWidth: 50
            }, {
                iconCls: 'icon-search',
                text: '查询',
                disabled: false,
                itemId: 'search',
                scope: me,
                handler: me.onSearchClick
            }, {
                iconCls: 'icon-clear',
                text: '清空',
                disabled: false,
                itemId: 'clear',
                scope: me,
                handler: me.clearFilter
            }]
        });
    },
    onSearchClick: function () {
        var me = this;
        var userName = this.down("textfield[name=userName]").getValue();
        var department = this.down("orientComboboxTree[name=department]").getValue();
        me.getStore().getProxy().setExtraParam("userName", userName);
        me.getStore().getProxy().setExtraParam("department", department);
        me.getStore().getProxy().setExtraParam("allName", userName);
        me.getStore().load();
    },
    clearFilter: function () {
        var me = this;
        this.down("textfield[name=userName]").setValue('');
        this.down("orientComboboxTree[name=department]").setValue(null);
        me.onSearchClick();
    }
});