<%@ page language="java"
         import="java.util.*,
                 com.zhuozhengsoft.pageoffice.*,
                 com.orient.edm.init.FileServerConfig,
                 com.orient.edm.init.OrientContextLoaderListener,
                 com.orient.web.util.UserContextUtil"
         pageEncoding="gb2312" %>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>
<%
    //�ļ���������Ϣ
    FileServerConfig fileServerConfig = (FileServerConfig) OrientContextLoaderListener.Appwac.getBean("fileServerConfig");
    String ftpHome = fileServerConfig.getFtpHome();
    //�ļ������Ϣ
    String fileName = (String)request.getSession().getAttribute("fileName");
    String fileType = (String)request.getSession().getAttribute("fileType");
    //���ؿؼ�
    PageOfficeCtrl poCtrl = new PageOfficeCtrl(request);
    //���÷�����ҳ��
    poCtrl.setServerPage(request.getContextPath() + "/poserver.zz");
    //��Word�ĵ�
    String filePath = ftpHome + fileName;
    OpenModeType fileModel = OpenModeType.docReadOnly;
    if ("xls,xlsx".indexOf(fileType) != -1) {
        fileModel = OpenModeType.xlsReadOnly;
    } else if ("ppt,pptx".indexOf(fileType) != -1) {
        fileModel = OpenModeType.pptReadOnly;
    } else if ("vsd,vsdx".indexOf(fileType) != -1) {
        fileModel = OpenModeType.vsdNormalEdit;
    } else if ("mpp".indexOf(fileType) != -1) {
        fileModel = OpenModeType.mppNormalEdit;
    }
    poCtrl.webOpen(filePath, fileModel, UserContextUtil.getUserName());
    poCtrl.setTagId("PageOfficeCtrl1");//���б���
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>�ĵ�����Ԥ��</title>
</head>
<body>
<script type="text/javascript">
    function Save() {
        document.getElementById("PageOfficeCtrl1").WebSave();
    }
</script>
<script type="text/javascript">
    function AfterDocumentOpened() {
        document.getElementById("Text1").value = document.getElementById("PageOfficeCtrl1").DataRegionList.GetDataRegionByName("PO_Title").Value;
    }

    function setTitleText() {
        document.getElementById("PageOfficeCtrl1").DataRegionList.GetDataRegionByName("PO_Title").Value = document.getElementById("Text1").value;
    }
</script>

<form id="form1">
    <div style=" width:auto; height:700px;">
        <po:PageOfficeCtrl id="PageOfficeCtrl1">
        </po:PageOfficeCtrl>
    </div>
</form>
</body>
</html>
