/**
 * Created by enjoy on 2016/3/26 0026.
 * 自定义表单初始化
 */
$(function () {
    //初始化日期控件。
    OrientFormUtil.initCalendar();

    //附件初始化
    AttachMgr.init();

    //附件初始化
    RelationMgr.init();

    //表枚举初始化
    ModelEnumMgr.init();

    //检查表格初始化
    CheckTable.init();

    //动态表格设置
    DynamicTable.init();

    //初始化控件数据
    var parent = $('body div[type=custform]');
    if (!parent || parent.length == 0)parent = $("body");
    $("select[name][val]", parent).each(function () {
        var obj = $(this), val = obj.attr("val");
        if ($.isEmpty(val))
            val = obj.val();
        obj.val(val);
    });

    if (parent.is('form')) {
        parent.data('validate', OrientFormUtil.getValidate(parent));
    } else {
        var v = parent.closest('form');
        v.validate = OrientFormUtil.getValidate(v);
    }
});