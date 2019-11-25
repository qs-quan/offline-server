/**
 * 知识统计Item
 * @author : weilei
 */
define(function (require, exports, module) {

    /**
     * 创建统计时间轴标签
     */
    exports.createCountLabel = function () {

        var countlabel = new Ext.form.Label({
            fieldLabel: '统计时间轴',
            labelStyle: 'margin:0px 0px 0px 5px;'
        });
        return countlabel;
    }

    /**
     * 创建起始日期控件
     */
    exports.createStartDate = function () {

        var countStartDate = new Ext.form.DateField({
            name: 'startDate',
            width: 100,
            editable: false,
            format: 'Y-m-d',
            labelStyle: 'margin-left:10px;width:60px;',
            fieldLabel: '起始日期'
        });
        return countStartDate;
    }

    /**
     * 创建结束日期控件
     */
    exports.createEndDateLabel = function () {

        var countEndDate = new Ext.form.DateField({
            name: 'endDate',
            width: 100,
            editable: false,
            format: 'Y-m-d',
            labelStyle: 'margin-left:10px;width:60px;',
            fieldLabel: '结束日期'
        });
        return countEndDate;
    }

    /**
     * 创建统计位数
     */
    exports.createCountNum = function () {

        var countNum = new Ext.form.TextField({
            name: 'countNum',
            width: 40,
            value: '10',
            labelStyle: 'margin-left:10px;width:60px;',
            fieldLabel: '统计位数'
        });
        return countNum;
    }

    /**
     * 创建词条统计类型控件
     */
    exports.createDcitionCountType = function () {

        var countType = new Ext.form.ComboBox({
            name: 'countType',
            mode: 'local',
            width: 150,
            editable: false,
            emptyText: '请选择.',
            valueField: 'type',
            fieldLabel: '统计条件',
            labelStyle: 'margin-left:10px;width:60px;',
            allowBlank: false,
            displayField: 'value',
            triggerAction: 'all',
            store: new Ext.data.ArrayStore({
                autoDestroy: true,
                fields: ['type', 'value'],
                data: [
                    ['countByUser', '按个人贡献度统计'],
                    ['countByUseNum', '按点击次数统计'],
                    ['countByCommentNum', '按点评次数统计']
                ]
            })
        });
        return countType;
    }

    /**
     * 创建文档统计类型控件
     */
    exports.createFileCountType = function () {

        var countType = new Ext.form.ComboBox({
            name: 'countType',
            mode: 'local',
            width: 150,
            editable: false,
            emptyText: '请选择.',
            valueField: 'type',
            labelStyle: 'margin-left:10px;width:60px;',
            fieldLabel: '统计条件',
            allowBlank: false,
            displayField: 'value',
            triggerAction: 'all',
            store: new Ext.data.ArrayStore({
                autoDestroy: true,
                fields: ['type', 'value'],
                data: [
                    ['countByDepartment', '按部门统计'],
                    ['countByPreviewNum', '按预览次数统计'],
                    ['countByDownloadNum', '按下载次数统计']
                ]
            })
        });
        return countType;
    }

    /**
     * 创建知识统计视图[折线图、柱状图、饼形图(2D/3D)]
     */
    exports.createCountView = function () {

        var countView = new Ext.form.ComboBox({
            name: 'countView',
            mode: 'local',
            width: 100,
            editable: false,
            emptyText: '请选择.',
            valueField: 'type',
            labelStyle: 'margin-left:10px;width:60px;',
            fieldLabel: '统计视图',
            allowBlank: false,
            displayField: 'value',
            triggerAction: 'all',
            store: new Ext.data.ArrayStore({
                autoDestroy: true,
                fields: ['type', 'value'],
                data: [
                    ['Line', '折线图'],
                    ['Column2D', '柱状图'],
                    ['Pie2D', '饼图']
//							      ['Pie3D','3D饼图']
                ]
            })
        });
        return countView;
    }
    /**
     * 创建统计按钮
     */
    exports.createCountButton = function (id, objectEvent, constant) {

        var countButton = new Ext.Button({
            text: '统计',
            iconCls: 'countButton',
            style: 'margin:0px 0px 0px 5px;',
            handler: function () {
                var curForm = Ext.getCmp(id);
                if (curForm != null && curForm != 'undefined') {
                    var basicForm = curForm.getForm();
                    if (basicForm.isValid()) {
                        if ('dictionCountForm' == id) objectEvent.dictionCount(basicForm, constant);
                        if ('fileCountForm' == id) objectEvent.fileCount(basicForm, constant);
                    }
                }
            }
        });
        return countButton;
    }

    /**
     * 创建重置按钮
     */
    exports.createResetButton = function (id) {

        var resetButton = new Ext.Button({
            text: '重置',
            iconCls: 'redo',
            style: 'margin:0px 0px 0px 5px;',
            handler: function () {
                var curForm = Ext.getCmp(id);
                if (curForm != null && curForm != 'undefined') {
                    var basicForm = curForm.getForm();
                    basicForm.reset();
                }
            }
        });
        return resetButton
    }

});