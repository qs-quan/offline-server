/**
 * Created by Administrator on 2016/8/5 0005.
 * 动态表格实现
 */
DynamicTable = (new (function () {

}));

/**
 * 初始化
 */
DynamicTable.init = function () {
    var checkDivs = $('div.dynamicTable');
    $.each(checkDivs, function (index, checkDiv) {
        var columnName = $(checkDiv).attr('name');
        var atta = $("textarea[name='" + columnName + "']");
        var jsonStr = atta.val();
        jsonStr = jsonStr.replaceAll("￥@@￥", "\"");
        DynamicTable.initTableByValue(checkDiv, jsonStr);

    });
};

DynamicTable.initTableByValue = function (container, jsonStr) {
    var rawDatas = $.isEmpty(jsonStr) ? [] : JSON2.parse(jsonStr);
    var columns = [];
    $.each(rawDatas, function (index, rowData) {
        if (index == 0) {
            for (var pro in rowData) {
                columns.push({
                    display: pro,
                    name: pro,
                    editor: {type: 'text'}
                });
            }
        }
    });
    var gridData = {
        Rows: rawDatas,
        Total: rawDatas.length
    };
    //初始化column
    $(container).ligerGrid({
        title: $(container).attr("filedText"),
        columns: columns,
        checkbox: true,
        enabledEdit: true,
        width: '100%',
        data: gridData,
        usePager: false,
        toolbar: {
            items: [
                {
                    text: '新增',
                    click: function (btn) {
                        var manager = $(container).ligerGetGridManager();
                        var columns = manager.getColumns();
                        if (columns.length == 1) {
                            alert('请先设置列头');
                        } else {
                            var newRecord = {};
                            $.each(columns, function (index, column) {
                                if (index > 0) {
                                    newRecord[column.name] = '默认值';
                                }
                            });
                            manager.addRow(newRecord);
                        }
                    }
                },
                {
                    text: '删除',
                    click: function (btn) {
                        var manager = $(container).ligerGetGridManager();
                        manager.deleteSelectedRow();
                    }
                },
                {
                    text: '列头设置',
                    click: function (btn) {
                        var manager = $(container).ligerGetGridManager();
                        var columns = manager.getColumns();
                        var headData = [];
                        $.each(columns, function (index, column) {
                            var columnName = column.display;
                            if (index > 0 && columnName) {
                                headData.push({
                                    headText: columnName
                                });
                            }
                        });
                        $.ligerDialog.open({
                            height: 400,
                            width: 500,
                            url: serviceName + '/app/javascript/orientjs/jqueryjs/form/HeadSetting.jsp?headData=' + JSON2.stringify(headData),
                            buttons: [
                                {
                                    text: '取消',
                                    onclick: function (item, dialog) {
                                        dialog.close();
                                    }
                                },
                                {
                                    text: '保存',
                                    onclick: function (item, dialog) {
                                        var columns = dialog.frame.saveHeadSettings();
                                        if (columns == true) {
                                            alert('列头中存在重复列头，请去除重复后再保存');
                                        } else {
                                            var manager = $(container).ligerGetGridManager();
                                            manager.set('columns', columns);
                                            manager.reRender();
                                            dialog.close();
                                        }
                                    }
                                }
                            ]
                        });
                    }
                }
            ]
        }
    });
};