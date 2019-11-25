<%@ page contentType="text/html;charset=UTF-8" language="java" import="java.util.*,
                                                                       com.orient.edm.init.FileServerConfig,
                                                                       com.orient.edm.init.OrientContextLoaderListener" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<%
    //文件服务器信息
    FileServerConfig fileServerConfig = (FileServerConfig) OrientContextLoaderListener.Appwac.getBean("fileServerConfig");
    String nginxPort = fileServerConfig.getNginxPort();
    //当前IP
    String host = request.getLocalAddr();
    String ctx = request.getContextPath();
    String fileId = request.getParameter("fileId");
    //获取nginx服务信息
    String nginxUrl = "http://" + host + ":" + nginxPort;
    //获取mp4路径
    String mp4Url = nginxUrl + ctx + "/orientForm/videoDownload.rdm?fileId="+fileId+"&type=ck";
    String pngUrl = nginxUrl + ctx + "/orientForm/pngDownload.rdm?fileId="+fileId+"&type=png";
%>
<html>
<head>
    <title>视频在线播放</title>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/javascript/lib/ext-4.2/resources/css/ext-all.css"/>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext-4.2/ext-all.js"></script>

    <script type="text/javascript"
            src="${ctx}/app/javascript/lib/ckplayer/ckplayer.js" charset="utf-8"></script>

    <script type="text/javascript">
        var __ctx = '<%=request.getContextPath()%>';
        var __jsessionId = '<%=session.getId() %>';
        var fileId = '<%=fileId%>';
        //获取nginx服务信息
        var nginxUrl = '<%=nginxUrl%>';
        //获取hls路径
        var mp4Url = '<%=mp4Url%>';
        var pngUrl = '<%=pngUrl%>';

        window.onload = function() {
            var globalWidth = Ext.getBody().getViewSize().width;
            var globalHeight = Ext.getBody().getViewSize().height;
            var flashvars = {
                f: mp4Url,
                c: 0,
                i: pngUrl,
                h: 3,
                b: 0
            };
            var params={
                bgcolor: '#FFF',
                allowFullScreen: true,
                allowScriptAccess: 'always',
                wmode: 'transparent'
            };
            CKobject.embedSWF('${ctx}/app/javascript/lib/ckplayer/ckplayer.swf','player','ckplayer_player',globalWidth,globalHeight,flashvars,params);
        }
    </script>

    <style type="text/css">

    </style>
</head>
<body>
    <div id="player"></div>

</body>
</html>
