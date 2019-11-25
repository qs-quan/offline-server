<%@ page contentType="text/html;charset=GBK" language="java" %>
<%@ page import="com.fusioncharts.exporter.ErrorHandler" %>
<%

	String exportTargetWindow = request.getParameter("exportTargetWindow");
	String isHTML = request.getParameter("isHTML");
	String otherMessages = request.getParameter("otherMessages");
	String errorMessages = request.getParameter("errorMessages");
	
	if(isHTML==null){
		isHTML = "true";
	}
	if(otherMessages==null){
		otherMessages="";
	}
	if(errorMessages==null){
		errorMessages="";
	}

	
	System.out.println("exportTargetWindow="+exportTargetWindow);
	System.out.println("otherMessages="+otherMessages);
	System.out.println("errorMessages="+errorMessages);


	
	// 
	//response.setContentType("text/html");
	if(exportTargetWindow.equalsIgnoreCase("_self")){
		response.addHeader("Content-Disposition", "attachment;");
	}else{
		response.addHeader("Content-Disposition", "inline;");
	}
%>
<%=ErrorHandler.buildResponse(errorMessages, Boolean.parseBoolean(isHTML)) %>
<%=otherMessages %>
