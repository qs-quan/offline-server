/**
 * Created by enjoy on 2016/3/30 0030.
 * 多选控件
 */
$(function () {
    var ctx = __ctx;

    /**
     * 从原生组件中读取配置信息
     * @param combo
     */
    function readProp(combo) {
        var prop = {
            //字典对应的分类key。
            width: $(combo).attr("width"),
            height: $(combo).attr("height"),
            slide: false
        };
        //宽度
        if (isObjNull(prop.width)) prop.width = isObjNull($(combo).width()) ? 150 : $(combo).width();
        //高度
        if (isObjNull(prop.height)) prop.height = isObjNull($(combo).height()) && $(combo).height() < 50 ? 100 : $(combo).height();
        //字段值的ID
        if (isObjNull(prop.valueFieldID)) {
            //表单字段命名为 m:表名:字段名称，在提交数据的时候程序会检查表单名称为m:开头的字段，这个id是不提交的，所以替换掉。
            prop.valueFieldID = $(combo).attr("name").replace("m:", "").replace("s:", "") + "_id";
        }
        return prop;
    }

    function process(combo, prop) {
        if (typeof(prop) == undefined || prop == null || prop == '') {
            return;
        }
        var bindModeId = $(combo).attr("bindModelId");
        var displayColumn = $(combo).attr("displayColumn");
        var columnDecs = [{
            display: 'ID',
            name: 'ID',
            width: 50
        }];
        //获取模型描述
        $.ajax({
            url: ctx + '/modelFormView/getModelColumn.rdm',
            async: false,
            data: {
                orientModelId: bindModeId
            },
            success: function (data) {
                $.each(JSON2.parse(data.results), function (index, columnDesc) {
                    var dbName = columnDesc.dbName;
                    var columnName = dbName.substr(dbName.lastIndexOf(":") + 1, dbName.length).toUpperCase();
                    if (columnName == displayColumn.toUpperCase()) {
                        columnDecs.push({
                            display: columnDesc.text,
                            name: columnName
                        });
                    }
                });
                var combobox = $(combo).ligerComboBox({
                    width: prop.width,
                    slide: prop.slide,
                    valueField: 'ID',
                    selectBoxWidth: prop.width,
                    selectBoxHeight: 250,
                    textField: displayColumn,
                    valueFieldID: prop.valueFieldID,
                    grid: {
                        root: 'results',
                        record: 'totalProperty',
                        columns: columnDecs,
                        switchPageSizeApplyComboBox: false,
                        url: ctx + '/modelData/getModelData.rdm',
                        urlParms: {
                            "orientModelId": bindModeId
                        },
                        pageSize: 20,
                        checkbox: false
                    }
                });
            }
        });
    }

    $.fn.singleTableComboBox = function (option) {
        $(this).each(function () {
            var prop = readProp(this);
            process(this, prop);
        });
    };

    $('.singleTableComboBox').each(function () {
        $(this).singleTableComboBox();
    });

    /**
     * 判断是否为空。
     */
    function isObjNull(v, allowBlank) {
        return v === null || v === undefined || (!allowBlank ? v === '' : false);
    }
});