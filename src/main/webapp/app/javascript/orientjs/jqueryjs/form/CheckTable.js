/**
 * Created by Administrator on 2016/8/5 0005.
 * 检查表类型jquery实现
 */
CheckTable = (new (function () {

}));

/**
 * 初始化
 */
CheckTable.init = function () {
    var checkDivs = $('div.checkTable');
    $.each(checkDivs, function (index, checkDiv) {
        var columnName = $(checkDiv).attr('name');
        var atta = $("textarea[name='"+columnName+"']");
        var jsonStr = atta.val();
        jsonStr = jsonStr.replaceAll("￥@@￥", "\"");
        CheckTable.initTableByValue(checkDiv, jsonStr);

    });
};

CheckTable.initTableByValue = function (container, jsonStr) {
    var rawData = $.isEmpty(jsonStr) ? [] : JSON2.parse(jsonStr);
    var gridData = {
        Rows: rawData,
        Total: rawData.length
    };
    $(container).ligerGrid({
        title: $(container).attr("filedText"),
        columns: [
            {
                name: 'labelName',
                display: '检查内容',
                width: 250,
                editor: {type: 'text'}
            },
            {
                name: 'inputValue',
                display: '检查结果',
                editor: {type: 'text'},
                render: function (item) {
                    var value = item.inputValue.toString();
                    if (value == 'true' || value == 'false') {
                        if (value == 'true') {
                            return '检查通过';
                        } else if (value == 'false') {
                            return '<span style="color: red; ">检查未通过</span>';
                        }
                    } else
                        return item.inputValue;
                }
            }
        ],
        checkbox: true,
        enabledEdit: true,
        width: '100%',
        data: gridData,
        usePager: false,
        onBeforeEdit: CheckTable.beforeEditor,
        onAfterEdit: CheckTable.afterEdit,
        toolbar: {
            items: [
                {
                    text: '新增勾选检查项',
                    click: function (btn) {
                        var manager = $(container).ligerGetGridManager();
                        manager.addRow({
                            labelName: '新检查项',
                            inputValue: false
                        });

                    }
                },
                {
                    text: '新增普通检查项',
                    click: function (btn) {
                        var manager = $(container).ligerGetGridManager();
                        manager.addRow({
                            labelName: '新检查项',
                            inputValue: '新检查内容'
                        });
                    }
                },
                {
                    text: '删除',
                    click: function (btn) {
                        var manager = $(container).ligerGetGridManager();
                        manager.deleteSelectedRow();
                    }
                }
            ]
        }
    });
};

CheckTable.beforeEditor = function (e) {
    if (e.column.name == 'inputValue') {
        var value = e.record.inputValue.toString();
        if (value == 'true' || value == 'false') {
            e.column.editor = {
                type: 'checkbox'
            };
        } else {
            e.column.editor = {
                type: 'text'
            };
        }
    }
    return true;
};

CheckTable.afterEdit = function () {

};