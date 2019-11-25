/**
 * Created by enjoy on 2016/3/26 0026.
 */
/**
 * 附件管理。
 * @returns {AttachMgr}
 */
AttachMgr = (new (function () {

}));

/**
 * 添加附件数据。
 * @param obj 按钮。
 * @param fieldName 字段名称
 */
AttachMgr.addFile = function (obj) {
    var inputObj = $(obj);
    var fieldName = inputObj.attr("field");
    var parent = inputObj.parent().parent();

    var rights = "w";
    var divName = "div.attachement";
    var inputName = "input[name='" + fieldName + "'],textarea[name='" + fieldName + "']";
    //获取div对象。
    var divObj = $(divName, parent);
    var inputJson = $(inputName, parent);

    var aryJson = AttachMgr.getFileJsonArray(divObj);
    //文件选择器
    FlexUploadDialog({
        isSingle: false, callback: function (fileIds, fileNames, filePaths, extPaths) {
            if (fileIds == undefined || fileIds == "") return;
            var aryFileId = fileIds.split(",");
            var aryName = fileNames.split(",");
            var aryExtPath = extPaths.split(",");
            for (var i = 0; i < aryFileId.length; i++) {
                var name = aryName[i];
                AttachMgr.addJson(aryFileId[i], name, aryJson);
            }
            //获取json
            var json = JSON2.stringify(aryJson);
            var html = AttachMgr.getHtml(aryJson, rights);
            divObj.empty();
            divObj.append($(html));
            aryFileId.length > 0 ? inputJson.val(json) : inputJson.val("");
            //CustomForm.validate();
        }
    });
};
//直接上传文件
AttachMgr.directUpLoadFile = function (obj) {
    var inputObj = $(obj);
    var fieldName = inputObj.attr("field");
    var fileType = inputObj.attr("fileType");
    var parent = inputObj.parent().parent();
    var rights = "w";
    var divName = "div.attachement";
    var inputName = "input[name='" + fieldName + "'],textarea[name='" + fieldName + "']";
    //获取div对象。
    var divObj = $(divName, parent);
    var inputJson = $(inputName, parent);
    var aryJson = AttachMgr.getFileJsonArray(divObj);
    //文件上传
    if (CiteExt) {
        new CiteExt.Window({
            width: 680,
            title: '上传附件',
            height: 400,
            layout: 'fit',
            items: [
                {
                    xtype: 'uploadpanel',
                    fileType: fileType
                }
            ],
            listeners: {
                beforeclose: function () {
                    var uploadpanel = this.down('uploadpanel');
                    if (uploadpanel) {
                        var attachs = uploadpanel.getSuccessFiles();
                        if (attachs == undefined || attachs == []) return;
                        for (var i = 0; i < attachs.length; i++) {
                            var fileId = attachs[i].attachmentId;
                            var name = attachs[i].attachName;
                            AttachMgr.addJson(fileId, name, aryJson);
                        }
                        //获取json
                        var json = JSON2.stringify(aryJson);
                        var html = AttachMgr.getHtml(aryJson, rights);
                        divObj.empty();
                        divObj.append($(html));
                        inputJson.val(json);
                        //CustomForm.validate();
                        return json;
                    }
                }
            }
        }).show();
    } else {
        alert("缺少Ext环境");
    }

};

/**
 * 删除附件
 * @param obj 删除按钮。
 */
AttachMgr.delFile = function (obj) {
    var inputObj = $(obj);
    var parent = inputObj.parent();
    var divObj = parent.parent();
    var spanObj = $("span[name='attach']", parent);
    var divContainer = divObj.parent();
    var fileId = spanObj.attr("fileId");
    var aryJson = AttachMgr.getFileJsonArray(divObj);
    AttachMgr.delJson(fileId, aryJson);
    var json = JSON2.stringify(aryJson);
    var inputJsonObj = $("textarea", divContainer);
    if (aryJson.length == 0)
        json = "";
    //设置json
    inputJsonObj.val(json);
    //删除span
    parent.remove();
    //CustomForm.validate();
};

/**
 * 初始化表单的附件字段数据。
 */
AttachMgr.init = function (subRights, parent) {
    if ($.isEmpty(parent))
        parent = $("div[name='div_attachment_container']");
    parent.each(function () {
        var me = $(this);
        var atta = $("textarea[controltype='attachment']", me);
        var jsonStr = atta.val();
        if (!$.isEmpty(jsonStr)) {
            jsonStr = jsonStr.replaceAll("￥@@￥", "\"");
            atta.val(jsonStr);
        }
        var divAttachMgr = $("div.attachement", me);
        //json数据为空。
        AttachMgr.insertHtml(divAttachMgr, jsonStr, 'w');
    });
};

/**
 *  附件插入显示
 * @param {} div
 * @param {} jsonStr
 * @param {} rights 权限 如果不传，默认是r
 */
AttachMgr.insertHtml = function (div, jsonStr, rights) {
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
    var html = AttachMgr.getHtml(jsonObj, rights);
    div.empty();
    div.append($(html));
};

/**
 * 获取文件的html。
 * @param aryJson
 * @returns {String}
 */
AttachMgr.getHtml = function (aryJson, rights) {
    var str = "";
    var template = "";
    var templateW = "<span class='attachement-span'><span fileId='#fileId#' name='attach' file='#file#' ><a class='attachment' target='_blank' path='#path#' onclick='AttachMgr.handleClickItem(this)' title='#title#'>#name#</a></span><a href='javascript:;' onclick='AttachMgr.download(this);' title='下载' class='download'></a>&nbsp;<a href='javascript:;' onclick='AttachMgr.delFile(this);' class='cancel'></a></span>";
    var templateR = "<span class='attachement-span'><span fileId='#fileId#' name='attach' file='#file#' ><a class='attachment' target='_blank' path='#path#' onclick='AttachMgr.handleClickItem(this)' title='#title#'>#name#</a></span><a href='javascript:;' onclick='AttachMgr.download(this);' title='下载' class='download'></a></span>";
    template = templateW;
    for (var i = 0; i < aryJson.length; i++) {
        var obj = aryJson[i];
        var id = obj.id;
        var name = obj.name;
        var path = __ctx + "/orientForm/download.rdm?fileId=" + obj.id;
        var file = id + "," + name;
        var tmp = template.replace("#file#", file).replace("#path#", path).replace("#name#", AttachMgr.parseName(name)).replace("#title#", name).replace("#fileId#", id);
        //附件如果是图片就显示到后面
        str += tmp;
    }
    return str;
};

AttachMgr.parseName = function (name) {
    //if (name.length > 10)
    //    return name.substr(0, 6) + "...";
    return name;
}

/**
 * 添加json。
 * @param fileId
 * @param name
 * @param path
 * @param aryJson
 */
AttachMgr.addJson = function (fileId, name, aryJson) {
    var rtn = AttachMgr.isFileExist(aryJson, fileId);
    if (!rtn) {
        var obj = {id: fileId, name: name};
        aryJson.push(obj);
    }
};

/**
 * 删除json。
 * @param fileId 文件ID。
 * @param aryJson 文件的JSON。
 */
AttachMgr.delJson = function (fileId, aryJson) {
    for (var i = aryJson.length - 1; i >= 0; i--) {
        var obj = aryJson[i];
        if (obj.id == fileId) {
            aryJson.splice(i, 1);
        }
    }
};

/**
 * 判断文件是否存在。
 * @param aryJson
 * @param fileId
 * @returns {Boolean}
 */
AttachMgr.isFileExist = function (aryJson, fileId) {
    for (var i = 0; i < aryJson.length; i++) {
        var obj = aryJson[i];
        if (obj.id == fileId) {
            return true;
        }
    }
    return false;
};

/**
 * 取得文件json数组。
 * @param divObj
 * @returns {Array}
 */
AttachMgr.getFileJsonArray = function (divObj) {
    var aryJson = [];
    var arySpan = $("span[name='attach']", divObj);
    arySpan.each(function (i) {
        var obj = $(this);
        var file = obj.attr("file");
        var aryFile = file.split(",");
        var obj = {id: aryFile[0], name: aryFile[1]};
        aryJson.push(obj);
    });
    return aryJson;
};

/**
 * 点击附件事件处理
 * @param divObj
 * @returns {Array}
 */
AttachMgr.handleClickItem = function (obj) {

    var _this = $(obj);
    var span = _this.closest("span");
    var fileId = span.attr("fileId");
    var path = _this.attr("path");
    var h = screen.availHeight - 35;
    var w = screen.availWidth - 5;
    var vars = "top=0,left=0,height=" + h + ",width=" + w + ",status=no,toolbar=no,menubar=no,location=no,resizable=1,scrollbars=1";
    window.open(path, '_blank', vars);

};

/**
 * 下载
 */
AttachMgr.download = function (obj) {
    var me = $(obj);
    var span = me.siblings("span");
    if (span.length > 0)
        var fileId = span.attr("fileId");
    var path = __ctx + "/orientForm/download.rdm?fileId=" + fileId;
    window.location.href = path;
};
	


