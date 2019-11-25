<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/8/3 0003
  Time: 14:55
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%--引入Ext环境--%>
<%@include file="/app/views/include/ExtEnvironment.jsp" %>
<html>
<head>
    <title>审批表单Ext例子</title>
    <script>
        Ext.onReady(function () {
            Ext.tip.QuickTipManager.init();
            var manualBuildExtFormButton = Ext.query('button[name=ManualBuildExtForm]')[0];
            var autoBuildExtFormButton = Ext.query('button[name=AutoBuildExtForm]')[0];
            var autoBuildExtGridButton = Ext.query('button[name=AutoBuildExtGrid]')[0];
            var autoBuildComplexExtFormButton = Ext.query('button[name=AutoBuildComplexExtForm]')[0];
            Ext.EventManager.on(manualBuildExtFormButton, 'click', function () {
                Ext.create('OrientTdm.Example.ManualBuildExtForm');
            });
            Ext.EventManager.on(autoBuildExtFormButton, 'click', function () {
                Ext.create('OrientTdm.Example.AutoBuildExtForm');
            });
            Ext.EventManager.on(autoBuildExtGridButton, 'click', function () {
                Ext.create('OrientTdm.Example.AutoBuildExGrid');
            });
            Ext.EventManager.on(autoBuildComplexExtFormButton, 'click', function () {
                Ext.create('OrientTdm.Example.AutoBuildComplexExtForm');
            });

        });
    </script>
</head>
<body>
<button name="ManualBuildExtForm">手动创建Ext表单</button>
<button name="AutoBuildExtForm">自动创建Ext表单</button>
<button name="AutoBuildComplexExtForm">自动创建复杂Ext表单</button>
<button name="AutoBuildExtGrid">自动创建Ext表格</button>
</body>
</html>
