/**
 * Created by dailin on 2019/8/13 1:45.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.TestTeamUserGridpanel', {
    extend: 'OrientTdm.SysMgr.RoleMgr.Common.AssignGrid',
    requires: [
        "OrientTdm.Common.Extend.Form.Field.OrientComboBoxTree"
    ],
    // 按道理config的配置可以直接用，但是不知道在没使用getter之前，无法获取
    config:{
        queryUrl: serviceName + '/TbomRoleController/getCanChooseUserIds.rdm',
        saveUrl: serviceName + '/TbomRoleController/saveRoleUsers.rdm'
    },

    initComponent: function () {
        var me = this;
        Ext.apply(me, {});
        me.queryUrl = serviceName + '/TbomRoleController/getCanChooseUserIds.rdm';
        me.saveUrl = serviceName + '/TbomRoleController/saveRoleUsers.rdm';
        this.callParent(arguments);
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
                    expanded: false
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

    createGridStore: function (columns) {
        var me = this;

        var fields = ['id'];
        Ext.each(columns, function (column) {
            fields.push(column.dataIndex);
        });
        return Ext.create("Ext.data.Store", {
            fields: fields,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": me.queryUrl
                },
                extraParams: {
                    roleId: me.roleId,
                    thId: me.thId,
                    assigned: me.assigned
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            }
        });
    },

    onSearchClick: function () {
        var me = this;
        var userName = this.down("textfield[name=userName]").getValue();
        var department = this.down("orientComboboxTree[name=department]").getValue();
        me.getStore().getProxy().setExtraParam("userName", userName);
        me.getStore().getProxy().setExtraParam("department", department);
        me.getStore().getProxy().setExtraParam("allName", userName);
        me.getStore().getProxy().setExtraParam("isSearch","true");
        me.getStore().load();
    },

    clearFilter: function () {
        var me = this;
        this.down("textfield[name=userName]").setValue('');
        this.down("orientComboboxTree[name=department]").setValue(null);
        me.onSearchClick();
    }

});