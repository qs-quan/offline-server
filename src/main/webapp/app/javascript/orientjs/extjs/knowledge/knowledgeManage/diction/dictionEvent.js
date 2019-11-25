/**
 * 词条事件
 * @author : weilei
 */
define(function (require, exports, module) {

    /**
     * 词条保存
     * @param operationType ：操作类型（新增：add-diction；编辑：edit-diction）
     * @param basicForm     ：form
     * @param store         ：数据刷新对象
     * @param window        ：窗体对象
     * @param constant     :全局常量
     */
    exports.saveDiction = function (operationType, basicForm, stroe, window, constant) {

        var url = serviceName + '/dictionController/editDiction.rdm';
        var resultMsg = "";
        if ('edit-diction' == operationType) {
            resultMsg = "编辑";
        } else {
            resultMsg = "新增";
        }
        basicForm.submit({
            clientValidation: true,
            url: url,
            method: 'post',
            params: {
                operationType: operationType,
                dictionModelName: constant.diction.dictionModelName
            },
            success: function (form, action) {
                constant.messageBox(action.result.msg);
                window.close();
                stroe.reload();
            },
            failure: function (form, action) {
                constant.messageBox(resultMsg + '失败，请联系系统管理员！');
            }
        });
    };

    /**
     * 词条点击次数
     * @param dictionId    :词条Id
     * @param constant     :全局常量
     */
    exports.saveDictionClickNum = function (dictionId, constant) {

        Ext.Ajax.request({
            url: serviceName + '/dictionController/saveDictionClickNum.rdm',
            method: 'post',
            params: {
                dictionId: dictionId,
                dictionModelName: constant.diction.dictionModelName
            },
            success: function (response, opts) {
            },
            failure: function (response, opts) {
            }
        });
    };

    /**
     * 删除词条
     * @param selections   :选择词条节点集合
     * @param store        :刷新数据集
     * @param constant     :全局常量
     */
    exports.deleteDiction = function (selections, store, constant) {

        var dictionId = '';
        for (var i = 0; i < selections.length; i++) {
            dictionId += selections[i].data.dictionId + ',';
        }
        if (dictionId.length > 0) {
            dictionId = dictionId.substring(0, dictionId.length - 1);
        }
        var url = serviceName + '/dictionController/deleteDiction.rdm';
        var params = {
            dictionId: dictionId,
            dictionModelName: constant.diction.dictionModelName
        };
        constant.deleteData(url, params, store);
    };

    /**
     * 改变词条排序按钮图标和文字
     * @param curObj   :this
     */
    exports.changeIconAndText = function (curObj) {

        var sortId = new Array();
        sortId.push('sort_dictionCreateTime');
        sortId.push('sort_dictionCommentScore');
        sortId.push('sort_dictionClickNum');

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
     * 词条数据排序
     * @param curObj   :this
     * @param store    :刷新数据集
     * @param constant :全局常量
     * @param nodeId   :类别Id
     */
    exports.sortData = function (curObj, store, constant, nodeId) {

        var sortField;
        var sortSequence;
        //创建时间
        if ('sort_dictionCreateTime' == curObj.getId()) {
            sortField = 'C_CREATE_TIME_';
            if ('dicSortDESC' == curObj.iconCls) sortSequence = 'DESC';
            else sortSequence = 'ASC';
        }
        //点击次数
        if ('sort_dictionClickNum' == curObj.getId()) {
            sortField = 'C_CLICKNUM_';
            if ('dicSortDESC' == curObj.iconCls) sortSequence = 'DESC';
            else sortSequence = 'ASC';
        }
        //评论分数
        if ('sort_dictionCommentScore' == curObj.getId()) {
            sortField = 'C_COMMENT_SCORE_';
            if ('dicSortDESC' == curObj.iconCls) sortSequence = 'DESC';
            else sortSequence = 'ASC';
        }
        store.proxy.setUrl(serviceName + '/dictionController/sortDictionData.rdm');
        store.setBaseParam('categoryId', nodeId);
        store.setBaseParam('sortField', sortField);
        store.setBaseParam('sortSequence', sortSequence);
        store.setBaseParam('start', constant.constant.dm_start);
        store.setBaseParam('limit', constant.constant.dm_limit);
        store.setBaseParam('dictionModelName', constant.diction.dictionModelName);
        store.setBaseParam('commentModelName', constant.comment.commentModelName);

        var keyword = Ext.getCmp('dictionKeyword');
        var value = keyword.getValue();
        //add Kwyword Condition
        exports.addKeywordCondition(store, value);
        //add High Condition
        exports.addHighCondition(store);

        store.load();
    };

    /**
     * 清除词条排序信息
     */
    exports.clearSortData = function () {

        var sortId = new Array();
        sortId.push('sort_dictionCreateTime');
        sortId.push('sort_dictionCommentScore');
        sortId.push('sort_dictionClickNum');

        for (var i = 0; i < sortId.length; i++) {
            var clearObj = Ext.getCmp(sortId[i]);
            clearObj.setIconClass(null);
        }
    };

    var rowNum = 0;
    /**
     * 不带移除按钮面板
     */
    exports.noHasRomoveButtonPanel = function (dictionItem) {

        rowNum++;
        var dynamicPanel = new Ext.Panel({
            id: 'dictionDynamicPanel_' + rowNum,
            layout: 'hbox',
            border: false,
            height: 26,
            style: {marginLeft: '40px'},
            items: [
                dictionItem.createDictionSearchType(rowNum),
                dictionItem.createDictionName(rowNum),
                dictionItem.createDictionJoinType(rowNum),
                dictionItem.createDictionAddButton(rowNum)
            ]
        });
        return dynamicPanel;
    }

    /**
     * 带移除按钮面板
     */
    exports.hasRomoveButtonPanel = function (dictionItem) {

        rowNum++;
        var dynamicPanel = new Ext.Panel({
            id: 'dictionDynamicPanel_' + rowNum,
            layout: 'hbox',
            border: false,
            height: 26,
            style: {marginLeft: '40px'},
            items: [
                dictionItem.createDictionSearchType(rowNum),
                dictionItem.createDictionName(rowNum),
                dictionItem.createDictionJoinType(rowNum),
                dictionItem.createDictionAddButton(rowNum),
                dictionItem.createDictionRemoveButton(rowNum)
            ]
        });
        return dynamicPanel;
    }

    /**
     * 添加一行查询条件
     */
    exports.addOneCondition = function (dictionItem, highForm) {

        if (highForm != null) {
            var addPanel = exports.hasRomoveButtonPanel(dictionItem);
            highForm.add(addPanel);
            highForm.doLayout();
            Ext.getCmp('dictionMain').doLayout();
        }
    }

    /**
     * 移除一行查询条件
     */
    exports.removeOneCondition = function (selectRow, highForm) {

        if (highForm != null) {
            var removePanel = Ext.getCmp('dictionDynamicPanel_' + selectRow);
            highForm.remove(removePanel, true);
            Ext.getCmp('dictionMain').doLayout();
        }
    }

    /**
     * 动态高级查询条件
     */
    exports.changeFieldSet = function (curRow, dictionItem) {

        var curPanel = Ext.getCmp('dictionDynamicPanel_' + curRow);
        var searchObj = Ext.getCmp('dictionSearchType_' + curRow);
        if (searchObj != null && searchObj != 'undefined') {
            //remove items
            var curItems = curPanel.items;
            var index = 0;
            curItems.each(function () {
                var tempObj = curItems.itemAt(index);
                if (tempObj != 'undefined' && tempObj != null) {
                    var tempId = tempObj.id;
                    var searchId = 'dictionSearchType_' + curRow;
                    var joinId = 'dictionJoinType_' + curRow;
                    var addBtnId = 'dictionAddButton_' + curRow;
                    var removeBtnId = 'dictionRemoveButton_' + curRow;
                    if (tempId != searchId && tempId != joinId && tempId != addBtnId && tempId != removeBtnId) {
                        curPanel.remove(tempObj, true);
                        index--;
                    }
                }
                index++;
            });
            //add items
            var searchValue = searchObj.getValue();
            if ('dictionName' == searchValue) {
                curPanel.insert(1, dictionItem.createDictionName(curRow));
            }
            if ('dictionAuthor' == searchValue) {
                curPanel.insert(1, dictionItem.createDictionAuthor(curRow));
            }
            if ('dictionCreateTime' == searchValue) {
                curPanel.insert(1, dictionItem.createDictionStartDateLabel(curRow));
                curPanel.insert(2, dictionItem.createDictionStartDate(curRow));
                curPanel.insert(3, dictionItem.createDictionEndDateLabel(curRow));
                curPanel.insert(4, dictionItem.createDictionEndDate(curRow));
            }
            curPanel.doLayout();
        }
    }

    /**
     * 检索词条
     * @param curObj   :this
     * @param store    :刷新数据集
     * @param constant :全局常量
     * @param nodeId   :类别Id
     */
    exports.searchDictionData = function (nodeId, constant) {

        var grid = Ext.getCmp('dicGridPanel');
        if (grid != null && grid != undefined) {
            var store = grid.getStore();
            var keyword = Ext.getCmp('dictionKeyword');
            var value = keyword.getValue();

            store.proxy.setUrl(serviceName + '/dictionController/searchDictionData.rdm');
            store.setBaseParam('start', constant.constant.dm_start);
            store.setBaseParam('limit', constant.constant.dm_limit);
            store.setBaseParam('categoryId', nodeId);
            store.setBaseParam('dictionModelName', constant.diction.dictionModelName);
            //add Kwyword Condition
            exports.addKeywordCondition(store, value);
            //add High Condition
            exports.addHighCondition(store);
            store.load();
        }
    };

    /**
     * 添加关键字检索条件
     * @param store    :刷新数据集
     */
    exports.addKeywordCondition = function (store, value) {

        var keyWordCondition = '';
        keyWordCondition += " AND (D.C_NAME_columnId like '%" + exports.null2String(value) + "%' ";
        keyWordCondition += " OR D.C_SOLUTION_columnId like '%" + exports.null2String(value) + "%' )";
        store.setBaseParam('keyWordCondition', keyWordCondition);
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
            var searchObj = Ext.getCmp('dictionSearchType_' + row);
            var nameObj = Ext.getCmp('dictionName_' + row);
            var authorObj = Ext.getCmp('dictionAuthor_' + row);
            var startDateObj = Ext.getCmp('dictionStartDate_' + row);
            var endDateObj = Ext.getCmp('dictionEndDate_' + row);
            var joinObj = Ext.getCmp('dictionJoinType_' + row);

            if (searchObj != null) {
                var value = searchObj.getValue();
                if ('dictionName' == value) {
                    flag = true;
                    if (nameObj != null && nameObj != undefined) highCondition += " D.C_NAME_columnId like '%" + exports.null2String(nameObj.getValue()) + "%' ";
                }
                if ("dictionAuthor" == value) {
                    flag = true;
                    if (authorObj != null && authorObj != undefined) highCondition += " all_name like '%" + exports.null2String(authorObj.getValue()) + "%' ";
                }
                if ('dictionCreateTime' == value) {
                    if (startDateObj != null && endDateObj != null) {
                        var startDate = exports.null2String(startDateObj.value);
                        var endDate = exports.null2String(endDateObj.value);
                        if ('' != startDate && '' != endDate) {
                            flag = true;
                            highCondition += " D.C_CREATE_TIME_columnId >= to_date('" + startDate + "','yyyy-MM-dd HH24:mi:ss') ";
                            highCondition += " AND D.C_CREATE_TIME_columnId <= to_date('" + endDate + "','yyyy-MM-dd HH24:mi:ss') ";
                        }
                        if ('' == startDate && '' != endDate) {
                            flag = true;
                            highCondition += " D.C_CREATE_TIME_columnId <= to_date('" + endDate + "','yyyy-MM-dd HH24:mi:ss') ";
                        }
                        if ('' != startDate && '' == endDate) {
                            flag = true;
                            highCondition += " D.C_CREATE_TIME_columnId >= to_date('" + startDate + "','yyyy-MM-dd HH24:mi:ss') ";
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

});