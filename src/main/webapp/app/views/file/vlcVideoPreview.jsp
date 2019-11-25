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
    //String mp4Url = nginxUrl + ctx + "/orientForm/videoDownload.rdm?fileId="+fileId+"&type=vlc";
    String mp4Url = nginxUrl + ctx + "/orientForm/videoDownload.rdm?fileId="+fileId+"&type=vlc";
%>
<script type="text/javascript">
    var __ctx = '<%=request.getContextPath()%>';
    var __jsessionId = '<%=session.getId() %>';
    var fileId = '<%=fileId%>';
    //获取nginx服务信息
    var nginxUrl = '<%=nginxUrl%>';
    //获取hls路径
    var mp4Url = '<%=mp4Url%>';
</script>
<html>
<head>
    <title>视频在线播放</title>
</head>
<body>
    <!--[if IE]>
    <object type='application/x-vlc-plugin' id='vlc' events='True' width="720" height="540"
            classid='clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921' codebase="http://downloads.videolan.org/pub/videolan/vlc/latest/win32/axvlc.cab">
        <param name='mrl' value='<%=mp4Url%>' />
        <param name='volume' value='50' />
        <param name='autoplay' value='true' />
        <param name='loop' value='false' />
        <param name='fullscreen' value='false' />
    </object>
    <![endif]-->
    <!--[if !IE]><!-->
    <object type='application/x-vlc-plugin' id='vlc' events='True' width="720" height="540"
            pluginspage="http://www.videolan.org" codebase="http://downloads.videolan.org/pub/videolan/vlc-webplugins/2.0.6/npapi-vlc-2.0.6.tar.xz">
        <param name='mrl' value='<%=mp4Url%>' />
        <param name='volume' value='50' />
        <param name='autoplay' value='true' />
        <param name='loop' value='false' />
        <param name='fullscreen' value='false' />
    </object>
<!--<![endif]-->
</body>
</html>
