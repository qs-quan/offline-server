/**
 * Created by enjoyjava on 01/12/2016.
 */
Ext.define('OrientTdm.BackgroundMgr.DocReport.Common.DocReportViewPanle', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.docReportViewPanel',
    config: {
        reportName: ''
    },
    requires: [],
    initComponent: function () {
        var me = this;
        me.addEvents({
            initDocPreview: true,
            cleanPreview: true
        });
        Ext.apply(me, {
            tbar: [
                {
                    text: '当前时间',
                    iconCls: 'icon-currentTime',
                    scope: me,
                    handler: Ext.bind(me._insertCurrent, me, ['当前时间'], false)
                },
                {
                    text: '当前日期',
                    iconCls: 'icon-currentDate',
                    scope: me,
                    handler: Ext.bind(me._insertCurrent, me, ['当前日期'], false)
                },
                {
                    text: '当前用户',
                    iconCls: 'icon-currentUser',
                    scope: me,
                    handler: Ext.bind(me._insertCurrent, me, ['当前用户'], false)
                },
                {
                    text: '当前部门',
                    iconCls: 'icon-currentDep',
                    scope: me,
                    handler: Ext.bind(me._insertCurrent, me, ['当前部门'], false)
                }
            ]
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
            '/app/views/doctemplate/docTemplateView.jsp?itemId=' + itemId + '&reportName=' + reportName + '"></iframe>',
            layout: 'fit',
            height: me.getHeight() - 30
        });
    },
    getReportName: function () {
        var me = this;
        var northPanel = me.up().northPanelComponent;
        var reportNameField = northPanel.down('textfield[name=reportName]');
        if (reportNameField) {
            return reportNameField.getValue();
        } else
            return null;
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