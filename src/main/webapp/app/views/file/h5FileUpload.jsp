<%--
  Created by IntelliJ IDEA.
  User: GNY
  Date: 2018/5/17
  Time: 10:40
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
    String modelId = request.getParameter("modelId");
    String dataId = request.getParameter("dataId");
    String nodeId = request.getParameter("nodeId");
    String piId = request.getParameter("piId");
%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<html>
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="stylesheet" href="${ctx}/app/javascript/lib/plupload/jquery.ui.plupload/css/jquery.ui.plupload.css">
    <link/>

    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext-4.2/examples/shared/include-ext.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext-4.2/examples/shared/examples.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/ext-4.2/locale/ext-lang-zh_CN.js"></script>

    <script type="text/javascript" src="${ctx}/app/javascript/lib/plupload/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/plupload/jquery-ui-1.8.22.min.js"></script>
    <link rel="stylesheet" href="${ctx}/app/javascript/lib/plupload/base/jquery-ui.css"/>
    <!-- Third party script for BrowserPlus runtime (Google Gears included in Gears runtime now) -->
    <script type="text/javascript" src="${ctx}/app/javascript/lib/plupload/browserplus-min.js"></script>
    <!-- Load plupload and all it's runtimes and finally the jQuery UI queue widget -->
    <script type="text/javascript" src="${ctx}/app/javascript/lib/plupload/plupload.full.js"></script>
    <script type="text/javascript" src="${ctx}/app/javascript/lib/plupload/i18n/zh-cn.js"></script>
    <script type="text/javascript"
            src="${ctx}/app/javascript/lib/plupload/jquery.ui.plupload/jquery.ui.plupload.js"></script>
    <script type="text/javascript">
        // Convert divs to queue widgets when the DOM is ready
        $(function () {
            Array.prototype.indexOf = function(val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val) return i;
                }
                return -1;
            };
            Array.prototype.remove = function(val) {
                var index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
            var initUtl = '${ctx}/modelFile/create.rdm?dataId=<%=dataId%>&modelId=<%=modelId%>&nodeId=<%=nodeId%>&piId=<%=piId%>';
            var fileUploadedFiles = [];
            $("#uploader").plupload({
                // General settings
                runtimes: 'html5,flash,silverlight,gears,browserplus', // 这里是说用什么技术引擎
                url: initUtl, // 服务端上传路径
                //max_file_size: '10000MB', // 文件上传最大限制。
                //chunk_size: '1000MB', // 上传分块每块的大小，这个值小于服务器最大上传限制的值即可。
                unique_names: true, // 上传的文件名是否唯一
                //是否生成缩略图（仅对图片文件有效）
                resize: {width: 320, height: 240, quality: 90},
                //这个数组是选择器，就是上传文件时限制的上传文件类型
                /*filters: [
                 {title: "Image files", extensions: "image/jpg,image/gif,image/png"},
                 {title: "Office files", extensions: "doc,docx,ppt,pptx,xls,xlsx,pdf"},
                 {title: "Other files", extensions: "txt"}
                 ],*/
                // plupload.flash.swf 的所在路径
                flash_swf_url: '${ctx}/app/javascript/lib/upload/plupload.flash.swf',
                // silverlight所在路径
                silverlight_xap_url: '${ctx}/app/javascript/lib/upload/plupload.silverlight.xap',
                multipart_params: {}
            });
            var uploader = $('#uploader').plupload('getUploader');
            uploader.bind('BeforeUpload', function (up, file) {
                uploader.settings.url = initUtl;
                var secrecyId = '#secrecy' + file.id;
                var fileCatalogId = '#fileCatalog' + file.id;
                var fieDescId = '#fileDesc' + file.id;
                if ($(secrecyId).val() == "") {
                    Ext.Msg.show({
                        title: '<span class="app-container-title-normal">' + '失败' + '</span>',
                        msg: '文件密级未设置，请先设置密级！',
                        buttons: Ext.Msg.OK,
                        buttonText: {
                            ok: '<span class="app-normal">确定</span>'
                        },
                        icon: Ext.Msg.ERROR
                    });
                    uploader.stop();
                    return;
                }
                uploader.settings.url = uploader.settings.url + '&secrecy=' + $(secrecyId).val() + '&fileCatalog=' + $(fileCatalogId).val() + '&desc=' + $(fieDescId).val();
            });
            uploader.bind('FileUploaded', function(up,file,result){
                file.fileId = JSON.parse(result.response).results.fileid;
                if (document.getElementsByName("fileId")[0].value == 0) {
                    document.getElementsByName("fileId")[0].value = file.fileId;
                } else {
                    var fileIds = document.getElementsByName("fileId")[0].value.split(",");
                    fileIds.push(file.fileId);
                    document.getElementsByName("fileId")[0].value = fileIds.join(",");
                }
            });
            uploader.bind('UploadComplete', function (up, files) {
                var successfile = 0, failedfile = 0;
                Ext.each(files, function (file) {
                    if (!Ext.Array.contains(fileUploadedFiles, file)) {
                        if (file.status == 5) {
                            successfile++;
                        } else if (file.status == 4) {
                            failedfile++;
                        }
                        fileUploadedFiles.push(file);
                    }
                });
                Ext.Msg.show({
                    title: '提示',
                    msg: "上传成功" + successfile + "个文件，失败" + failedfile + "个文件",
                    width: 250,
                    icon: Ext.Msg.WARNING,
                    buttons: Ext.Msg.OK
                });
            });
            uploader.bind('FilesRemoved', function (up, file) {
               var fileId = file[0].fileId;
               var fileIds = document.getElementsByName("fileId")[0].value.split(",");
               fileIds.remove(fileId);
               document.getElementsByName("fileId")[0].value = fileIds.join(",");
            });
            // Client side form validation
            $('form1').submit(function (e) {
                var uploader = $('#uploader').plupload('getUploader');
                // Files in queue upload them first
                if (uploader.files.length > 0) {
                    // When all files are uploaded submit form
                    uploader.bind('BeforeUpload', function () {
                        if (uploader.files.length === (uploader.total.uploaded + uploader.total.failed)) {
                            $('form1')[0].submit();
                        }
                    });
                    uploader.start();
                } else
                    alert('You must at least upload one file.');
                return false;
            });
        });
    </script>
</head>
<body>
    <form id="form1">
        <div id="uploader" style="width: 99%;height: 100%;">
            <p>You browser doesn't have Flash, Silverlight, Gears, BrowserPlus or HTML5 support.</p>
        </div>
    </form>
    <input name="fileId" value="" type="text" style="display:none">
</body>
</html>
