///////////////////////////////////////////////////
//////////////////全文检索文件操作事件//////////////
///////////////////////////////////////////////////

/**
 * 下载文档
 * @param allName  :用户显示名
 * @param fileId   :选择文档记录集合
 */
function downloadFile(fileId) {

    if (!isHasOperation('下载')) {
        messageBox('当前用户没有操作权限！');
        return;
    }
    var url = serviceName + '/fileController/downloadFile.rdm'
        + '?fileId=' + fileId
        + '&fileModelName=T_FILE';
    window.location.href = url;
};

/**
 * 文件预览
 * @param fileId   :文件ID
 * @param fileType :文件类型
 */
function previewFile(fileId, fileType) {

    /*
     * 1、如果是音频/视频文件，下载预览
     * 2、如果是文本文件，采用pageoffice预览
     * 3、如果是txt文件，  采用openOffice预览
     * 4、如果是图片文件，采用CSS预览
    */
    var officeType = 'doc;docx;xls;xlsx;ppt;pptx';
    var pdfType = 'pdf';
    if (officeType.indexOf(fileType) != -1) previewFileByPageOffice(fileId, fileType);
    else if (pdfType.indexOf(fileType) != -1) previewFileByPageOffice(fileId, fileType);
    else Ext.Msg.alert('提示', '不支持此类型文件的在线预览！');
}

/**
 * webOffice方式预览文件
 * @param fileId   :文件ID
 * @param fileType :文件类型
 */
function previewFileByPageOffice(fileId, fileType) {

    //检查文件是否存在
    Ext.Ajax.request({
        url: serviceName + '/fileController/checkFileIsExist.rdm',
        method: 'post',
        params: {
            fileId: fileId,
            fileModelName: 'T_FILE'
        },
        success: function (response, opts) {
            var result = Ext.decode(response.responseText);
            var fileName = result.fileName;
            var filePath = result.filePath;

            var viewUrl = serviceName + "/app/views/file/";
            if (fileType == "pdf") {
                viewUrl = viewUrl + "PageOffice_View_Pdf.jsp";
            } else {
                viewUrl = viewUrl + "PageOffice_View_Doc.jsp";
            }
            filePath = encodeURI(filePath);

            viewUrl = viewUrl + "?fileName=" + fileName + "&filePath=" + filePath + "&fileType=" + fileType;
            if ("success" == result.flag) window.open(viewUrl, '', 'height=700,width=1000,top=150,left=300');//window.location.href="pageoffice://|"+viewUrl+"|width=900px;height=800px;|";
            else Ext.Msg.alert('提示', '文件不存在！');
        },
        failure: function (response, opts) {
            Ext.Msg.alert('提示', '预览失败，请联系系统管理员！');
        }
    });
}

/**
 * 判断当前登录用户是否拥有知识库操作权限
 * @param userName :    用户名
 * @param operationName:当前操作名
 */
function isHasOperation(operationName) {

    //todo 权限校验
    return true;
    /*if(knowledgeOperations.indexOf(operationName) != '-1')return true;
    return false;*/
};

/**
 * 消息提示
 * @param msg
 */
function messageBox(msg) {

    Ext.Msg.show({
        title: '系统提示',
        msg: msg,
        minWidth: 200,
        modal: true,
        icon: Ext.Msg.INFO,
        buttons: Ext.Msg.OK
    });
};
   