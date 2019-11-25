<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/8/7 0007
  Time: 14:42
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
    <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/app/styles/green/css/form.css"/>
    <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/app/styles/green/css/web.css"/>
    <link rel="stylesheet" type="text/css"
          href="<%=request.getContextPath()%>/app/javascript/lib/ligerui/ligerUI/skins/Aqua/css/ligerui-all.css"/>
    <link rel="stylesheet" type="text/css"
          href="<%=request.getContextPath()%>/app/javascript/lib/ligerui/ligerUI/skins/Gray/css/all.css"/>
    <link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/app/styles/green/css/jquery.qtip.css"/>
    <script type="text/javascript" charset="utf-8"
            src="<%=request.getContextPath()%>/app/javascript/lib/jquery/jquery.js"></script>
    <script type="text/javascript"
            src="<%=request.getContextPath()%>/app/javascript/lib/jquery/plugins/jquery.qtip.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="<%=request.getContextPath()%>/app/javascript/lib/ligerui/ligerUI/js/ligerui.min.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="<%=request.getContextPath()%>/app/javascript/orientjs/jqueryjs/lang/zh_CN.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="<%=request.getContextPath()%>/app/javascript/orientjs/common/util.js"></script>
    <script type="text/javascript" charset="utf-8"
            src="<%=request.getContextPath()%>/app/javascript/orientjs/common/json2.js"></script>
    <script>
        var headDataStr = '<%=request.getParameter("headData")%>';
        var headData = JSON2.parse(headDataStr);
        console.dir(headData);
        $(function () {
            $('#headSettingGrid').ligerGrid({
                columns: [
                    {display: '列头', name: 'headText', width: 390, editor: {type: 'text'}}
                ],
                data: {
                    Rows: headData,
                    Total: headData.length
                },
                checkbox: true,
                enabledEdit: true,
                width: '100%',
                usePager: false,
                toolbar: {
                    items: [
                        {
                            text: '新增',
                            click: function (btn) {
                                var manager = $('#headSettingGrid').ligerGetGridManager();
                                var newRecord = {
                                    headText: '默认值'
                                };
                                manager.addRow(newRecord);
                            }
                        },
                        {
                            text: '删除',
                            click: function (btn) {
                                var manager = $('#headSettingGrid').ligerGetGridManager();
                                manager.deleteSelectedRow();
                            }
                        }
                    ]
                }
            });
        });

        function saveHeadSettings() {
            var retVal = [];
            var manager = $('#headSettingGrid').ligerGetGridManager();
            var data = manager.getData();
            //判断是否有重复
            var tmpContainer = [];
            var containerRepeat = false;
            $.each(data, function (index, columnData) {
                if(tmpContainer.indexOf(columnData.headText) !== -1){
                    containerRepeat = true;
                }else{
                    tmpContainer.push(columnData.headText);
                }
                retVal.push({
                    display: columnData.headText,
                    name: columnData.headText,
                    editor: {type: 'text'}
                });
            });
            if (containerRepeat == true) {
                return containerRepeat
            } else
                return retVal;
        }
    </script>
</head>
<body>
<div id="headSettingGrid" style="margin: 0;padding: 0"></div>
<div style="display: none"></div>
</body>
</html>
