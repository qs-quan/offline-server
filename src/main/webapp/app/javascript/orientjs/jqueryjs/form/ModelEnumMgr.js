/**
 * Created by enjoy on 2016/3/26 0026.
 */
/**
 * 模型辅助类。
 * @returns {ModelEnumMgr}
 */
ModelEnumMgr = (new (function () {

}));

ModelEnumMgr.showModelData = function (obj, modelId, displayColumName, isMulti) {
    var inputObj = $(obj);
    var fieldName = inputObj.attr("field");
    var parent = inputObj.parent().parent();
    var rights = "w";
    var divName = "div.tablenum";
    var inputName = "input[name='" + fieldName + "'],textarea[name='" + fieldName + "']";
    //获取div对象。
    var divObj = $(divName, parent);
    var inputJson = $(inputName, parent);
    var aryJson = ModelEnumMgr.getModelDataJsonArray(divObj);
    var selectedValue = [];
    $.each(aryJson, function (index, item) {
        selectedValue.push(item.id);
    });
    //文件上传
    if (CiteExt) {
        new CiteExt.Window({
            width: "80%",
            title: '选择模型数据',
            height: "80%",
            layout: 'fit',
            items: [
                {
                    xtype: 'tableEnumPanel',
                    modelId: modelId,
                    isMulti: isMulti,
                    selectedValue: selectedValue
                }
            ],
            listeners: {
                beforeclose: function () {
                    var selectedData = this.down("tableEnumPanel").getSelectedData();
                    if (selectedData == undefined || selectedData == []) return;
                    //移除原来的
                    aryJson = [];
                    for (var i = 0; i < selectedData.length; i++) {
                        var dataId = selectedData[i].ID;
                        var name = selectedData[i][displayColumName];
                        ModelEnumMgr.addJson(dataId, name, aryJson);
                    }
                    //获取json
                    var json = JSON2.stringify(aryJson);
                    var html = ModelEnumMgr.getHtml(aryJson, rights);
                    divObj.empty();
                    divObj.append($(html));
                    aryJson.length > 0 ? inputJson.val(json) : inputJson.val("");
                }
            },
            buttons: [{
                text: '保存',
                handler: function () {
                    this.up("window").close();
                }
            }]
        }).show();
    } else {
        alert("缺少Ext环境");
    }
};

ModelEnumMgr.getHtml = function (aryJson, rights) {
    var str = "";
    var template = "<span class='attachement-span'><span dataId='#dataId#' modelData='#modelData#' name='modeldata'><a class='attachment' target='_blank' title='#title#'>#name#</a></span></span>";
    for (var i = 0; i < aryJson.length; i++) {
        var obj = aryJson[i];
        var id = obj.id;
        var name = obj.name;
        var modelData = id + "," + name;
        str += template.replace("#dataId#", id).replace("#modelData#", modelData).replace("#title#", name).replace("#name#", name);
    }
    return str;
};

ModelEnumMgr.addJson = function (dataId, name, aryJson) {
    var rtn = ModelEnumMgr.isDataExist(aryJson, dataId);
    if (!rtn) {
        var obj = {id: dataId, name: name};
        aryJson.push(obj);
    }
};

ModelEnumMgr.isDataExist = function (aryJson, dataId) {
    for (var i = 0; i < aryJson.length; i++) {
        var obj = aryJson[i];
        if (obj.id == dataId) {
            return true;
        }
    }
    return false;
};

ModelEnumMgr.getModelDataJsonArray = function (divObj) {
    var aryJson = [];
    var arySpan = $("span[name='modeldata']", divObj);
    arySpan.each(function (i) {
        var obj = $(this);
        var modeldata = obj.attr("modelData");
        var aryData = modeldata.split(",");
        var obj = {id: aryData[0], name: aryData[1]};
        aryJson.push(obj);
    });
    return aryJson;
};

ModelEnumMgr.init = function (subRights, parent) {
    if ($.isEmpty(parent))
        parent = $("div[name='div_tablenum_container']");
    parent.each(function () {
        var me = $(this);
        var atta = $("textarea[controltype='tablenum']", me);
        var jsonStr = atta.val();
        if (!$.isEmpty(jsonStr)) {
            jsonStr = jsonStr.replaceAll("￥@@￥", "\"");
            atta.val(jsonStr);
        }
        var divModelEnumMgr = $("div.tablenum", me);
        //json数据为空。
        ModelEnumMgr.insertHtml(divModelEnumMgr, jsonStr, 'w');
    });
};

ModelEnumMgr.insertHtml = function (div, jsonStr, rights) {
    if ($.isEmpty(jsonStr)) {
        div.empty();
        return;
    }
    if ($.isEmpty(rights)) rights = 'r';
    var jsonObj = [];
    try {
        jsonStr = jsonStr.replaceAll("￥@@￥", "\"");
        jsonObj = jQuery.parseJSON(jsonStr);
    } catch (e) {
    }
    var html = ModelEnumMgr.getHtml(jsonObj, rights);
    div.empty();
    div.append($(html));
};


