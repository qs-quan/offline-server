<%@ page language="java" contentType="text/html;charset=UTF-8" %> 
<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ page import="com.orient.edm.init.Config" %>
<%@ page isELIgnored="false" %>
<%
	response.setHeader("Cache-Control","no-cache");
	response.setHeader("Pragma","no-cache");
	response.setDateHeader("Expires", 0); 
	// 系统根
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>

    <title></title>


    <script type="text/javascript"> 
    	var contextPath = '<%=path%>';
		var serviceName ='<%=request.getContextPath()%>';
		
	</script>
 
  </head>
  
  <body>
  	<form name="input" action="<%=basePath%>test/formSubmit" method="get">
		<div>
			<label>请求URL:</label>
			<br>
			<textarea name="url" rows="10" cols="30">
			</textarea>
		</div>
		<div>
			<label>请求方式:</label>
			<br>
			<input type="radio" name="method" value="get" checked="true">GET
			<br>
			<input type="radio" name="method" value="post">POST
			<br>
			<input type="radio" name="method" value="put">PUT
			<br>
			<input type="radio" name="method" value="delete">DELETE
		</div>
		<div>
			<label>传送数据类型:</label>
			<br>
			<input type="radio" name="sendDataType" value="json" checked="true">JSON
			<br>
			<input type="radio" name="sendDataType" value="xml">XML
		</div>
		<div>
			<label>接收数据类型:</label>
			<br>
			<input type="radio" name="receiveDataType" value="json" checked="true">JSON
			<br>
			<input type="radio" name="receiveDataType" value="xml">XML
		</div>
		<div>
			<label>请求数据:</label>
			<br>
			<textarea name="requestData" rows="10" cols="30">
			</textarea>
		</div>

	  <input type="submit" value="Submit">
  	</form>
  </body>
</html>
