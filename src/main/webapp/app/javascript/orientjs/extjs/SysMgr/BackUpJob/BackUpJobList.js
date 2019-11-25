/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.BackUpJob.BackUpJobList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.backUpJobList',
    requires: [
        "OrientTdm.SysMgr.BackUpJob.Model.BackUpJobExtModel"
    ],
    config: {},
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: function () {
        this.getSelectionModel().on('selectionchange', this.rowselect, this);
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            iconCls: 'icon-delete',
            text: '批量删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.onDeleteClick
        }];
        me.actionItems = [{
            iconCls: 'icon-stopJob',
            text: '暂停定时任务',
            disabled: false,
            itemId: 'pause',
            scope: this,
            handler: this.onPauseClick
        }, {
            iconCls: 'icon-recoverJob',
            text: '恢复定时任务',
            disabled: false,
            itemId: 'resume',
            scope: this,
            handler: this.onResumeClick
        }, {
            iconCls: 'icon-delete',
            text: '删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.onDeleteClick
        }];
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '定时任务名称',
                width: 200,
                sortable: true,
                dataIndex: 'backname'
            }, {
                header: '定时任务策略',
                flex: 1,
                sortable: true,
                dataIndex: 'id',
                renderer: function (value, column, record) {
                    var retVal = "";
                    if (record.get("isdayback") == "1") {
                        retVal = "每天" + record.get("daybacktime") + "执行备份";
                    } else if (record.get("isweekback") == "1") {
                        retVal = "每周星期" + record.get("weekbackday") + "的" + record.get("weekbacktime") + "-执行备份";
                    } else if (record.get("ismonthback") == "1") {
                        retVal = "每月" + "第" + record.get("monthbackday") + "天的" + record.get("monthbacktime") + "-执行备份";
                    }
                    return retVal;
                }
            },
            {
                header: '定时任务状态',
                width: 100,
                align:'center',
                dataIndex: 'backtype',
                renderer: function (value) {
                        var retVal = "";
                    if ("1" == value) {
                        retVal = "<input align=center type=image src="+serviceName+"/app/images/icons/default/system/recoverJob.png>";
                        //retVal="正常";
                    } else if ("2" == value) {
                        retVal = "<input align=center type=image src="+serviceName+"/app/images/icons/default/system/stopJob.png>";
                        //retVal="暂停";
                    }
                    return retVal;
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.BackUpJob.Model.BackUpJobExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/BackUpJob/list.rdm',
                    "create": serviceName + '/BackUpJob/create.rdm',
                    "update": serviceName + '/BackUpJob/update.rdm',
                    "delete": serviceName + '/BackUpJob/delete.rdm'
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
        this.store = retVal;
        return retVal;
    },
    onPauseClick: function () {
        var me = this;
        var selections = this.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else {
            var jobIds = OrientExtUtil.GridHelper.getSelectRecordIds(me);
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/BackUpJob/saveJobStatus.rdm', {
                jobIds: jobIds,
                status: '2'
            }, true, function () {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.pauseSuccess);
                me.fireEvent("refreshGrid");
            });
        }
    },
    onResumeClick: function () {
        var me = this;
        var selections = this.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else {
            var jobIds = OrientExtUtil.GridHelper.getSelectRecordIds(me);
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/BackUpJob/saveJobStatus.rdm', {
                jobIds: jobIds,
                status: '1'
            }, true, function () {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.resumeSuccess);
                me.fireEvent("refreshGrid");
            });
        }
    },
    rowselect: function (sm, records) {
        var statusArray = [];
        Ext.each(records, function (record) {
            var status = record.get("backtype");
            if (!Ext.Array.contains(statusArray, status)) {
                statusArray.push(status);
            }
        });
        //禁用按钮
       /* this.down("button[itemId=pause]").setDisabled(true);
        this.down("button[itemId=resume]").setDisabled(true);
        if (statusArray.length == 1) {
            var status = statusArray[0];
            if ("1" == status) {
                this.down("button[itemId=pause]").setDisabled(false);
            } else if ("2" == status) {
                this.down("button[itemId=resume]").setDisabled(false)
            }
        }*/
    },
    _initActionColumns: function () {
        var me = this;
        var retVal = null;
        if (me.actionItems.length > 0) {
            var items = [];
            var index = 0;
            Ext.each(me.actionItems, function (actionItem) {
                items.push({
                    iconCls: actionItem.iconCls,
                    tooltip: actionItem.text,
                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.store.getAt(rowIndex);
                        me.getSelectionModel().deselectAll();
                        me.getSelectionModel().select(record, false, true);
                        var scope = actionItem.scope || actionItem;
                        actionItem.handler.apply(scope, arguments);

                    }
                });
                if (index < me.actionItems.length - 1) {
                    items.push(' ');
                }
                index++;
            });
            var width = 30 * ((items.length + items.length - 1) / 2);
            retVal = {
                xtype: 'actioncolumn',
                text: '操作',
                align: 'center',
                width: width < 50 ? 50 : width,
                items: items,
                renderer:function( meta,column, record){
                    var status = record.get("backtype");
                    if(status=="1"){
                        items[2].disabled=true;
                        items[0].disabled=false;
                    }else {
                        items[0].disabled=true;
                        items[2].disabled=false;
                    }
                }
            };
        }
        return null == retVal ? [] : [retVal];
    }
});