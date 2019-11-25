/**
 * 文档图形面板
 * @author : weilei
 */
define(function (require, exports, module) {

    exports.init = function () {

        var height = (document.body.clientHeight * 0.2 - 50) / 2;
        var chartPanel = new Ext.form.FormPanel({
            id: 'fileChart',
            region: 'center',
            border: false,
            layout: 'fit',
            html: '<div id="fileChartId" style="text-align:center;padding: ' + height + 'px;"></div>'
        });

        return chartPanel;
    };

}); 