<%@ page language="java" contentType="text/html;charset=GBK"%>
<%@ page isELIgnored="false" %>
<%
	String contextPath = request.getContextPath();
	String conf = request.getParameter("conf");
%>
<html>
	<head>
		<title>Flot绘图</title>
		<meta http-equiv=Pragma content=no-cache>
		<meta http-equiv=Cache-Control content=no-cache>
		<meta http-equiv=Expires content=0>
		<meta http-equiv="Content-Type" content="text/html; charset=GBK" />

		<script type="text/javascript" src="<%=contextPath%>/app/javascript/lib/ext-4.2/ext-all.js"></script>
		<!--[if lte IE 8]>
			<script language="javascript" type="text/javascript" src="<%=contextPath%>/app/javascript/lib/flot/excanvas.min.js"></script>
		<![endif]-->
		<script language="javascript" type="text/javascript" src="<%=contextPath%>/app/javascript/lib/flot/jquery.js"></script>
		<script language="javascript" type="text/javascript" src="<%=contextPath%>/app/javascript/lib/flot/jquery.flot.js"></script>
		<script language="javascript" type="text/javascript" src="<%=contextPath%>/app/javascript/lib/flot/jquery.flot.navigate.js"></script>
		<script language="javascript">
			Ext.onReady(function(){
				var serviceName = '<%=contextPath%>';
				var conf = <%=conf%>;
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

						var lines = [];
						for (var yName in columnMap) {
							var yCol = columnMap[yName];
							var dots = [];
							for (var i=0; i<dataList.length; i++) {
								var dataMap = dataList[i];
								dots.push([dataMap[xCol], dataMap[yCol]]);
							}
							lines.push({
								label: yName,
								data: dots
							});
						}

						$.plot("#flotBoard", lines, {
							series: {
								lines: { show: true },
								points: { show: true }
							},
							grid: {
								hoverable: true,
								clickable: true
							},
							zoom: {
								interactive: true
							},
							pan: {
								interactive: true
							}
						});

						$("#flotBoard").bind("plothover", function (event, pos, item) {
							if (item) {
								var x = item.datapoint[0].toFixed(2),
									y = item.datapoint[1].toFixed(2);

								$("#tooltip").html(item.series.label + ":("+x+","+y+")")
										.css({top: item.pageY+5, left: item.pageX+5})
										.fadeIn(200);
							}
							else {
								$("#tooltip").hide();
							}
						});
					},
					failure : function(result, request) {
						Ext.MessageBox.alert("错误", "数据准备错误...");
					}
				});
			});
		</script>
	</head>
	<body>
		<div id="flotBoard" style="position:absolute; overflow:hidden; left:100px; top:100px; right:100px; bottom:100px; z-index:200;"></div>
		<div id="tooltip" style="position:absolute; display:none; border:1px; solid:#fdd; padding:2px; background-color:#00ffff; opacity:0.80"></div>
	</body>
</html>