/**
 * 词条统计事件
 * @author : weilei
 */
define(function (require, exports, module) {

    /**
     * 词条统计
     * @param basicForm
     * @param constant
     */
    exports.dictionCount = function (basicForm, constant) {

        //统计条件
        var caption = '';
        var xAxisName = '';
        var yAxisName = '';
        var countNum = basicForm.findField('countNum').getValue();
        var countType = basicForm.findField('countType').getValue();
        var countView = basicForm.findField('countView').getValue();
        var countDate = exports.getCountDate(basicForm);
        if (countType != '') {
            if ('countByUser' == countType) {
                caption = '按照个人贡献度统计前' + countNum + '位词条';
                xAxisName = '词条';
                yAxisName = '统计数量';
                countType = 'C_CREATE_USER_ID_';
            }
            if ('countByUseNum' == countType) {
                caption = '按照点击次数统计前' + countNum + '位词条';
                xAxisName = '词条';
                yAxisName = '引用次数';
                countType = 'C_USENUM_';
            }
            if ('countByCommentNum' == countType) {
                caption = '按照评论次数统计前' + countNum + '位词条';
                xAxisName = '词条';
                yAxisName = '评论次数';
                countType = 'C_COMMENTNUM_';
            }
        }
        var params = {
            caption: caption,
            xAxisName: xAxisName,
            yAxisName: yAxisName,
            countDate: countDate,
            dictionCountType: countType,
            dictionCountView: countView,
            dictionModelName: constant.diction.dictionModelName,
            commentModelName: constant.comment.commentModelName
        };

        //获取数据
        basicForm.submit({
            clientValidation: true,
            url: serviceName + '/dictionCountController/dictionCount.rdm',
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
        var endDate = basicForm.findField('endDate').getValue();
        if (startDate != '') startDate = startDate.format('Y-m-d');
        if (endDate != '') endDate = endDate.format('Y-m-d');

        if ('' != startDate && '' != endDate) {
            countDate += " AND D.C_CREATE_TIME_dColumnId >= to_date('" + startDate + "','yyyy-MM-dd HH24:mi:ss') ";
            countDate += " AND D.C_CREATE_TIME_dColumnId <= to_date('" + endDate + "','yyyy-MM-dd HH24:mi:ss') ";
        }
        if ('' == startDate && '' != endDate) {
            countDate += " AND D.C_CREATE_TIME_dColumnId <= to_date('" + endDate + "','yyyy-MM-dd HH24:mi:ss') ";
        }
        if ('' != startDate && '' == endDate) {
            countDate += " AND D.C_CREATE_TIME_dColumnId >= to_date('" + startDate + "','yyyy-MM-dd HH24:mi:ss') ";
        }
        return countDate;
    }

    /**
     * 绘制图形
     * @param countView：统计视图
     * @param dataXml  ：xml数据
     */
    exports.drawChart = function (countView, datXml) {

        var swfUrl = serviceName + '/app/javascript/lib/fusionChartsV3/fusionCharts/swf/' + countView + '.swf';
        var divWidth = Ext.getCmp('dictionChart').getWidth() * 0.8 - 50;
        var divHeight = Ext.getCmp('dictionChart').getHeight() * 0.8 - 40;
        var myChart = new FusionCharts(swfUrl, 'dictionChartId', divWidth, divHeight, '0', '0');

        myChart.setDataXML(datXml);
        myChart.render('dictionChartId');
    }

});