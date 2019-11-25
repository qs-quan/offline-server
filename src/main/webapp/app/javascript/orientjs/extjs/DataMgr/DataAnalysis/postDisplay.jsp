<%@ page language="java" contentType="text/html;charset=GBK"%>
<%@ page isELIgnored="false" %>
<%
	String contextPath = request.getContextPath();
	String metaxml = request.getParameter("metaxml");
	System.out.println(metaxml);
%>
<html>
<head> 
<title>
post绘图
</title>
<meta http-equiv=Pragma content=no-cache>
<meta http-equiv=Cache-Control content=no-cache>
<meta http-equiv=Expires content=0>
<meta http-equiv="Content-Type" content="text/html; charset=GBK" />
<script language="javascript">
	
</script>
</head>
<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
	<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
	  <tr>
	    <td width="100%" align="center">
			<object  classid="clsid:879AF47E-2DDF-44AA-8C91-2DE2F50FB215" codebase="<%=contextPath%>/app/javascript/orientjs/extjs/DataMgr/DataAnalysis/tdmpost.cab" id="TDMPost" width="100%" height="100%">
				<param name="StartMode" value="webstart">
				<param name="IpAddress" value="${param.SocketIP}">
				<param name="Port" value="${param.SocketPort}">
				<param name="UserID" value="${param.userid}">
				<param name="XmlFileName" value=${param.metaxml}>
			</object>
	     </td>
	  </tr>
	</table>
</body>
</html>