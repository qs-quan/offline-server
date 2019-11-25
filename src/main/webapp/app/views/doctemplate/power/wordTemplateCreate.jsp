<%@ page language="java" import="com.orient.edm.init.OrientContextLoaderListener" pageEncoding="utf-8" %>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%@ page import ="com.orient.custom.docTemplate.business.PowerDocTemplateBusiness" %>
<%@ page import="com.zhuozhengsoft.pageoffice.OpenModeType" %>
<%@ page import="com.zhuozhengsoft.pageoffice.PageOfficeCtrl" %>
<%@ page import="com.zhuozhengsoft.pageoffice.wordwriter.WordDocument" %>
<%
    request.setCharacterEncoding("UTF-8");
    String path = request.getContextPath();
    //传入的参数
    String testTypeId = request.getParameter("testTypeId");
    String testTypeNodeId = request.getParameter("testTypeNodeId");
    String templateId = request.getParameter("templateId");
    String belongPanelId = request.getParameter("itemId");

    belongPanelId = null == belongPanelId ? "" : belongPanelId;
    //******************************卓正PageOffice组件的使用*******************************
    PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
    //设置服务器页面
    poCtrl1.setServerPage(request.getContextPath() + "/poserver.zz");
    WordDocument doc = new WordDocument();
    poCtrl1.setTitlebar(false);
    poCtrl1.setMenubar(false);
    PowerDocTemplateBusiness reportTemplateBusiness = (PowerDocTemplateBusiness)OrientContextLoaderListener.Appwac.getBean("powerDocTemplateBusiness");
    String templtPath = reportTemplateBusiness.generateDoc(doc, templateId, testTypeId, testTypeNodeId);
    //自定义工具栏
    //poCtrl1.addCustomToolButton("保存", "doSave()", 12);
    poCtrl1.addCustomToolButton("另存为", "doSaveAs()", 11);
    poCtrl1.addCustomToolButton("-", "", 2);
    poCtrl1.addCustomToolButton("全屏/还原", "doSetFullScreen()", 4);
    poCtrl1.setWriter(doc);
    // 打开文件时会执行这个方法，将打开的流进行原路径保存
    poCtrl1.setJsFunction_AfterDocumentOpened("doSave()");
    poCtrl1.webOpen(templtPath, OpenModeType.docNormalEdit, "");//以只读模式打开
    poCtrl1.setTagId("PageOfficeCtrl1");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
    <meta http-equiv="description" content="This is my page">
    <script src="../../../javascript/lib/jquery/jquery-1.7.2.min.js"></script>
    <script type="text/javascript">
        var belongPanelId = '<%=belongPanelId%>';
        var parentExt = window.parent.Ext;
        if (parentExt && !parentExt.isEmpty(belongPanelId)) {
            var belongPanel = parentExt.getCmp(belongPanelId);
            //bind son window
            belongPanel.sonWindow = window;
        }
        //打开文件
        function doOpen() {
            document.getElementById('PageOfficeCtrl1').ShowDialog(1);
        }

        //打开时保存文件
        function doSave() {
            // 后台无法直接将生成wordDocument保存，只能页面调用产生新的request和reponse来实现文件流刷新
            var reportName = '<%=templtPath%>';
            reportName = encodeURIComponent(encodeURIComponent(reportName));
            document.getElementById("PageOfficeCtrl1").SaveFilePage = '../docTemplateSave.jsp?reportName=' + reportName;
            document.getElementById("PageOfficeCtrl1").WebSave();
            // document.getElementById('PageOfficeCtrl1').ShowDialog(2);
        }

        //另存文件
        function doSaveAs() {
            document.getElementById('PageOfficeCtrl1').ShowDialog(3);
        }

        //全屏/还原
        function doSetFullScreen() {
            document.getElementById('PageOfficeCtrl1').FullScreen = !document.getElementById('PageOfficeCtrl1').FullScreen;
        }

        function init() {
            var obj = document.getElementById('PageOfficeCtrl1');
            obj.style.zIndex = -1;
            $("#PageOfficeCtrl1").height($(window).height());
        }
    </script>
</head>

<body onload="init()">
<div>
    <po:PageOfficeCtrl id="PageOfficeCtrl1"/>
</div>
</body>
</html>
