<%--
  Created by IntelliJ IDEA.
  User: DuanDuanPan
  Date: 2016/8/3 0003
  Time: 14:08
  若要使用系统中基于Ext的相关组件，则需要include此jsp
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<html>
<head>
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="Shortcut Icon" href="${ctx}/app/images/orient.ico"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/styles/orient/portal.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/styles/orient/calendar.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/styles/orient/icon.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/styles/orient/chosenuserview.css"/>
    <link rel="stylesheet" type="text/css"
          href="${ctx}/app/javascript/lib/ext-4.2/examples/ux/statusbar/css/statusbar.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/ext-4.2/examples/shared/example.css"/>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext-4.2/examples/shared/include-ext.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext-4.2/examples/shared/examples.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext-4.2/locale/ext-lang-zh_CN.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/orientjs/extjs/Common/Util/OrientValidator.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/swfupload-2.5/swfupload.js"></script>
    <%--Orient Ext 基础依赖--%>
    <script type="text/javascript">
        //定义全局变量
        var serviceName = '<%=request.getContextPath()%>';
        var globalPageSize = '${globalPageSize}';

        //服务端参数
        Ext.Loader.setConfig({
            enabled: true
        });
        Ext.Loader.setPath({
            'OrientTdm': serviceName + '/app/javascript/orientjs/extjs',
            'Ext.ux': serviceName + '/app/javascript/lib/ext-4.2/examples/ux'
        });
    </script>
    <script type="text/javascript" src="${ctx}/app/javascript/orientjs/extjs/BaseRequires.js"></script>
</head>
<body>

</body>
</html>

