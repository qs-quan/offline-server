<%--
  Created by IntelliJ IDEA.
  User: enjoy
  Date: 2016/5/15 0015
  Time: 10:03
  To change this template use File | Settings | File Templates.
--%>
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
%>
<script type="text/javascript">
    var __ctx = '<%=request.getContextPath()%>';
    var __jsessionId = '<%=session.getId() %>';
    var fileAllName = '<%=request.getParameter("fileName")%>';
    //获取nginx服务信息
    var nginxUrl = "http://" + "<%=host%>" + ":" + "<%=nginxPort%>";
    //获取文件名称
    var fileName = fileAllName.substr(0, fileAllName.lastIndexOf("."));
    //获取hls路径
    var hlsUrl = nginxUrl + "/" + fileName + ".m3u8";
</script>
<html>
<head>
    <title>视频在线播放</title>
    <script type="text/javascript"
            src="${ctx}/app/javascript/lib/flashls/examples/flowplayer/flowplayer-3.2.12.min.js"></script>
    <script type="text/javascript"
            src="${ctx}/app/javascript/lib/flashls/examples/flowplayer/flowplayer.ipad-3.2.12.min.js"></script>
</head>
<body>
<a style="display: block;" id="flashls_vod"></a>
<script type="text/javascript">
    //TODO 集成支持hls协议的播放器
    flowplayer("flashls_vod", "<%=request.getContextPath()%>/app/javascript/lib/flashls/examples/flowplayer/flowplayer.swf", {
        plugins: {
            flashls: {
                url: '<%=request.getContextPath()%>/app/javascript/lib/flashls/bin/debug/flashlsFlowPlayer.swf'
            }
        },
        clip: {
            url: "<%=request.getContextPath()%>/preview/videoPreview/hls/out.m3u8",
            urlResolvers: "flashls",
            provider: "flashls"
        }
    }).ipad();
</script>
</body>
</html>
