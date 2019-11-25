<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Pragma", "no-cache");
    response.setDateHeader("Expires", 0);
    String contextPath = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + contextPath + "/";
%>
<!DOCTYPE HTML>
<html locale="true">
<head>
    <title>电子十所外场试验数据管理系统</title>
    <p style="visibility: hidden">奥蓝托试验数据管理系统</p>>
    <meta http-equiv="X-UA-Compatible" content="chrome=1;text/html;charset=UTF-8"/>
    <link rel="Shortcut Icon" href="app/images/orient.ico"/>
    <link rel="stylesheet" type="text/css" href="app/styles/orient/login.css">
    <script>
        function login() {
            if (validate()) {
                document.forms[0].submit();
            }
        }

        function validate() {
            var userId = document.forms[0].userName.value;
            var password = document.forms[0].password.value;

            if (userId == "") {
                alert("用户名不可为空");
                document.forms[0].userName.focus();
                return;
            }
            if (password == "") {
                alert("密码不可为空");
                document.forms[0].password.focus();
                return;
            }
            return true;
        }

        function reset() {

        }

        function loginSubmit(e) {
            var key;
            if (document.all) {
                key = window.event.keyCode;
            } else {
                key = e.which;
            }
            if (key == "13") {
                login();
            }
        }
    </script>
</head>
<body onkeydown="loginSubmit(event);" style="zoom: 1;">
<div class="main" style="position: absolute; overflow: hidden; left: 0px; top: 0px; right: 0px; bottom: 0px;">
    <div class="main_pic" style="margin-top:0;">
        <div class="text">
            <form method="post" action="<%=contextPath%>/login.rdm">
                <table border="0" style="height:170px;">
                    <tr>
                        <th>
                            <input style="width:293px;text-align:left;height:30px;vertical-align: middle; font-size: 20px;"
                                   type="text" name="userName"/>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <input style="width:293px;text-align:left;height:30px;font-size: 20px;"
                                   type="password" name="password"/>
                        </th>
                    </tr>
                </table>
            </form>
        </div>
        <div class="buttonArea">
            <table>
                <tr>
                    <td>
                        <div class="button1">
                            <button style="cursor:hand;" onclick="window.login();"></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div style="color:#FF0000; font-size:14px;"></div>
                    </td>
                </tr>
            </table>
            <div style="color:#FF0000; font-size:15px; text-align:left;">${errorMsg}</div>
        </div>
    </div>
</div>
</body>
</html>
