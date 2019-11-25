<%@ page language="java" contentType="text/html;charset=GBK"%>
<%@ page isELIgnored="false" %>
<%
	String contextPath = request.getContextPath();
	String conf = request.getParameter("conf");
%>
<html>
	<head>
		<title>Plotly绘图</title>
		<meta http-equiv=Pragma content=no-cache>
		<meta http-equiv=Cache-Control content=no-cache>
		<meta http-equiv=Expires content=0>
		<meta http-equiv="Content-Type" content="text/html; charset=GBK" />

		<script type="text/javascript" src="<%=contextPath%>/app/javascript/lib/ext-4.2/ext-all.js"></script>
		<script type="text/javascript" src="<%=contextPath%>/app/javascript/lib/plotly-1.7.0/dist/plotly.js"></script>
		<script language="javascript">
			var serviceName = '<%=contextPath%>';
			var conf = <%=conf%>;
			Ext.onReady(function(){
				Ext.Ajax.request({
					url : serviceName + '/dataAnalysis/jsCharting.rdm',
					method : 'POST',
					params : conf,
					success : function(response, options) {
						var data = Ext.decode(response.responseText);
						var columnMap = data.columnMap;
						var dataList = data.dataList;

						var xCol = conf.xAxis;
						var xName = "";
						for(var key in columnMap) {
							if(columnMap[key] == xCol) {
								xName = key;
								delete columnMap[key];
							}
						}

						var xData = [];
						for(var i = 0; i < dataList.length; i++) {
							var dataMap = dataList[i];
							xData.push(dataMap[xCol]);
						}

						var datasets = [];
						for (var yName in columnMap) {
							var yCol = columnMap[yName];
							var yData = [];
							for (var i=0; i<dataList.length; i++) {
								var dataMap = dataList[i];
								yData.push(dataMap[yCol]);
							}
							datasets.push({
								x: xData,
								y: yData,
								mode: 'lines+markers',
								name: yName
							});
						}

						var layout = {
							xaxis: {
								autorange: true,
								title: xName
							},
							yaxis: {
								autorange: true
							},
							margin: {t: 10},
							width: Ext.getBody().getViewSize().width,
							height: Ext.getBody().getViewSize().height
						};

						Plotly.newPlot('plotlyBoard', datasets, layout);
					},
					failure : function(result, request) {
						Ext.MessageBox.alert("错误", "数据准备错误...");
					}
				});
			});
		</script>
	</head>
	<body>
	<div id="plotlyBoard" style="position:absolute; overflow:hidden; left:50px; top:50px; right:50px; bottom:50px; z-index:200;"></div>
	</body>
</html>