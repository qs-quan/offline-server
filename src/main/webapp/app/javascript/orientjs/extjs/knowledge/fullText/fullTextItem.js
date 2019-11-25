/**
 * 全文检索Item
 * @author : weilei
 */
define(function (require, exports, module) {

    //动态面板，当前添加行数
    var curRow = 0;
    //全文检索检索事件
    var fullTextEvent;
    //全文检索Item
    var fullTextItem;
    //全文检索高级检索条件
    var highSearch;
    //知识管理对象
    var constant;

    /**
     * 初始化相关对象
     */
    exports.initObj = function (pFullTextEvent, pFullTextItem, pHighSearch, pConstant) {
        fullTextEvent = pFullTextEvent;
        fullTextItem = pFullTextItem;
        highSearch = pHighSearch;
        constant = pConstant;
    };

    /**
     * 创建关键词文本框
     */
    exports.createFileKeyword = function () {

        var keyword = new Ext.form.TextField({
            id: 'fileKeyword',
            width: 500,
            style: 'line-height:31px;margin:0px;padding:0px;font-size:16px',
            height: 35,
            allowBlank: false,
            enableKeyEvents: true
        });
        keyword.on('keypress', function (obj, e) {
            if (e.keyCode == 13) fullTextEvent.searchFileData(constant);
        });
        keyword.on('keydown', function (obj, e) {
            if (e.keyCode == 13) fullTextEvent.searchFileData(constant);
        });
        return keyword;
    }

    /**
     * 创建检索按钮
     */
    exports.createFileSearchButton = function () {

        var fullSearch = new Ext.Button({
            text: '检索',
            style: 'margin:2px 0px 0px 4px;',
            width: 80,
            height: 30,
            iconCls: 'dicToolbarQuery',
            handler: function () {
                fullTextEvent.searchFileData(constant);
            }
        });
        return fullSearch;
    }

    /**
     * 创建查询下拉框
     */
    exports.createFileSearchType = function (rowCount) {

        curRow = rowCount;
        var searchType = new Ext.form.ComboBox({
            id: 'fileSearchType_' + rowCount,
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
                    ['fileName', '名称'],
                    ['fileCategory', '类别'],
                    ['fileAuthor', '作者'],
                    ['fileCreateTime', '创建时间']
                ]
            })
        });
        searchType.on('select', function () {
            var id = this.id;
            var selectRow = id.split('_')[1];
            fullTextEvent.changeFieldSet(selectRow, fullTextItem);
        });
        return searchType;
    }

    /**
     * 创建文件类别文本框，存储文件类别ID
     */
    exports.createFileCategoryId = function (rowCount) {

        var fileCategoryId = new Ext.form.TextField({
            id: 'fileCategoryId_' + rowCount,
            hidden: true
        });
        return fileCategoryId;
    }

    /**
     * 创建文件类别下拉树
     */
    exports.createFileCategory = function (rowCount) {

        Ext.override(Ext.form.ComboBox, {
            onViewClick: function (doFocus) {
                var index = this.view.getSelectedIndexes()[0], s = this.store, r = s.getAt(index);
                if (r) this.onSelect(r, index);
                else if (s.getCount() == 0) this.collapse();
                if (doFocus != false) this.el.focus();
            }
        });

        var cateStore = new Ext.data.SimpleStore({
            fields: [],
            data: [[]]
        });

        var fileCategory = new Ext.form.ComboBox({
            id: 'fileCategory_' + rowCount,
            tpl: "<tpl for='.'><div style='height:150px'><div id='tree_" + rowCount + "'></div></div></tpl>",
            mode: 'local',
            width: 440,
            store: cateStore,
            style: {marginBottom: '4px'},
            editable: false,
            emptyText: '请选择.',
            maxHeight: 300,
            triggerAction: 'all',
            selectedClass: '',
            onSelect: Ext.emptyFn
        });

        var saveButton = new Ext.Button({
            text: '确定',
            width: 35,
            iconCls: 'cateFormSave',
            handler: function () {
                var selectCateId = "";
                var selectCateName = "";
                var selectNodes = tree.getChecked();
                for (var i = 0; i < selectNodes.length; i++) {
                    selectCateId += selectNodes[i].attributes.id + ",";
                    selectCateName += selectNodes[i].attributes.text + ",";
                }
                if ("" != selectCateName) {
                    selectCateId = selectCateId.substring(0, selectCateId.length - 1);
                    selectCateName = selectCateName.substring(0, selectCateName.length - 1);
                }
                var cateIdObj = Ext.getCmp('fileCategoryId_' + rowCount);
                if (cateIdObj != null) cateIdObj.setValue(selectCateId);
                fileCategory.setValue(selectCateName);
                fileCategory.collapse();
            }
        });

        var closeButton = new Ext.Button({
            text: '清除',
            width: 35,
            iconCls: 'cateFormClose',
            handler: function () {
                var selectNodes = tree.getChecked();
                for (var i = 0; i < selectNodes.length; i++) selectNodes[i].getUI().toggleCheck(false)
                var cateIdObj = Ext.getCmp('fileCategoryId_' + rowCount);
                if (cateIdObj != null) cateIdObj.setValue('');
                fileCategory.setValue('');
                fileCategory.collapse();
            }
        });

        var tree = new Ext.tree.TreePanel({
            scope: this,
            split: true,
            border: true,
            height: 200,
            root: constant.getRootNode(),
            loader: constant.getTreeLoader('fullText'),
            autoScroll: true,
            rootVisible: false,
            buttons: [saveButton, closeButton]
        });

        tree.on('checkchange', function (node, state) {
            if (node.parentNode != null) {
                node.cascade(function (node) {
                    node.attributes.checked = state;
                    node.ui.checkbox.checked = state;
                    return true;
                });
                var pNode = node.parentNode;
                if (pNode.hasChildNodes()) {
                    var total = 0;
                    for (var i = 0; i < pNode.childNodes.length; i++) {
                        var childNode = pNode.childNodes[i];
                        if (childNode.attributes.checked == state) total++;
                    }
                    if (total == pNode.childNodes.length) pNode.getUI().toggleCheck(state);
                }
            }
        });
        fileCategory.on('expand', function () {
            tree.render('tree_' + rowCount);
        });

        return fileCategory;
    }

    /**
     * 创建文档文本框
     */
    exports.createFileName = function (rowCount) {

        var fileName = new Ext.form.TextField({
            id: 'fileName_' + rowCount,
            width: 440,
            anchor: '95%',
            style: {marginBottom: '4px'}
        });
        return fileName;
    }

    /**
     * 创建作者文本框
     */
    exports.createFileAuthor = function (rowCount) {

        var fileAuthor = new Ext.form.TextField({
            id: 'fileAuthor_' + rowCount,
            width: 440,
            style: {marginBottom: '4px'}
        });
        return fileAuthor;
    }

    /**
     * 创建起始日期标签控件
     */
    exports.createFileStartDateLabel = function (rowCount) {

        var fileStartDateLabel = new Ext.form.Label({
            text: '起始日期',
            style: 'font-size:12px;margin:3px auto;'
        });
        return fileStartDateLabel;
    }

    /**
     * 创建起始日期控件
     */
    exports.createFileStartDate = function (rowCount) {

        var fileStartDate = new Ext.form.DateField({
            id: 'fileStartDate_' + rowCount,
            width: 172,
            editable: false,
            format: 'Y-m-d'
        });
        return fileStartDate;
    }

    /**
     * 创建起始日期标签控件
     */
    exports.createFileEndDateLabel = function (rowCount) {

        var fileEndDateLabel = new Ext.form.Label({
            text: '结束日期',
            style: 'font-size:12px;margin:3px auto;'
        });
        return fileEndDateLabel;
    }

    /**
     * 创建结束日期控件
     */
    exports.createFileEndDate = function (rowCount) {

        var fileEndDate = new Ext.form.DateField({
            id: 'fileEndDate_' + rowCount,
            width: 172,
            editable: false,
            format: 'Y-m-d'
        });
        return fileEndDate;
    }

    /**
     * 创建并/交集下拉框
     */
    exports.createFileJoinType = function (rowCount) {

        var joinType = new Ext.form.ComboBox({
            id: 'fileJoinType_' + rowCount,
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
    exports.createFileAddButton = function (rowCount) {

        var addButton = new Ext.Button({
            id: 'fileAddButton_' + rowCount,
            iconCls: 'cateToolbarAdd',
            handler: function () {
                curRow++;
                fullTextEvent.addOneCondition(fullTextItem, highSearch);
            }
        });
        return addButton;
    }

    /**
     * 创建移除按钮
     */
    exports.createFileRemoveButton = function (rowCount) {

        var removeButton = new Ext.Button({
            id: 'fileRemoveButton_' + rowCount,
            iconCls: 'cateToolbarDelete',
            handler: function () {
                var id = this.id;
                var selectRow = id.split('_')[1];
                fullTextEvent.removeOneCondition(selectRow, highSearch);
            }
        });
        return removeButton
    }

});