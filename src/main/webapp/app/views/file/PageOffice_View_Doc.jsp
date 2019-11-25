<%@page import="java.net.URLDecoder"%>
<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@page import="com.orient.edm.util.CommonTools"%>
<%@page import="com.zhuozhengsoft.pageoffice.OpenModeType"%>
<%@page import="com.zhuozhengsoft.pageoffice.PageOfficeCtrl"%>
<%@page import="com.zhuozhengsoft.pageoffice.ThemeType"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
    String contextPath = request.getContextPath();
	
	// �Ƿ���Ա༭
    boolean canEdit = CommonTools.null2String(request.getParameter("canEdit")).equals("true")?true:false;
	// �ļ�����
    String fileName = CommonTools.null2String(request.getParameter("fileName"));
	
	System.out.println("fileName" + fileName);
	// �ļ�·��
	String filePath = CommonTools.null2String(request.getParameter("filePath"));
	// �ļ�����
	String fileType = CommonTools.null2String(request.getParameter("fileType"));
    
    OpenModeType openModel = OpenModeType.docNormalEdit;
    
    if(fileType.toLowerCase().indexOf("doc") != -1) {
    	// doc
    	openModel = OpenModeType.docReadOnly;
	
    } else if(fileType.toLowerCase().indexOf("xls") != -1) {
    	// xls
    	openModel = OpenModeType.xlsReadOnly;
    	
    } else if(fileType.toLowerCase().indexOf("ppt") != -1) {
    	// ppt
    	openModel = OpenModeType.pptReadOnly;
    }
    
    System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>���ĵ�·����" + filePath);
    
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	
	// �������÷��ڴ�֮ǰ
	poCtrl1.setCaption(fileName);
	poCtrl1.setAllowCopy(false);//��ֹ����
	poCtrl1.setMenubar(false);//���ز˵���
	poCtrl1.setOfficeToolbars(false);//����Office������
	poCtrl1.setCustomToolbar(false);//�����Զ��幤����
	
	// ���ú�������
	poCtrl1.setJsFunction_AfterDocumentOpened("doAfterRender");
	poCtrl1.setJsFunction_AfterDocumentSaved("doAfterSaved");
	
	// ���÷�����
	poCtrl1.setServerPage(contextPath + "/poserver.zz");
	// ���ô򿪵��ĵ�
	poCtrl1.webOpen(filePath, openModel, "");
	// ����������ʽ
	poCtrl1.setTheme(ThemeType.CustomStyle);
	// ������Ⱦ��ǩ
	poCtrl1.setTagId("PageOfficeCtrl1");
	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=GBK">
		<title><%=fileName%></title>
		<script type="text/javascript">

			//ȫ��
			function doSetFullScreen() {
				document.getElementById("PageOfficeCtrl1").FullScreen = !document.getElementById("PageOfficeCtrl1").FullScreen;
			}
		  
			//�ĵ���֮����������
			function doAfterRender() { 
				document.getElementById("PageOfficeCtrl1").SetEnableFileCommand(4, false); //��ֹ���
	            document.getElementById("PageOfficeCtrl1").SetEnableFileCommand(5, false); //��ֹ��ӡ
	            document.getElementById("PageOfficeCtrl1").SetEnableFileCommand(6, false); //��ֹҳ������
	            document.getElementById("PageOfficeCtrl1").SetEnableFileCommand(8, false); //��ֹ��ӡԤ��
		  	}
			
		</script>
	</head>
	
	<body>
		<po:PageOfficeCtrl id="PageOfficeCtrl1"/>
	</body>
	
</html>