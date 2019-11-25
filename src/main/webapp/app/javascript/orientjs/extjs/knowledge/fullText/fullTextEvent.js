/**
 * 全文检索事件
 * @author : weilei
 */
define(function (require, exports, module) {

    /**
     * 改变文档排序按钮图标和文字
     * @param curObj   :this
     */
    exports.changeIconAndText = function (curObj) {

        var sortId = new Array();
        sortId.push('sort_fileMaching');
        sortId.push('sort_fileCreateTime');
        sortId.push('sort_fileClickNum');

        var id = curObj.getId();
        for (var i = 0; i < sortId.length; i++) {
            if (id != sortId[i]) {
                var tempObj = Ext.getCmp(sortId[i]);
                tempObj.setIconClass(null);
            }
        }
        var icon = curObj.iconCls;
        if (icon == 'undefined' || icon == 'dicSortDESC') curObj.setIconClass('dicSortASC');
        else curObj.setIconClass('dicSortDESC');
    };

    /**
     * 文档数据排序
     * @param curObj   :this
     * @param store    :刷新数据集
     * @param constant :全局常量
     * @param nodeId   :类别Id
     */
    exports.sortData = function (curObj, store, constant) {

        if (exports.isValid()) return;
        var sortField;
        var sortSequence;
        //关键字匹配度
        if ('sort_fileMaching' == curObj.getId()) {
            sortField = 'C_MACHING_';
            if ('dicSortDESC' == curObj.iconCls) sortSequence = 'DESC';
            else sortSequence = 'ASC';
        }
        //点击次数
        if ('sort_fileClickNum' == curObj.getId()) {
            sortField = 'C_FILECLICKNUM_';
            if ('dicSortDESC' == curObj.iconCls) sortSequence = 'DESC';
            else sortSequence = 'ASC';
        }
        //创建时间
        if ('sort_fileCreateTime' == curObj.getId()) {
            sortField = 'C_UPLOAD_TIME_';
            if ('dicSortDESC' == curObj.iconCls) sortSequence = 'DESC';
            else sortSequence = 'ASC';
        }
        store.proxy.setUrl(serviceName + '/fullTextController/searchFileData.rdm');
        store.setBaseParam('start', constant.constant.ft_start);
        store.setBaseParam('limit', constant.constant.ft_limit);
        store.setBaseParam('fileModelName', constant.file.fileModelName);
        var keyword = Ext.getCmp('fileKeyword');
        var value = keyword.getValue();
        store.setBaseParam('fileKeyword', value);
        store.setBaseParam('sortField', sortField);
        store.setBaseParam('sortSequence', sortSequence);
        //add High Condition
        exports.addHighCondition(store);
        store.reload({
            callback: function (records, options, success) {//默认展开摘要信息
                if (success) {
                    var expander = constant.constant.myExpander;
                    exports.expandRow(records, expander)
                }
            }
        });
    };

    /**
     * 清除文档排序信息
     */
    exports.clearSortData = function () {

        var sortId = new Array();
        sortId.push('sort_fileMaching');
        sortId.push('sort_fileCreateTime');
        sortId.push('sort_fileClickNum');

        for (var i = 0; i < sortId.length; i++) {
            var clearObj = Ext.getCmp(sortId[i]);
            clearObj.setIconClass(null);
        }
    };

    var rowNum = 0;
    /**
     * 不带移除按钮面板
     */
    exports.noHasRomoveButtonPanel = function (fullTextItem) {

        rowNum++;
        var dynamicPanel = new Ext.Panel({
            id: 'fileDynamicPanel_' + rowNum,
            layout: 'hbox',
            border: false,
            height: 26,
            style: {marginLeft: '40px'},
            items: [
//			{
//				border : false,
//				width : 150,
//				items : [fullTextItem.createFileSearchType(rowNum)]
//			},{
//				border : false,
//				width : 440,
//				items : [fullTextItem.createFileName(rowNum)]
//			},{
//				border : false,
//				width : 80,
//				items : [fullTextItem.createFileJoinType(rowNum)]
//			},{
//				border : false,
//				width : 40,
//				items : [fullTextItem.createFileAddButton(rowNum)]
//			}
                fullTextItem.createFileSearchType(rowNum),
                fullTextItem.createFileName(rowNum),
                fullTextItem.createFileJoinType(rowNum),
                fullTextItem.createFileAddButton(rowNum)
            ]
        });
        return dynamicPanel;
    }

    /**
     * 带移除按钮面板
     */
    exports.hasRomoveButtonPanel = function (fullTextItem) {

        rowNum++;
        var dynamicPanel = new Ext.Panel({
            id: 'fileDynamicPanel_' + rowNum,
            layout: 'hbox',
            border: false,
            height: 26,
            style: {marginLeft: '40px'},
            items: [
                fullTextItem.createFileSearchType(rowNum),
                fullTextItem.createFileName(rowNum),
                fullTextItem.createFileJoinType(rowNum),
                fullTextItem.createFileAddButton(rowNum),
                fullTextItem.createFileRemoveButton(rowNum)
            ]
        });
        return dynamicPanel;
    }

    /**
     * 添加一行查询条件
     */
    exports.addOneCondition = function (fullTextItem, highForm) {

        if (highForm != null) {
            var addPanel = exports.hasRomoveButtonPanel(fullTextItem);
            highForm.add(addPanel);
            highForm.doLayout();
            Ext.getCmp('fullTextMain').doLayout();
        }
    }

    /**
     * 移除一行查询条件
     */
    exports.removeOneCondition = function (selectRow, highForm) {

        if (highForm != null) {
            var removePanel = Ext.getCmp('fileDynamicPanel_' + selectRow);
            highForm.remove(removePanel, true);
            Ext.getCmp('fullTextMain').doLayout();
        }
    }

    /**
     * 动态高级查询条件
     */
    exports.changeFieldSet = function (curRow, fullTextItem) {

        var curPanel = Ext.getCmp('fileDynamicPanel_' + curRow);
        var searchObj = Ext.getCmp('fileSearchType_' + curRow);
        if (searchObj != null && searchObj != 'undefined') {
            //remove items
            var curItems = curPanel.items;
            var index = 0;
            curItems.each(function () {
                var tempObj = curItems.itemAt(index);
                if (tempObj != 'undefined' && tempObj != null) {
                    var tempId = tempObj.id;
                    var searchId = 'fileSearchType_' + curRow;
                    var joinId = 'fileJoinType_' + curRow;
                    var addBtnId = 'fileAddButton_' + curRow;
                    var removeBtnId = 'fileRemoveButton_' + curRow;
                    if (tempId != searchId && tempId != joinId && tempId != addBtnId && tempId != removeBtnId) {
                        curPanel.remove(tempObj, true);
                        index--;
                    }
                }
                index++;
            });
            //add items
            var searchValue = searchObj.getValue();
            if ('fileName' == searchValue) {
                curPanel.insert(1, fullTextItem.createFileName(curRow));
            }
            if ('fileCategory' == searchValue) {
                curPanel.insert(1, fullTextItem.createFileCategoryId(curRow));
                curPanel.insert(2, fullTextItem.createFileCategory(curRow));
            }
            if ('fileAuthor' == searchValue) {
                curPanel.insert(1, fullTextItem.createFileAuthor(curRow));
            }
            if ('fileCreateTime' == searchValue) {
                curPanel.insert(1, fullTextItem.createFileStartDateLabel(curRow));
                curPanel.insert(2, fullTextItem.createFileStartDate(curRow));
                curPanel.insert(3, fullTextItem.createFileEndDateLabel(curRow));
                curPanel.insert(4, fullTextItem.createFileEndDate(curRow));
            }
            curPanel.doLayout();
        }
    }

    /**
     * 检索文档
     * @param curObj   :this
     * @param store    :刷新数据集
     * @param constant :全局常量
     * @param nodeId   :类别Id
     */
    exports.searchFileData = function (constant) {

        if (exports.isValid()) return;
        var grid = Ext.getCmp('fullTextPanel');
        if (grid != null && grid != undefined) {
            var store = grid.getStore();
            var keyword = Ext.getCmp('fileKeyword');
            var value = keyword.getValue();

            store.proxy.setUrl(serviceName + '/fullTextController/searchFileData.rdm');
            store.setBaseParam('start', constant.constant.ft_start);
            store.setBaseParam('limit', constant.constant.ft_limit);
            store.setBaseParam('fileModelName', constant.file.fileModelName);
            store.setBaseParam('keyword', value);
            store.setBaseParam('sortField', 'C_MACHING_');
            store.setBaseParam('sortSequence', 'DESC');
            //add High Condition
            exports.addHighCondition(store);
            store.reload({
                callback: function (records, options, success) {//默认展开摘要信息
                    if (success) {
                        var expander = constant.constant.myExpander;
                        exports.expandRow(records, expander)
                    }
                }
            });
        }
    };

    /**
     * 添加高级检索条件
     * @param store    :刷新数据集
     */
    exports.addHighCondition = function (store) {

        var highCondition = '';
        var joinValue = '';
        var flag = false;
        for (var row = 1; row <= rowNum; row++) {
            var searchObj = Ext.getCmp('fileSearchType_' + row);
            var nameObj = Ext.getCmp('fileName_' + row);
            var categoryObj = Ext.getCmp('fileCategoryId_' + row);
            var authorObj = Ext.getCmp('fileAuthor_' + row);
            var startDateObj = Ext.getCmp('fileStartDate_' + row);
            var endDateObj = Ext.getCmp('fileEndDate_' + row);
            var joinObj = Ext.getCmp('fileJoinType_' + row);

            if (searchObj != null) {
                var value = searchObj.getValue();
                if ('fileName' == value) {
                    flag = true;
                    if (nameObj != null && nameObj != undefined) highCondition += " F.C_NAME_columnId like '%" + exports.null2String(nameObj.getValue()) + "%' ";
                }
                if ("fileCategory" == value) {
                    if (categoryObj != null && categoryObj != undefined) {
                        if (categoryObj.getValue() != '') {
                            flag = true;
                            highCondition += " F.T_CATEGORY_tableId_ID in (" + exports.null2String(categoryObj.getValue()) + ") ";
                        }
                    }
                }
                if ("fileAuthor" == value) {
                    flag = true;
                    if (authorObj != null && authorObj != undefined) highCondition += " all_name like '%" + exports.null2String(authorObj.getValue()) + "%' ";
                }
                if ('fileCreateTime' == value) {
                    if (startDateObj != null && endDateObj != null) {
                        var startDate = exports.null2String(startDateObj.value);
                        var endDate = exports.null2String(endDateObj.value);
                        if ('' != startDate && '' != endDate) {
                            flag = true;
                            highCondition += " F.C_UPLOAD_TIME_columnId >= to_date('" + startDate + "','yyyy-MM-dd HH24:mi:ss') ";
                            highCondition += " AND F.C_UPLOAD_TIME_columnId <= to_date('" + endDate + "','yyyy-MM-dd HH24:mi:ss') ";
                        }
                        if ('' == startDate && '' != endDate) {
                            flag = true;
                            highCondition += " F.C_UPLOAD_TIME_columnId <= to_date('" + endDate + "','yyyy-MM-dd HH24:mi:ss') ";
                        }
                        if ('' != startDate && '' == endDate) {
                            flag = true;
                            highCondition += " F.C_UPLOAD_TIME_columnId >= to_date('" + startDate + "','yyyy-MM-dd HH24:mi:ss') ";
                        }
                    }
                }
                if (flag) {
                    if (joinObj != null && joinObj != undefined) {
                        joinValue = joinObj.getValue();
                        if ('与' == joinObj.getValue()) joinValue = 'AND ';
                        else joinValue = 'OR ';
                        highCondition += joinValue;
                    }
                }
                flag = false;
            }
        }
        highCondition = highCondition.substring(0, highCondition.length - joinValue.length);
        store.setBaseParam('highCondition', highCondition);
    };

    /**
     * NULL2String
     */
    exports.null2String = function (value) {
        if (value == '' || value == undefined) return "";
        return value;
    };

    /**
     * 摘要
     * @param isShow :
        *            false：不显示摘要；反之。
     */
    exports.initRowExpander = function (isShow) {

        var expander = new Ext.ux.grid.RowExpander({
            id: 'myExpander',
            width: 0,
            expandOnEnter: false,
            enableCaching: false,
            expandOnDblClick: false,
            renderer: function (v, p, record) {
                p.cellAttr = 'rowspan="2"';
                return record.get("data") ? '<div class="x-grid3-row-expander">&#160;</div>' : "";
            },
            tpl: new Ext.Template(exports.loadRowExpanderContent(isShow))
        });
        return expander;
    };

    /**
     * 摘要内容（关键字+摘要+可见范围+密级+作者+时间+附件+操作[预览、下载]）
     * @param isShow :
        *            false：不显示摘要；反之。
     */
    exports.loadRowExpanderContent = function (isShow) {

        var marginStyle = '<p style="margin: 15px 20px 10px 40px !important;">';
        var content = '';
        content += marginStyle + '<b><font color="#555">关键字：</font></b>&nbsp;{keyword}</p>';
        content += marginStyle + '<b><font color="#555">摘要：</font></b>&nbsp;&nbsp;&nbsp;&nbsp;{summary}</p>';
        content += marginStyle + '<b><font color="#555">属性：</font></b>&nbsp;&nbsp;&nbsp;&nbsp;'
            + '<b><font color="#083772">可见范围：</font></b>{previewArea}&nbsp;&nbsp;&nbsp;'
            + '<b><font color="#083772">密级：</font></b>{security}&nbsp;&nbsp;&nbsp;'
            + '<b><font color="#083772">作者：</font></b>{uploadUserId}&nbsp;&nbsp;&nbsp;'
            + '<b><font color="#083772">创建时间：</font></b>{createTime}</p>';
        content += marginStyle + '<b><font color="#555">附件：</font></b>&nbsp;&nbsp;&nbsp;&nbsp;'
            + '<a>{name}.{type}</a>&nbsp;&nbsp;'
        if (isShow != "false") {
            content += '<a href="javascript:void(0);" onclick="(function(){return arguments[2].apply(this,[arguments[0],arguments[1]]);})({id},\'{type}\',' + previewFile + ').call()">预览</a>&nbsp;&nbsp;'
            content += '<a href="javascript:void(0);" onclick="(function(){return arguments[1].apply(this,[arguments[0]]);})({id},' + downloadFile + ').call()">下载</a>&nbsp;&nbsp;';
        }
        return content;
    };

    /**
     * 默认展开摘要内容
     * @param records:
     * @param expander:
     */
    exports.expandRow = function (records, expander) {
        for (var i = 0; i < records.length; i++) expander.expandRow(i);
    }

    /**
     * 关键字检索非空检验
     */
    exports.isValid = function () {
        var fullTextForm = Ext.getCmp('fullTextForm');
        if (fullTextForm != null && fullTextForm != undefined) {
            var basicForm = fullTextForm.getForm();
            if (!basicForm.isValid()) return true;
            else return false;
        }
    }

});