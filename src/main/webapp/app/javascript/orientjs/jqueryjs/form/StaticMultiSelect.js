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
            valueFieldID: $(combo).attr("valueFieldID"),
            //允许多选
            isMultiSelect: true,
            value: $(combo).attr("value"),
            name: $(combo).attr("name"),
            onSelected: $(combo).attr("onSelected")
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
        var dataStr = $(combo).attr("staticStore");
        var dataList = [];
        $.each(dataStr.split("$TDM-END$"), function (index, data) {
            if (!$.isEmpty(data)) {
                var enumItem = {};
                $.each(data.split("$TDM-MID$"), function (sonIndex, sonData) {
                    if (0 == sonIndex) {
                        enumItem.id = sonData;
                    } else if (1 == sonIndex) {
                        enumItem.text = sonData;
                    }
                });
                dataList.push(enumItem);
            }
        });
        var originalRealValue = "";
        var originalValue = $(combo).attr("value");
        if (!$.isEmptyObject(originalValue)) {
            $.each(originalValue.split(";"), function (index, data) {
                if ('' != data) {
                    $.each(dataList, function (i, d) {
                        if (data == d.text) {
                            originalRealValue += d.id + ";";
                        }
                    });
                }
            });
        }

        // 平铺
        $(combo).ligerComboBox({
            data: dataList,
            valueFieldID: prop.valueFieldID,
            width: prop.width,
            isMultiSelect: prop.isMultiSelect,
            slide: false,
            isShowCheckBox: prop.isMultiSelect,
            value: originalRealValue,
            onSelected: function (newval) {
                if (prop.onSelected) {
                    eval(prop.onSelected + '.call(this,newval)');
                }
            }
        });

    }

    $.fn.staticMultiComboBox = function (option) {
        $(this).each(function () {
            var prop = readProp(this);
            process(this, prop);
        });
    };

    $('.staticMultiComboBox').each(function () {
        $(this).staticMultiComboBox();
    });

    /**
     * 判断是否为空。
     */
    function isObjNull(v, allowBlank) {
        return v === null || v === undefined || (!allowBlank ? v === '' : false);
    }
});