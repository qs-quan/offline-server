<%@ page language="java" contentType="text/html; charset=utf-8" %>
<%@ page import="java.io.*,java.util.*" %>
<%@ page import="com.zhuozhengsoft.pageoffice.*" %>
<%@page import="com.orient.utils.CommonTools" %>
<%
    String reportName = CommonTools.null2String(request.getParameter("reportName"));
    FileSaver fs = new FileSaver(request, response);
    try {
        if (!"".equals(reportName)) {
            reportName = java.net.URLDecoder.decode(reportName, "UTF-8");

            if(reportName.startsWith("D:\\ftpHome\\")){
                // 如果路径以 ftphome 开头则不处理路径
                fs.saveToFile(reportName);

            }else{
                Properties prop = new Properties();
                prop.load(new FileInputStream(new File(CommonTools.getRootPath() + "/WEB-INF/classes/ftpServer.properties")));
                String ftpHome = prop.getProperty("ftpServer.ftpHome");
                File toSaveDir = new File(ftpHome + File.separator + "docReports");
                if (!toSaveDir.exists()) {
                    toSaveDir.mkdirs();
                }
                fs.saveToFile(ftpHome + File.separator + "docReports" + File.separator + reportName);
            }
        }
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        fs.close();
    }
%>
