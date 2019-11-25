/**
 * 文档在线查看、编辑
 */
Ext.define('OrientTdm.TestInfo.ExperimentTypeMgr.Doc.DocReportViewPanle', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.docReportViewPanel',
    config: {
        reportName: ''
    },
    requires: [

    ],
    initComponent: function () {
        var me = this;
        me.addEvents({
            initDocPreview: true,
            cleanPreview: true
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'initDocPreview', me._initDocPreview, me);
        me.mon(me, 'cleanPreview', me._cleanPreview, me);
        me.callParent(arguments);
    },
    _cleanPreview: function () {
        var me = this;
        me.removeAll();
    },
    _initDocPreview: function (reportName) {
        var me = this;
        me.removeAll();
        var itemId = me.getItemId();
        reportName = reportName || "";
        me.reportName = reportName;
        me.add({
            xtype: 'orientPanel',
            html: '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" style="z-index:100;" src = "' + serviceName +
            '/app/views/doctemplate/docTemplateView.jsp?isFtpHome=' + true + '&itemId=' + itemId + '&reportName=' + reportName + '"></iframe>',
            layout: 'fit',
            height: me.getHeight() - 30
        });
    },

    /**
     * 获取用户输入的条件（**）名称
     * @returns {*}
     */
    getReportName: function () {
        return Ext.getCmp('customName').getValue();
    },

    insertBookMark: function (bookMarks) {
        var me = this;
        me.sonWindow.insertBookMark(bookMarks);
    },

    saveToFtpHome: function () {
        var me = this;
        if (Ext.isEmpty(me.reportName)) {
            var reportName = me.getReportName();
            if (reportName) {
                //get current timestamp
                var realReportName = reportName + '_' + Ext.Date.format(new Date(), 'YmdHis') + '.doc';
                me.sonWindow.doSave(realReportName);
                return realReportName;
            } else {
                alert('报告名称不可为空!');
            }
        } else {
            me.sonWindow.doSave(me.reportName);
            return me.reportName;
        }
    },
    _insertCurrent: function (type) {
        var me = this;
        if (me.sonWindow) {
            var bookMarkNames = [[type, '当前信息处理器'].join('.')];
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DocReportItems/saveBookMarks.rdm', {
                bookMarkNames: bookMarkNames
            }, true, function (resp) {
                //insert into doc
                var savedBookMarks = resp.decodedData.results;
                me.insertBookMark(savedBookMarks);
            });
        }
    }
});