<%--
  Created by IntelliJ IDEA.
  User: enjoy
  Date: 2016/3/23 0023
  Time: 16:54
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="display" uri="http://displaytag.sf.net" %>
<%@ taglib prefix="spr" uri="http://www.springframework.org/tags" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<script type="text/javascript">
    var __ctx = '<%=request.getContextPath()%>';
    var __jsessionId = '<%=session.getId() %>';
    var funName = '<%=request.getParameter("funName")%>';
    var bindModeId = '<%=request.getParameter("modelId")%>';
    var belongItemId = '<%=request.getParameter("belongItemId")%>';
</script>
<html>
<head>
    <title></title>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/styles/green/css/form.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/styles/green/css/web.css"/>
    <link rel="stylesheet" type="text/css"
          href="${ctx}/app/javascript/lib/ligerui/ligerUI/skins/Aqua/css/ligerui-all.css"/>
    <link rel="stylesheet" type="text/css"
          href="${ctx}/app/javascript/lib/ligerui/ligerUI/skins/Gray/css/all.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx}/app/styles/green/css/jquery.qtip.css"/>
    <script type="text/javascript" charset="utf-8" src="${ctx}/app/javascript/lib/jquery/jquery.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/jquery/plugins/jquery.qtip.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/lib/calendar/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/lib/ligerui/ligerUI/js/ligerui.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="${ctx}/app/javascript/orientjs/jqueryjs/lang/zh_CN.js"></script>
    <script type="text/javascript" charset="utf-8" src="${ctx}/app/javascript/orientjs/common/util.js"></script>
    <script type="text/javascript" charset="utf-8" src="${ctx}/app/javascript/orientjs/common/json2.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/orientjs/jqueryjs/form/CustomValid.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/orientjs/jqueryjs/form/RelationMgr.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/orientjs/jqueryjs/form/ModelEnumMgr.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/orientjs/jqueryjs/form/AttachMgr.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/orientjs/jqueryjs/form/StaticMultiSelect.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/orientjs/jqueryjs/form/SingleTableSelect.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/orientjs/jqueryjs/form/CheckTable.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/orientjs/jqueryjs/form/DynamicTable.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/orientjs/jqueryjs/form/OrientFormUtil.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/orientjs/jqueryjs/form/OrientFormInit.js"></script>
</head>
<script type="text/javascript">
    var CiteExt = window.parent.Ext;
    var serviceName = '<%=request.getContextPath()%>';
    if (funName != 'null') {
        window.parent[funName] = function () {
            var rtn = OrientFormUtil.validate();
            if (rtn == true) {
                return OrientFormUtil.prepareData();
            } else
                return false;
        }
    }
</script>
<body>
<form>
    <div type="custform">
        <div class="panel-detail">
            <script type="text/javascript">
                if(belongItemId=='null') {
                    belongItemId = '';
                }
                if (parent.window['previewHtml' + belongItemId] && !parent.Ext.isEmpty(parent.window['previewHtml' + belongItemId])) {
                    document.write(parent.window['previewHtml' + belongItemId]);
                }
            </script>
        </div>
    </div>
</form>
</body>
</html>
