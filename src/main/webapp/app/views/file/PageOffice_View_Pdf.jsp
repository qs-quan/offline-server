<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ page import="com.zhuozhengsoft.pageoffice.PDFCtrl"%>
<%@ page import="com.zhuozhengsoft.pageoffice.ThemeType"%>
<%@page import="com.orient.edm.util.CommonTools"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
    String contextPath = request.getContextPath();

	// 文件名称
	String fileName = CommonTools.null2String(request.getParameter("fileName"));
	// 文件路径
	String filePath = CommonTools.null2String(request.getParameter("filePath"));
    
    System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>打开文档路径：" + filePath);
    
	// 定义PDFCtrl控件对象
	PDFCtrl pdfCtrl = new PDFCtrl(request);
	
	pdfCtrl.setCaption(fileName);
	pdfCtrl.setCustomToolbar(false);
	pdfCtrl.setMenubar(false);
	
	// 设置服务器页面
	pdfCtrl.setServerPage(request.getContextPath() + "/poserver.zz");
	// 设置主题样式
	pdfCtrl.setTheme(ThemeType.CustomStyle);
	// 设置工具
	pdfCtrl.addCustomToolButton("全屏/还原", "doSetFullScreen()", 4);
	//设置禁止拷贝
	pdfCtrl.setAllowCopy(false);
	
	// 设置打开文档
	pdfCtrl.webOpen(filePath);
	pdfCtrl.setTagId("PDFCtrl1");
	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=GBK">
		<title><%=fileName%></title>
		<script type="text/javascript">
		
		  //全屏
		  function doSetFullScreen() {
		      document.getElementById("PDFCtrl1").FullScreen = !document.getElementById("PDFCtrl1").FullScreen;
		  }
		  
		</script>
	</head>
	
	<body>
		<po:PDFCtrl id="PDFCtrl1"/>
	</body>
	
</html>