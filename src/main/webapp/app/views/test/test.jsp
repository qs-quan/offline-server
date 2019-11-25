<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ page import="com.orient.edm.init.Config" %>
<%@ page import="com.orient.edm.util.SessionUtil" %>
<%@ page isELIgnored="false" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Pragma", "no-cache");
    response.setDateHeader("Expires", 0);
    // 系统根
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";

    String theme = Config.CSS_THEME;
    String lang = Config.Lang;

%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>

    <title></title>
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="Shortcut Icon" href="${ctx}/app/images/orient.ico"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/styles/orient/portal.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/styles/orient/calendar.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/styles/orient/icon.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/styles/orient/chosenuserview.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/styles/orient/knowledge.css">
    <link rel="stylesheet" type="text/css"
          href="${ctx}/app/javascript/lib/ext-4.2/examples/ux/statusbar/css/statusbar.css"/>


    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/ext3.4/resources/css/ext-all.css">
    <link rel="Stylesheet" type="text/css" href="${ctx}/app/javascript/lib/ext3.4/resources/css/xtheme-<%=theme%>.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/ext3.4/ux/css/Spinner.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/ext3.4/ux/css/LockingGridView.css"/>
    <link rel="stylesheet" type="text/css"
          href="${ctx}/app/javascript/lib/ext3.4/ux/fileuploadfield/css/fileuploadfield.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/ext3.4/ux/css/examples.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/ext3.4/ux/css/Portal.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/ext3.4/ux/statusbar/css/statusbar.css"/>
    <link rel="stylesheet" type="text/css"
          href="${ctx}/app/javascript/lib/ext3.4/ux/lovCombo/css/Ext.ux.form.LovCombo.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/ext3.4/ux/treegrid/EditTreeGrid.css"/>

    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext3.4/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext3.4/ext-all-debug-w-comments.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext3.4/ux/Spinner.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext3.4/ux/SpinnerField.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext3.4/ux/miframe-min.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext3.4/ext-basex.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext3.4/ux/examples.js"></script>

    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext3.4/ux/TabCloseMenu.js"></script>
    <script type="text/javascript"
            src="${ctx}/app/javascript/lib/ext3.4/ux/fileuploadfield/FileUploadField.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext3.4/ux/Portal.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext3.4/ux/PortalColumn.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext3.4/ux/Portlet.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext3.4/ux/RowExpander.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext3.4/src/locale/ext-lang-zh_CN.js"
            charset="utf-8"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/orientjs/extjs/knowledge/util/fileOperation.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/orientjs/extjs/knowledge/util/map.js"></script>
    <script type="text/javascript"
            src="${ctx}/app/javascript/lib/fusionChartsV3/fusionCharts/js/FusionCharts.js"></script>

    <script type="text/javascript" src="${ctx}/app/javascript/lib/swfupload-2.5/swfupload.js"></script>

    <script type="text/javascript" src="${ctx}/app/javascript/lib/jquery/jquery-1.7.2.min.js"></script>
    <script type="text/javascript">
        var contextPath = '<%=path%>';
        var serverBathPath = '<%=basePath%>';
        var serviceName = '<%=request.getContextPath()%>';
        mxBasePath = serviceName + '/jslib/mxgraph/src';
        var curModule = '<%=request.getAttribute("curModule")%>';
        var commentScoreValue = 5;

    </script>


    <script type="text/javascript" src="${ctx}/app/javascript/lib/seajs/sea.js"></script>

</head>

<body>
<script type="text/javascript">

    // seajs配置
    seajs.config({
        base: serviceName + '/app/javascript/orientjs/extjs/knowledge',
        charset: 'utf-8',
        timeout: 20000,
        debug: true,
        paths: {
            'lib': serviceName + "/app/javascript/lib"
        }
    });
    // 加载知识库的主界面模块，并使用Ext进行渲染
    seajs.use(['mainPanel'], function (mainPanel) {
        Ext.onReady(function () {
                mainPanel.init()
            }
        )

    });

</script>
</body>
</html>
