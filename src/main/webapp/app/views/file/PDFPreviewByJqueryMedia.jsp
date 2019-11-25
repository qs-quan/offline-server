<%--
  Created by IntelliJ IDEA.
  User: GNY
  Date: 2018/4/27
  Time: 10:40
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
    String fileId = (String) request.getAttribute("fileId");
%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<html>
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/jquery/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/jqueryMedia/jquery.media.js"></script>
    <script type="text/javascript">
        $(function () {
            $('media').media({width: 700, height: 700});
        })
    </script>
</head>
<body>
    <iframe src="${ctx}/modelFile/showPDF.rdm?fileId=${fileId}" style="width: 100%;height: 100%" id="media"></iframe>
</body>
</html>
