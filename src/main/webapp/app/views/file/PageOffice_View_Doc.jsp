<%@page import="java.net.URLDecoder"%>
<%@ page language="java" contentType="text/html; charset=GBK"%>
<%@page import="com.orient.edm.util.CommonTools"%>
<%@page import="com.zhuozhengsoft.pageoffice.OpenModeType"%>
<%@page import="com.zhuozhengsoft.pageoffice.PageOfficeCtrl"%>
<%@page import="com.zhuozhengsoft.pageoffice.ThemeType"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
    String contextPath = request.getContextPath();
	
	// 是否可以编辑
    boolean canEdit = CommonTools.null2String(request.getParameter("canEdit")).equals("true")?true:false;
	// 文件名称
    String fileName = CommonTools.null2String(request.getParameter("fileName"));
	
	System.out.println("fileName" + fileName);
	// 文件路径
	String filePath = CommonTools.null2String(request.getParameter("filePath"));
	// 文件类型
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
    
    System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>打开文档路径：" + filePath);
    
	PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
	
	// 属性设置放在打开之前
	poCtrl1.setCaption(fileName);
	poCtrl1.setAllowCopy(false);//禁止拷贝
	poCtrl1.setMenubar(false);//隐藏菜单栏
	poCtrl1.setOfficeToolbars(false);//隐藏Office工具条
	poCtrl1.setCustomToolbar(false);//隐藏自定义工具栏
	
	// 设置函数调用
	poCtrl1.setJsFunction_AfterDocumentOpened("doAfterRender");
	poCtrl1.setJsFunction_AfterDocumentSaved("doAfterSaved");
	
	// 设置服务器
	poCtrl1.setServerPage(contextPath + "/poserver.zz");
	// 设置打开的文档
	poCtrl1.webOpen(filePath, openModel, "");
	// 设置主题样式
	poCtrl1.setTheme(ThemeType.CustomStyle);
	// 设置渲染标签
	poCtrl1.setTagId("PageOfficeCtrl1");
	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=GBK">
		<title><%=fileName%></title>
		<script type="text/javascript">

			//全屏
			function doSetFullScreen() {
				document.getElementById("PageOfficeCtrl1").FullScreen = !document.getElementById("PageOfficeCtrl1").FullScreen;
			}
		  
			//文档打开之后设置属性
			function doAfterRender() { 
				document.getElementById("PageOfficeCtrl1").SetEnableFileCommand(4, false); //禁止另存
	            document.getElementById("PageOfficeCtrl1").SetEnableFileCommand(5, false); //禁止打印
	            document.getElementById("PageOfficeCtrl1").SetEnableFileCommand(6, false); //禁止页面设置
	            document.getElementById("PageOfficeCtrl1").SetEnableFileCommand(8, false); //禁止打印预览
		  	}
			
		</script>
	</head>
	
	<body>
		<po:PageOfficeCtrl id="PageOfficeCtrl1"/>
	</body>
	
</html>