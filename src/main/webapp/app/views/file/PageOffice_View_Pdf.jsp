<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@ page import="com.zhuozhengsoft.pageoffice.PDFCtrl"%>
<%@ page import="com.zhuozhengsoft.pageoffice.ThemeType"%>
<%@page import="com.orient.edm.util.CommonTools"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
    String contextPath = request.getContextPath();

	// �ļ�����
	String fileName = CommonTools.null2String(request.getParameter("fileName"));
	// �ļ�·��
	String filePath = CommonTools.null2String(request.getParameter("filePath"));
    
    System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>���ĵ�·����" + filePath);
    
	// ����PDFCtrl�ؼ�����
	PDFCtrl pdfCtrl = new PDFCtrl(request);
	
	pdfCtrl.setCaption(fileName);
	pdfCtrl.setCustomToolbar(false);
	pdfCtrl.setMenubar(false);
	
	// ���÷�����ҳ��
	pdfCtrl.setServerPage(request.getContextPath() + "/poserver.zz");
	// ����������ʽ
	pdfCtrl.setTheme(ThemeType.CustomStyle);
	// ���ù���
	pdfCtrl.addCustomToolButton("ȫ��/��ԭ", "doSetFullScreen()", 4);
	//���ý�ֹ����
	pdfCtrl.setAllowCopy(false);
	
	// ���ô��ĵ�
	pdfCtrl.webOpen(filePath);
	pdfCtrl.setTagId("PDFCtrl1");
	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=GBK">
		<title><%=fileName%></title>
		<script type="text/javascript">
		
		  //ȫ��
		  function doSetFullScreen() {
		      document.getElementById("PDFCtrl1").FullScreen = !document.getElementById("PDFCtrl1").FullScreen;
		  }
		  
		</script>
	</head>
	
	<body>
		<po:PDFCtrl id="PDFCtrl1"/>
	</body>
	
</html>