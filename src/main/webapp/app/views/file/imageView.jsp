<%--
  Created by IntelliJ IDEA.
  User: enjoy
  Date: 2016/5/9 0009
  Time: 9:14
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<script type="text/javascript">
    var __ctx = '<%=request.getContextPath()%>';
    var __jsessionId = '<%=session.getId() %>';
    var modelId = '<%=request.getParameter("modelId")%>';
    var dataId = '<%=request.getParameter("dataId")%>';
    var fileGroupId = '<%=request.getParameter("fileGroupId")%>';
</script>
<html>
<head>
    <title>图片控件</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/lightbox/dist/css/lightbox.min.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/lightbox/dist/css/screen.css"/>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/jquery/jquery.js"></script>
    <script type="text/javascript" charset="utf-8" src="${ctx}/app/javascript/orientjs/common/util.js"></script>
    <script type="text/javascript">
        $(function () {
            $.ajax({
                url: __ctx + '/modelFile/list.rdm',
                async: true,
                data: {
                    "modelId": modelId,
                    "dataId": dataId,
                    "fileGroupId": fileGroupId
                },
                success: function (data) {
                    var images = $.parseJSON(data).results;
                    $.each(images, function () {
                        $("div.image-set").append([
                            '<a class="example-image-link" href="' + __ctx + '/preview/imagePreview' + this.filePath + '" data-lightbox="orientImage" data-title="' + this.filename + '">',
                            '<img class="example-image" src="' + __ctx + '/preview/imagePreview' + this.sFilePath + '"></img>',
                            '</a>'
                        ].join(""));
                    });
                }
            });
        });
    </script>
</head>
<body>
<script type="text/javascript" src="${ctx}/app/javascript/lib/lightbox/dist/js/lightbox.min.js"></script>
<div class="image-row">
    <div class="image-set"></div>
</div>
</body>
</html>
