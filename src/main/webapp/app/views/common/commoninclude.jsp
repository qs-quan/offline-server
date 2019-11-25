<%--
  Created by IntelliJ IDEA.
  User: enjoy
  Date: 2016/3/10 0010
  Time: 8:48
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="display" uri="http://displaytag.sf.net" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<link rel="stylesheet" type="text/css" href="${ctx}/app/styles/green/css/Aqua/css/ligerui-all.css"/>
<link rel="stylesheet" type="text/css"
      href="${ctx}/app/javascript/lib/ligerui/ligerUI/skins/Gray/css/all.css"/>
<link rel="stylesheet" type="text/css" href="${ctx}/app/styles/green/css/web.css"/>
<link rel="stylesheet" type="text/css" href="${ctx}/app/styles/green/css/jquery/plugins/rowOps.css"/>
<script type="text/javascript" src="${ctx}/app/javascript/lib/lang/common/zh_CN.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/lang/js/zh_CN.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/orient_js/setGlobalParam.jsp"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/jquery/jquery.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/orient_js/common/util.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/orient_js/common/form.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/orient_js/common/json2.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/lg/base.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/lg/plugins/ligerResizable.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/lg/plugins/ligerDialog.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/lg/util/DialogUtil.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/calendar/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/jquery/plugins/jquery.htselect.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/lib/jquery/plugins/jquery.rowOps.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/orient_js/common/foldBox.js"></script>
<script type="text/javascript" src="${ctx}/app/javascript/orient_js/common/absoulteInTop.js"></script>

<%@include file="msg.jsp" %>