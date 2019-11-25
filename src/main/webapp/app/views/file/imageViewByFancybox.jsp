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
    var nodeId = '<%=request.getParameter("nodeId")%>';
    var fileGroupId = '<%=request.getParameter("fileGroupId")%>';
</script>
<html>
<head>
    <title>图片控件</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/lightbox/dist/css/screen.css"/>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/jquery/jquery.js"></script>
    <script type="text/javascript" charset="utf-8" src="${ctx}/app/javascript/orientjs/common/util.js"></script>
    <script type="text/javascript"
            src="${ctx}/app/javascript/lib/fancyBox/lib/jquery.mousewheel.pack.js?v=3.1.3"></script>
    <script type="text/javascript"
            src="${ctx}/app/javascript/lib/fancyBox/source/jquery.fancybox.pack.js?v=2.1.5"></script>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/fancyBox/source/jquery.fancybox.css?v=2.1.5"
          media="screen"/>
    <link rel="stylesheet" type="text/css"
          href="${ctx}/app/javascript/lib/fancyBox/source/helpers/jquery.fancybox-buttons.css?v=1.0.5"/>
    <script type="text/javascript"
            src="${ctx}/app/javascript/lib/fancyBox/source/helpers/jquery.fancybox-buttons.js?v=1.0.5"></script>
    <link rel="stylesheet" type="text/css"
          href="${ctx}/app/javascript/lib/fancyBox/source/helpers/jquery.fancybox-thumbs.css?v=1.0.7"/>
    <script type="text/javascript"
            src="${ctx}/app/javascript/lib/fancyBox/source/helpers/jquery.fancybox-thumbs.js?v=1.0.7"></script>

    <script type="text/javascript">
        $(function () {
            $.ajax({
                url: __ctx + '/modelFile/list.rdm',
                async: true,
                type: 'POST',
                data: {
                    "modelId": modelId,
                    "dataId": dataId,
                    "nodeId": nodeId,
                    "fileGroupId": fileGroupId
                },
                success: function (data) {
                    var images = $.parseJSON(data).results;
                    $.each(images, function () {
                        $("div.image-set").append([
                            '<a class="fancybox-buttons example-image-link" href="' + __ctx + '/preview/imagePreview/' + this.finalname + '" data-fancybox-group="orientImage" title="'+this.filename+'" fileId="'+this.fileid+'">',
                            '<img class="example-image" src="' + __ctx + '/preview/imagePreview' + this.sFilePath + '" title="'+this.filename+'"></img>',
                            '</a>'
                        ].join(""));
                    });
                    $('.fancybox-buttons').fancybox({
                        openEffect: 'none',
                        closeEffect: 'none',
                        prevEffect: 'none',
                        nextEffect: 'none',
                        closeBtn: false,
                        helpers: {
                            title: {
                                type: 'inside'
                            },
                            buttons: {

                            },
                            thumbs: {
                                width: 50,
                                height: 50
                            }
                        },
                        afterLoad: function () {
                            this.title = 'Image ' + (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
                        }
                    });
                }
            });
        });
    </script>
</head>
<body>
<div class="image-row">
    <div class="image-set"></div>
</div>
</body>
</html>
