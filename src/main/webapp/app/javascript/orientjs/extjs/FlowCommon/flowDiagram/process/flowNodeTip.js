/**
 * 流程节点的操作提示
 * cxk 20150831
 */
Ext.define('OrientTdm.FlowCommon.flowDiagram.process.flowNodeTip', {
    extend: 'Ext.Base',
    requires: [
        "OrientTdm.FlowCommon.flowDiagram.process.graphManager",
        "OrientTdm.FlowCommon.flowDiagram.process.flowConstants"
    ],
    config:{
        graphManager: null
    },
    constructor: function (config) {
        this.initConfig(config);
    },
    init: function (graph) {
        var me = this;
        var currentObj = null;
        $("div.vertexDiv").each(function () {
            $(this).bind({
                mouseenter: function () {
                    currentObj = $(this);
                }
            });
            currentObj = $(this);
            var attributes = me.getVertexAttri(graph, currentObj.attr("id")); //genAttrObj(currentObj);
            var html = me.getAttrHtml(attributes);
            title = "任务详细情况";
            $(this).qtip({
                content: {
                    text: html.join(''),
                    title: {
                        text: title
                    }
                },
                position: {
                    at: 'center',
                    target: 'event',
                    adjust: {
                        x: 20,
                        y: 0
                    },
                    viewport: $(window)
                },
                show: {
                    effect: function (offset) {
                        $(this).slideDown(200);
                    }
                },
                hide: {
                    event: 'click mouseleave',
                    leave: false,
                    fixed: true,
                    delay: 300
                },
                style: {
                    classes: 'ui-tooltip-bootstrap'
                }
            });
        });


        function clickHandler() {
            alert(1);
        }
    },
    getVertexAttri: function (graph, cellName) {
        var me = this;
        var layer = me.graphManager.getSpecificLayer(FlowConstants.FLOWDIAGRAM_LAYER);
        var children = layer.children;

        var cell;
        for (var i = 0; i < children.length; i++) {
            if (children[i].id == cellName) {
                cell = children[i];
                break;
            }
        }

        if (Ext.isEmpty(cell)) {
            return {};
        }

        var person = cell.flowAttrs.person;
        if (Ext.isEmpty(person)) person = "";
        var attributes = {
            id: cell.id,
            prjTaskId: cell.flowAttrs.prjTaskId,
            type: cell.flowAttrs.nodeType,
            title: cell.value,
            name: cell.value,
            assign: cell.flowAttrs.taskAssignee,
            assigneeType: cell.flowAttrs.assigneeType,
            candidate: cell.flowAttrs.candidate,
            groupIds: cell.flowAttrs.groupIds,
            assignRealName: person || cell.flowAttrs.assRealName,
            status: cell.flowAttrs.status,
            endTime: cell.flowAttrs.endTime,
            startTime: cell.flowAttrs.startTime
        };

        return attributes;
    },

    /**
     * 流程控制提示内容
     */
    getCtrlHtml: function (id, type) {
        var items = [];
        switch (type) {
            case "start":
                items = [{id: 'flowEvent', iconCls: 'edui-icon', text: '事件设置'}];
                break;
            case "end":
                items = [{id: 'flowEvent', text: '事件设置'}];
                break;
            case "task":
                items = [{id: '-'},
                    {id: 'flowRule', text: '跳转规则设置'},
                    {id: 'flowVote', text: '会签投票规则设置'},
                    {id: '-'},
                    {id: 'flowEvent', text: '事件设置'},
                    {id: 'flowDue', text: '任务催办设置'},
                    {id: '-'},
                    {id: 'informType', text: '通知方式'}];
                break;
        }
        if (!items)return;
        if (items.length == 0)return;
        var item, html = ['<div class="edui-menu-body">'];
        while (item = items.pop()) {
            if (item.id == '-') {
                html.push('<div class="edui-menuitem edui-menuseparator"><div class="edui-menuseparator-inner"></div></div>');
            }
            else {
                html.push('<div class="edui-menuitem edui-for-' + item.id + '" onmouseover="$(this).addClass(\'edui-state-hover\')" onmouseout="$(this).removeClass(\'edui-state-hover\')" onclick="clickHandler(this.id)" id="' + item.id + '"><div class="edui-box ' + item.iconCls + '"></div><div class="edui-box edui-label edui-menuitem-label">' + item.text + '</div></div>');
            }
        }
        html.push('</div>');
    },

    /**
     * 流程实例节点查看提示内容
     */
    getAttrHtml: function (attr) {
        html = ['<table class="taskInfoTable">' +
        '<tr><th>任务名称</th><td>' + attr.id + '</td><tr>'];
        if (attr.status == '未开始') {
            if (!Ext.isEmpty(attr.prjTaskId) && attr.prjTaskId != 'undefined') {
                html.push('<tr><th>执行人</th><td>' + attr.assignRealName + '<a href="javascript:void(0)" onclick="updateTaskAssign(\'' + attr.prjTaskId + '\',\'' + attr.assign + '\')">更改</a></td><tr>');
            }
            else {
                html.push('<tr><th>执行人</th><td>' + attr.assignRealName + '</td><tr>');
            }
        } else {
            html.push('<tr><th>执行人</th><td>' + attr.assignRealName + '</td><tr>');
        }
        if (attr.assigneeType != 'assignee' && Ext.isEmpty(attr.assignRealName)) {
            if (!Ext.isEmpty(attr.candidate)) {
                html.push("<tr><th>候选人（用户组）</th><td>" + attr.candidate + "</td><tr>");
            }
            else {
                html.push("<tr><th>候选人（角色组）</th><td>" + attr.groupIds + "</td><tr>");
            }
        }
        else {
            if (!Ext.isEmpty(attr.candidate) && attr.candidate != "null" && attr.candidate != "undefined") {
                //动态变更为多人处理
                html.push("<tr><th>候选人（用户组）</th><td>" + attr.candidate + "</td><tr>");
            }
        }

        html.push('<tr><th>开始时间</th><td>' + attr.startTime + '</td><tr>' +
            '<tr><th nowrap="nowrap">结束时间</th><td>' + attr.endTime + '</td><tr>' +
            '<tr><th>状态</th><td><font color="red">' + attr.status + '</font></td><tr>' +
            '</table>');
        return html;
    }
});

window.updateTaskAssign = function (taskId, assignUserId) {
    require.async("common/rdmWidget/window/userSelectionWin", function (userSelectionWin) {
        var win = userSelectionWin.init({
            title: '修改执行人',
            width: 600,
            height: 400
        }, {}, false, function (userSelectionModel) {
            var selectedUser = userSelectionModel.getSelected();
            if (selectedUser == null || typeof selectedUser === 'undefined') {
                Ext.Msg.alert("提示", "请选择一条记录！");
                return;
            }
            var userId = selectedUser.id;
            var userName = selectedUser.data.ALL_NAME;
            Ext.Ajax.request({
                method: "post",
                url: serviceName + "/projectManage/updateTaskAssign.rdm",
                params: {
                    dataId: taskId,
                    userId: userId
                },
                success: function (result, response) {
                    var ret = Ext.decode(result.responseText);
                    if (ret) {
                        Ext.Msg.alert("提示", "执行人更改成功！");
                        $("div.vertexDiv").each(function () {
                            var div = $(this);
                            if (div.attr('prjTaskId') == taskId) {
                                div.attr('assignRealName', userName);
                                var attrObj = genAttrObj(div);
                                var htmlText = getAttrHtml(attrObj);
                                title = "任务详细情况";
                                $(this).qtip({
                                    content: {
                                        text: htmlText.join(''),
                                        title: {
                                            text: title
                                        }
                                    },
                                    position: {
                                        at: 'center',
                                        target: 'event',
                                        adjust: {
                                            x: 20,
                                            y: 0
                                        },
                                        viewport: $(window)
                                    },
                                    show: {
                                        effect: function (offset) {
                                            $(this).slideDown(200);
                                        }
                                    },
                                    hide: {
                                        event: 'click mouseleave',
                                        leave: false,
                                        fixed: true,
                                        delay: 300
                                    },
                                    style: {
                                        classes: 'ui-tooltip-light ui-tooltip-shadow'
                                    }
                                });
                            }
                        })
                    }
                },
                failure: function () {

                }
            })
        });
        win.show();
    });
}
