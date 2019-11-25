/**
 * Created by enjoy on 2016/3/26 0026.
 */
//初始化
OrientFormUtil = (new (function () {

}));

/**
 * 初始化日历控件。
 */
OrientFormUtil.initCalendar = function () {
    $("body").delegate("input.Wdate", "click", function () {
        var fmt = $(this).attr("dateFmt");
        WdatePicker({el: this, dateFmt: fmt});
    });
};

OrientFormUtil.prepareData = function () {
    var main = {
        fields: {}
    };
    //取主表的字段。
    $("input:text[name^='m:'],input:hidden[name^='m:'],textarea[name^='m:'],select[name^='m:']").each(function () {
        var name = $(this).attr('name');
        var value = $(this).val();
        //关系属性特殊处理
        if ($(this).attr("controltype") == "relation" && !$.isEmpty(value)) {
            var jsonValue = JSON2.parse(value);
            var realValue = "";
            $.each(jsonValue, function (index, data) {
                realValue += data.id + ",";
            });
            value = realValue == "" ? realValue : realValue.substr(0, realValue.length - 1);
        }
        //枚举属性特殊处理
        if ($(this).attr("controltype") == "tablenum" && !$.isEmpty(value)) {
            var jsonValue = JSON2.parse(value);
            var realValue = "";
            $.each(jsonValue, function (index, data) {
                realValue += data.id + ",";
            });
            value = realValue == "" ? realValue : realValue.substr(0, realValue.length - 1);
        }
        //多选枚举值获取真实值
        if ($(this).attr("class") && $(this).attr("class").indexOf("staticMultiComboBox") != -1 && !$.isEmpty(value)) {
            var valueFieldID = $(this).attr("name").replace("m:", "").replace("s:", "") + "_id";
            var realInput = $("input:hidden[name=" + valueFieldID + "]");
            value = realInput.val();
        }
        //检查表处理
        if ($(this).attr("controltype") == "checkTable") {
            var fieldName = $(this).attr('name');
            var checkDiv = $("div[name='" + fieldName + "']");
            var manager = checkDiv.ligerGetGridManager();
            if (null != manager) {
                var data = manager.getData();
                value = JSON2.stringify(data);
            }
        }
        //动态表格处理
        if ($(this).attr("controltype") == "dynamicTable") {
            var fieldName = $(this).attr('name');
            var dynamicDiv = $("div[name='" + fieldName + "']");
            var manager = dynamicDiv.ligerGetGridManager();
            if (null != manager) {
                var data = manager.getData();
                value = JSON2.stringify(data);
            }
        }
        main.fields[name.replace(/.*:/, '')] = value;
    });

    //单选按钮
    $('input[name^=m]:radio').each(function () {
        var name = $(this).attr('name').replace(/.*:/, '');
        var value = $(this).val();
        if ($(this).attr("checked") != undefined) {
            main.fields[name] = value;
        }
    });
    return main;
};

OrientFormUtil.validate = function () {
    var fieldValue = OrientFormUtil.prepareData();
    var retVal = false;
    $.ajax({
        url: __ctx + '/modelData/validateAll.rdm',
        async: false,
        data: {
            modelId: bindModeId,
            formData: JSON2.stringify(fieldValue)
        },
        success: function (data) {
            var resp = JSON2.parse(data);
            var errList = resp.results;
            if (null != errList && errList.length > 0) {
                $.each(errList, function (index, err) {
                    var columnSName = err.columnSName;
                    //寻找字段
                    var field = $("[name='m:" + bindModeId + ":" + columnSName + "']");
                    if (field.length > 0) {
                        var errField = field[0];
                        var parent = $('body div[type=custform]');
                        var validate = OrientFormUtil.getValidate(parent.closest('form'));
                        validate.errorPlacement(errField, err.errorMsg);
                    }
                    //标记错误
                });
            } else {
                retVal = true;
            }
        }
    });
    var parent = $('body div[type=custform]');
    var v = parent.closest('form');
    //前端校验
    if (v.valid) {
        return retVal && v.valid();
    } else
        return retVal;
};

OrientFormUtil.getValidate = function (target) {
    if (target.form) {
        return target.form({
            /**
             * 错误消息处理
             */
            errorPlacement: function (el, msg) {
                var element = $(el),
                    corners = ['right center', 'left center'],
                    flipIt = element.parents('span.right').length > 0;
                element.addClass('validError');

                //添加必填样式
                var parentTd = element.closest("td");
                if (parentTd) {
                    var formTitle = parentTd.prev("td.formTitle");
                    if (formTitle) {
                        var span = $("span.red", formTitle);
                        if (!span || span.length == 0) {
                            formTitle.append($("<span class='red'>*</span>"));
                        }
                    }
                }

                if (element.hasClass("ckeditor")) {
                    setTimeout(function () {
                        element = element.next();
                        element.css("border", "1px solid red");
                    }, 1000);
                } else if (element.hasClass("Wdate") || element.is('textarea')) {
                    element.css("border", "1px solid red");
                } else if (element.is("select") || element.attr('type') && (element.attr('type') == 'checkbox' || element.attr('type') == 'radio')) {
                    var name = element.attr('name');
                    if (!name) return;
                    var priElement = $("*[name='" + name + "']", $("span.select_contain_span"));
                    if (priElement.length > 0) return;
                    element.removeClass('validError');
                    var errorSpan = $('<span></span>').css({
                        "border": "1px solid red",
                        "padding": "1px"
                    }).addClass("select_contain_span");
                    element.before(errorSpan);
                    errorSpan.append(element);
                }

                if (!$(msg).is(':empty')) {
                    element.qtip({
                        overwrite: false,
                        content: msg,
                        position: {
                            my: corners[flipIt ? 0 : 1],
                            at: corners[flipIt ? 1 : 0],
                            viewport: $(window)
                        },
                        show: {
                            effect: function (offset) {
                                $(this).slideDown(100);
                            }
                        },
                        hide: {
                            event: 'click mouseleave',
                            leave: false,
                            fixed: true,
                            delay: 200
                        },
                        style: {
                            classes: 'ui-tooltip-red'
                        }
                    });
                } else {
                    element.qtip("destroy");
                }
            },
            /**
             * 成错误消息
             */
            success: function (el) {
                var element = $(el);
                if (element.hasClass("ckeditor")) {
                    element = element.next();
                    element.css("border", "");
                } else if (element.hasClass("Wdate") || element.is('textarea')) {
                    element.css("border", "1px solid #999");
                } else if (element.is("select") || element.attr('type') && (element.attr('type') == 'checkbox' || element.attr('type') == 'radio')) {
                    var selectSpan = element.parents("span.select_contain_span");
                    if (!selectSpan || selectSpan.length == 0) {
                        var name = element.attr('name');
                        if (!name) return;
                        var priElement = $("*[name='" + name + "']", $("span.select_contain_span"));
                        if (!priElement || priElement.length == 0) return;
                        var tipSpan = priElement.parents("span.select_contain_span");
                        var formtype = priElement.parents("[formtype]");
                        if (formtype && formtype.length > 0) {
                            $("[name='" + name + "']", formtype).each(function () {
                                $(this).removeClass('validError');
                                $(this).qtip("destroy");
                                $(this).unbind('mouseover');
                            });
                        } else {
                            $("[name='" + name + "']").each(function () {
                                $(this).removeClass('validError');
                                $(this).qtip("destroy");
                                $(this).unbind('mouseover');
                            });
                        }
                        tipSpan.before(priElement);
                        tipSpan.remove();
                    } else {
                        selectSpan.before(element);
                        selectSpan.remove();
                    }
                }
                element.removeClass('validError');
                element.qtip("destroy");
                element.unbind('mouseover');
            },
            rules: OrientFormUtil.CustomRules
        });
    } else
        return null;
};

OrientFormUtil.CustomRules = [
    {
        name: "IP地址",
        rule: function (v) {
            return /^((2[0-4]d|25[0-5]|[01]?dd?).){3}(2[0-4]d|25[0-5]|[01]?dd?)$/.test(v);
        },
        msg: "IP地址不正确"
    },

    {
        name: "英文字母",
        rule: function (v) {
            return /^[a-zA-Z]+$/.test(v);
        },
        msg: "请输入英文字母"
    },

    {
        name: "非负整数",
        rule: function (v) {
            return /^d+$/.test(v);
        },
        msg: "请输入非负整数"
    },

    {
        name: "英数字",
        rule: function (v) {
            return /^[a-zA-Z0-9]+$/.test(v);
        },
        msg: "请输入英文字母和数字"
    },

    {
        name: "汉字",
        rule: function (v) {
            return /^[u4E00-u9FA5]+$/.test(v);
        },
        msg: "请输入汉字"
    },

    {
        name: "负整数",
        rule: function (v) {
            return /^-{1}d+$/.test(v);
        },
        msg: "请输入负整数"
    },

    {
        name: "正整数",
        rule: function (v) {
            return /^[1-9]+d*$/.test(v);
        },
        msg: "请输入正整数"
    },

    {
        name: "整数",
        rule: function (v) {
            return /^-?d+$/.test(v);
        },
        msg: "请输入整数"
    },

    {
        name: "QQ号码",
        rule: function (v) {
            return /^[1-9]*[1-9][0-9]*$/.test(v);
        },
        msg: "请输入有效的QQ号码"
    },

    {
        name: "email",
        rule: function (v) {
            return /^w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*$/.test(v);
        },
        msg: "email格式输入有误"
    },

    {
        name: "手机号码",
        rule: function (v) {
            return /^(((13[0-9]{1})|(15[0-9]{1}))+d{8})$/.test(v);
        },
        msg: "手机号码输入有误"
    }
];

