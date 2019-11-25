<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@include file="/app/views/include/ExtEnvironment.jsp" %>
<%

%>
<html>
<head>
    <title>试验数据管理系统</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/awesome/css/font-awesome.min.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/buttons/css/buttons.css"/>
    <script type="text/javascript" src="${ctx}/app/javascript/orientjs/extjs/portal.js"></script>

</head>

<script type="text/javascript">
    //全局最大寬度 高度
    var globalWidth = Ext.getBody().getViewSize().width;
    var globalHeight = Ext.getBody().getViewSize().height;

    var userId = ${userId};

    Ext.onReady(function () {
        Ext.tip.QuickTipManager.init();
        Ext.create('OrientTdm.Portal');
    });

</script>
<body>
<div id="_id_north_el" class="x-hidden north_el">
    <table width="100%">
        <tr>
            <%-- TODO 这里需要替换 top 背景 --%>
            <td width="420px"><img src="app/images/logo/left-logo.png"></td>
            <td align="left">
                <div class="button-group">
                </div>
            </td>
            <td align="right" style="padding: 5px;" width="600px">
                <table style="border-spacing: 1px;">
                    <tr>
                        <td colspan="4" class="main_text">
                            <nobr>
                                <i class="fa fa-rss"></i> ${date} ${week} <span id="rTime"></span>
                            </nobr>
                        </td>
                    <tr>
                    <tr align="right">
                        <td>
                            <font size="1"> 欢迎您, ${userAllName}.
                                所属部门:${deptName}</font></td>
                    </tr>
                    <tr align="right">
                        <td>
                            <a class="button-small button-pill" href="${ctx}/doLogout.rdm">
                                <i class="fa fa-power-off"></i> 退出
                            </a>
                        </td>
                    <tr>
                </table>
            </td>
        </tr>
    </table>
</div>

<div id="baseDivid">
    <iframe scrolling=auto id='hiddenPanelframe' frameborder=0 height="0" width="0"></iframe>
</div>

<link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/codemirror/lib/codemirror.css"/>
<link rel="stylesheet" type="text/css"
      href="${ctx}/app/javascript/orientjs/extjs/FlowCommon/flowDiagram/assets/css/mxgraph.css"/>
<link href="${ctx}/app/javascript/lib/ext-gantt/resources/css/sch-gantt-all.css" rel="stylesheet" type="text/css"/>
<link href="${ctx}/app/javascript/lib/ext-gantt/resources/css/custom.css" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/jquery/css/jquery.qtip.css"/>

<script type="text/javascript" src="${ctx}/app/javascript/lib/plotly-1.7.0/dist/plotly.js"></script>
<script src="${ctx}/app/javascript/lib/ext-gantt/gnt-all-debug.js" type="text/javascript"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/mxgraph/src/debug/mxClient.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/jquery/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/jquery/jquery.qtip.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/buttons/js/buttons.js"></script>
<%--富文本框--%>
<script type="text/javascript" src="${ctx}/app/javascript/lib/ckeditor/ckeditor.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/codemirror/lib/codemirror.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/codemirror/mode/sql/sql.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/codemirror/mode/javascript/javascript.js"></script>
<%--绘图--%>
<script type="text/javascript" src="${ctx}/app/javascript/lib/echart/echarts.min.js"></script>

</body>
</html>
