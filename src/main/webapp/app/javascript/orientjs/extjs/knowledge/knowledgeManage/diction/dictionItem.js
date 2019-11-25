/**
 * 词条检索Item
 * @author : weilei
 */
define(function (require, exports, module) {

    //动态面板，当前添加行数
    var curRow = 0;
    //词条检索事件
    var dictionEvent;
    //词条高级检索FS
    var dictionItem;
    //词条高级检索FS
    var highSearch;

    var pConstant;
    //词条高级检索FS
    var pNodeId;

    /**
     * 初始化相关对象
     */
    exports.initObj = function (pDictionEvent, pDictionItem, pHighSearch, pConstant, pNodeId) {
        dictionEvent = pDictionEvent;
        dictionItem = pDictionItem;
        highSearch = pHighSearch;
        constant = pConstant;
        nodeId = pNodeId;
    };

    /**
     * 初始化相关对象
     */
    exports.reloadData = function (pNodeId) {
        nodeId = pNodeId;
    };

    /**
     * 创建关键词文本框
     */
    exports.createDictionKeyword = function () {

        var keyword = new Ext.form.TextField({
            id: 'dictionKeyword',
            width: 500,
            style: 'line-height:31px;margin:0px;padding:0px;font-size:16px',
            height: 35,
            allowBlank: false,
            enableKeyEvents: true
        });
        keyword.on('keypress', function (obj, e) {
            if (e.keyCode == 13) dictionEvent.searchDictionData(nodeId, constant);
        });
        keyword.on('keydown', function (obj, e) {
            if (e.keyCode == 13) dictionEvent.searchDictionData(nodeId, constant);
        });
        return keyword;
    }

    /**
     * 创建检索按钮
     */
    exports.createDictionSearchButton = function () {

        var fullSearch = new Ext.Button({
            text: '检索',
            style: 'margin:2px 0px 0px 4px;',
            width: 80,
            height: 30,
            iconCls: 'dicToolbarQuery',
            handler: function () {
                dictionEvent.searchDictionData(nodeId, constant);
            }
        });
        return fullSearch;
    }

    /**
     * 创建查询下拉框
     */
    exports.createDictionSearchType = function (rowCount) {

        curRow = rowCount;
        var searchType = new Ext.form.ComboBox({
            id: 'dictionSearchType_' + rowCount,
            mode: 'local',
            width: 150,
            editable: false,
            emptyText: '请选择.',
            valueField: 'type',
            displayField: 'value',
            triggerAction: 'all',
            store: new Ext.data.ArrayStore({
                autoDestroy: true,
                fields: ['type', 'value'],
                data: [
                    ['dictionName', '名称'],
                    ['dictionAuthor', '作者'],
                    ['dictionCreateTime', '创建时间']
                ]
            })
        });
        searchType.on('select', function () {
            var id = this.id;
            var selectRow = id.split('_')[1];
            dictionEvent.changeFieldSet(selectRow, dictionItem);
        });
        return searchType;
    }

    /**
     * 创建词条文本框
     */
    exports.createDictionName = function (rowCount) {

        var dictionName = new Ext.form.TextField({
            id: 'dictionName_' + rowCount,
            width: 440,
            anchor: '95%',
            style: {marginBottom: '4px'}
        });
        return dictionName;
    }

    /**
     * 创建作者文本框
     */
    exports.createDictionAuthor = function (rowCount) {

        var dictionAuthor = new Ext.form.TextField({
            id: 'dictionAuthor_' + rowCount,
            width: 440,
            style: {marginBottom: '4px'}
        });
        return dictionAuthor;
    }

    /**
     * 创建起始日期标签控件
     */
    exports.createDictionStartDateLabel = function (rowCount) {

        var dictionStartDateLabel = new Ext.form.Label({
            text: '起始日期',
            style: 'font-size:12px;margin:3px auto;'
        });
        return dictionStartDateLabel;
    }

    /**
     * 创建起始日期控件
     */
    exports.createDictionStartDate = function (rowCount) {

        var dictionStartDate = new Ext.form.DateField({
            id: 'dictionStartDate_' + rowCount,
            width: 172,
            editable: false,
            format: 'Y-m-d'
        });
        return dictionStartDate;
    }

    /**
     * 创建起始日期标签控件
     */
    exports.createDictionEndDateLabel = function (rowCount) {

        var dictionEndDateLabel = new Ext.form.Label({
            text: '结束日期',
            style: 'font-size:12px;margin:3px auto;'
        });
        return dictionEndDateLabel;
    }

    /**
     * 创建结束日期控件
     */
    exports.createDictionEndDate = function (rowCount) {

        var dictionEndDate = new Ext.form.DateField({
            id: 'dictionEndDate_' + rowCount,
            width: 172,
            editable: false,
            format: 'Y-m-d'
        });
        return dictionEndDate;
    }

    /**
     * 创建并/交集下拉框
     */
    exports.createDictionJoinType = function (rowCount) {

        var joinType = new Ext.form.ComboBox({
            id: 'dictionJoinType_' + rowCount,
            mode: 'local',
            width: 80,
            value: '与',
            editable: false,
            emptyText: '请选择',
            valueField: 'type',
            displayField: 'value',
            triggerAction: 'all',
            store: new Ext.data.ArrayStore({
                autoDestroy: true,
                fields: ['type', 'value'],
                data: [
                    ['AND', '与'],
                    ['OR', '或']
                ]
            })
        });
        return joinType;
    }

    /**
     * 创建添加按钮
     */
    exports.createDictionAddButton = function (rowCount) {

        var addButton = new Ext.Button({
            id: 'dictionAddButton_' + rowCount,
            iconCls: 'cateToolbarAdd',
            handler: function () {
                curRow++;
                dictionEvent.addOneCondition(dictionItem, highSearch);
            }
        });
        return addButton;
    }

    /**
     * 创建移除按钮
     */
    exports.createDictionRemoveButton = function (rowCount) {

        var removeButton = new Ext.Button({
            id: 'dictionRemoveButton_' + rowCount,
            iconCls: 'cateToolbarDelete',
            handler: function () {
                var id = this.id;
                var selectRow = id.split('_')[1];
                dictionEvent.removeOneCondition(selectRow, highSearch);
            }
        });
        return removeButton
    }

});