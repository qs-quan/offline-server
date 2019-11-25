/**
 * 文档统计事件
 * @author : weilei
 */
define(function (require, exports, module) {

    /**
     * 文档统计
     * @param basicForm
     * @param constant
     */
    exports.fileCount = function (basicForm, constant) {

        //统计条件
        var caption = '';
        var xAxisName = '';
        var yAxisName = '';
        var countNum = basicForm.findField('countNum').getValue();
        ;
        var countType = basicForm.findField('countType').getValue();
        var countView = basicForm.findField('countView').getValue();
        var countDate = exports.getCountDate(basicForm);
        if (countType != '') {
            if ('countByDepartment' == countType) {
                caption = '按照部门统计前' + countNum + '位文档';
                xAxisName = '部门';
                yAxisName = '统计数量';
                countType = 'C_CREATE_USER_ID_';
            }
            if ('countByPreviewNum' == countType) {
                caption = '按照预览次数统计前' + countNum + '位文档';
                xAxisName = '文档';
                yAxisName = '预览次数';
                countType = 'C_PREVIEWNUM_';
            }
            if ('countByDownloadNum' == countType) {
                caption = '按照下载次数统计前' + countNum + '位文档';
                xAxisName = '文档';
                yAxisName = '下载次数';
                countType = 'C_FILEDOWNLOAD_';
            }
        }
        var params = {
            caption: caption,
            xAxisName: xAxisName,
            yAxisName: yAxisName,
            countDate: countDate,
            fileCountType: countType,
            fileCountView: countView,
            fileModelName: constant.file.fileModelName
        };

        //获取数据
        basicForm.submit({
            clientValidation: true,
            url: serviceName + '/fileCountController/fileCount.rdm',
            method: 'post',
            params: params,
            waitMsg: '正在准备数据,请等待...',
            success: function (form, action) {
                //绘制图形
                exports.drawChart(countView, action.result.message);
            },
            failure: function (form, action) {
                constant.messageBox('数据准备失败，请联系系统管理员！');
            }
        });
    };

    /**
     * 获取统计时间
     * @param basicForm
     */
    exports.getCountDate = function (basicForm) {

        var countDate = '';
        var startDate = basicForm.findField('startDate').getValue();
        ;
        var endDate = basicForm.findField('endDate').getValue();
        if (startDate != '') startDate = startDate.format('Y-m-d');
        if (endDate != '') endDate = endDate.format('Y-m-d');

        if ('' != startDate && '' != endDate) {
            countDate += " AND F.C_UPLOAD_TIME_columnId >= to_date('" + startDate + "','yyyy-MM-dd HH24:mi:ss') ";
            countDate += " AND F.C_UPLOAD_TIME_columnId <= to_date('" + endDate + "','yyyy-MM-dd HH24:mi:ss') ";
        }
        if ('' == startDate && '' != endDate) {
            countDate += " AND F.C_UPLOAD_TIME_columnId <= to_date('" + endDate + "','yyyy-MM-dd HH24:mi:ss') ";
        }
        if ('' != startDate && '' == endDate) {
            countDate += " AND F.C_UPLOAD_TIME_columnId >= to_date('" + startDate + "','yyyy-MM-dd HH24:mi:ss') ";
        }
        return countDate;
    }

    /**
     * 绘制图形
     * @param dataXml：xml数据
     */
    exports.drawChart = function (countView, datXml) {
        var swfUrl = serviceName + '/app/javascript/lib/fusionChartsV3/fusionCharts/swf/' + countView + '.swf';
        var divWidth = Ext.getCmp('fileChart').getWidth() * 0.8 - 50;
        var divHeight = Ext.getCmp('fileChart').getHeight() * 0.8 - 40;
        var myChart = new FusionCharts(swfUrl, 'fileChartId', divWidth, divHeight, '0', '1');

        myChart.setDataXML(datXml);
        myChart.render('fileChartId');
    }

});