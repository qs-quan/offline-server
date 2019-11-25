<%--
  Created by IntelliJ IDEA.
  User: enjoy
  Date: 2016/3/19 0019
  Time: 15:55
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
    var bindTemplateId = '<%=request.getParameter("bindTemplateId")%>';
    var bindModelID = '<%=request.getParameter("bindModelID")%>';
</script>
<html>
<head>
    <title></title>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/jquery/jquery.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/calendar/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" charset="utf-8" src="${ctx}/app/javascript/lib/ueditor2/editor_config.js"></script>
    <script type="text/javascript" charset="utf-8" src="${ctx}/app/javascript/lib/ueditor2/editor_api.js"></script>
    <script type="text/javascript" charset="utf-8" src="${ctx}/app/javascript/orientjs/common/util.js"></script>
    <script type="text/javascript" charset="utf-8" src="${ctx}/app/javascript/orientjs/common/json2.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/orientjs/jqueryjs/form/ModelEnumMgr.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/orientjs/jqueryjs/form/AttachMgr.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="${ctx}/app/javascript/orientjs/jqueryjs/form/RelationMgr.js"></script>
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
    var serviceName = '<%=request.getContextPath()%>';
    getEditor = function (conf) {
        var h = $(window).height(),
                w = $(window).width(),
                lang = conf.lang ? conf.lang : 'zh_cn';
        h = conf.height ? (h - conf.height) : h;
        w = conf.width ? (w - conf.width) : w;
        editor = new baidu.editor.ui.Editor({minFrameHeight: h, initialFrameWidth: w, lang: conf.lang});
        editor.addListener("sourceModeChanged", function (t, m) {

        });
    };

    var editor;
    var tab;
    $(function () {
        if (parent.window.originalHtml && !parent.Ext.isEmpty(parent.window.originalHtml)) {
            $("#formHtml").val(parent.window.originalHtml);
            parent.window.originalHtml = null;
        }
        if (parent.Ext.isEmpty($("#formHtml").val())) {
            //根据模型ID 以及 模板ID 获取初始数据
            $.ajax({
                url: __ctx + '/modelFormView/getFormViewHtml.rdm',
                async: true,
                data: {
                    "bindTemplateId": bindTemplateId,
                    "bindModelID": bindModelID
                },
                success: function (data) {
                    var html = JSON2.parse(data).results;
                    if (html) {
                        $("#formHtml").val(html);
                    }
                    initEditor();
                }
            });
        } else {
            initEditor();
        }

    });

    function initEditor() {
        //初始化编辑器
        getEditor({
            height: 50,
            width: 50,
            lang: 'zh_cn'
        });
        window.parent.editor = editor;
        editor.addListener("sourceModeChanged", function (t, m) {

        });
        editor.addListener('ready', function () {

        });
        //ueditor渲染textarea
        editor.render("formHtml");
    }
</script>
<body>
<div id="editor" position="center" style="overflow:hidden;height:100%;">
    <textarea id="formHtml" name="formHtml"></textarea>

    <div id="pageTabContainer"></div>
</div>
</body>
</html>
