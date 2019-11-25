/**
 * ：全局变量
 * @author : weilei
 */
define(function (require, exports, module) {

    /**
     * 常量
     */
    exports.constant = {

        /*知识库管理：全局变量*/
        categoryParentId: '0',
        cm_start: 0,
        cm_limit: 30,

        /*知识管理：全局变量*/
        fm_start: 0,
        fm_limit: 8,
        dm_start: 0,
        dm_limit: 25,
        om_start: 0,
        om_limit: 5,

        /*全文检索：全局变量*/
        ft_start: 0,
        ft_limit: 5,
        myExpander: '',
        //密级name
        RESTRICTION_NAME: 'EL_FILESECURITY',
        // RESTRICTION_ID : 524,
        //可见范围name
        PREVIEWAREA_NAME: 'EL_SEEAREA',
        // PREVIEWAREA_ID : 523,

        //浏览器宽度、高度
        cWidth: document.body.clientWidth,
        cHeight: document.body.clientHeight
    };

    /**
     * 图标
     */
    exports.images = {

        imageType: 'jpg;png;gif;bmp;JPG',
        vedioType: 'avi;wmv;flv;wmv9;rm;rmvb;mpg;mpeg;mp3',
        officeType: 'doc;docx;xls;xlsx;ppt;pptx',
        pdfType: 'pdf',
        txtType: 'txt',
        icon_image: serviceName + '/app/images/knowledge/i_image.png',
        icon_vedio: serviceName + '/app/images/knowledge/i_film.png',
        icon_office: serviceName + '/app/images/knowledge/i_office.png',
        icon_pdf: serviceName + '/app/images/knowledge/i_pdf.png',
        icon_text: serviceName + '/app/images/knowledge/i_text.png'
    };

    /**
     * 知识库Bean
     */
    exports.category = {

        categoryId: '',
        categoryName: '',
        categoryKeyWord: '',
        categoryDescribe: '',
        categoryCreateTime: '',
        categoryAuthor: '',
        categoryParentId: '',
        categoryModelName: 'T_CATEGORY'
    };

    /**
     * 文件库Bean
     */
    exports.file = {

        fileId: '',
        fileName: '',
        fileKeyword: '',
        fileSummary: '',
        fileType: '',
        fileTypeId: '',
        filePreviewArea: '',
        fileSecurity: '',
        fileSecurityId: '',
        fileAuthor: '',
        fileCreateTime: '',
        fileDownload: '',
        fileEditDate: '',
        fileEdtor: '',
        fileModelName: 'T_FILE'
    };

    /**
     * 词条库Bean
     */
    exports.diction = {

        dictionId: '',
        dictionName: '',
        dictionSolution: '',
        dictionAuthor: '',
        dictionCreateTime: '',
        dictionClickNum: '',
        dictionModelName: 'T_DICTION'
    };

    /**
     * 评论库Bean
     */
    exports.comment = {

        commentId: '',
        dictionId: '',
        commentTheme: '',
        commentScore: '',
        commentContent: '',
        commentAuthor: '',
        commentCreateTime: '',
        commentModelName: 'T_COMMENT',
        commentClassiFicationId: ''
    };

    /**
     * 标签标红
     * @param msg
     */
    exports.fieldLabel = function (labelName) {
        return "<font color='red'>*</font>" + labelName;
    };

    /**
     * 消息提示框
     * @param msg
     */
    exports.messageBox = function (msg) {

        Ext.Msg.show({
            title: '系统提示',
            msg: msg,
            minWidth: 200,
            modal: true,
            icon: Ext.Msg.INFO,
            buttons: Ext.Msg.OK
        });
    };

    /**
     * 删除数据
     * @param url
     * @param params
     * @param store
     */
    exports.deleteData = function (url, params, store) {

        Ext.MessageBox.confirm('确认', '确定要删除，删除后不可以恢复？', function (button) {
            if ('yes' == button) {
                Ext.Ajax.request({
                    url: url,
                    method: 'post',
                    params: params,
                    success: function (response, optx) {
                        var result = Ext.decode(response.responseText);
                        if ('success' == result) {
                            exports.messageBox('删除成功！');
                            store.reload();
                        } else {
                            exports.messageBox('删除失败，请联系系统管理员！');
                        }
                    },
                    failure: function () {
                        exports.messageBox('删除失败！');
                    }
                });
            }
        });
    };

    /**
     * 获取根节点
     */
    exports.getRootNode = function () {

        var rootNode = new Ext.tree.AsyncTreeNode({
            id: '-1',
            text: '分类管理',
            iconCls: 'cateRootNode',
            keyword: '',
            descibe: '根节点信息不可以操作.',
            parentId: '0',
            expanded: true
        });
        return rootNode;
    };

    /**
     * 获取根节点
     * @param operationType
     *               全文检索：fullText
     *               其他    ：''
     */
    exports.getTreeLoader = function (operationType) {

        var loader = new Ext.tree.TreeLoader({
            dataUrl: serviceName + '/categoryController/getCategoryDataForTree.rdm',
            baseParams: {
                operationType: operationType,
                categoryModelName: exports.category.categoryModelName
            },
            clearOnLoad: false,
            createNode: function (attr) {
                if ('' != operationType) attr.checked = false;
                return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
            }
        });
        loader.on('beforeLoad', function (loader, node) {
            loader.baseParams.parentId = node.attributes.id;
        });
        return loader;
    };

    /**
     * 设置表单标签样式
     */
    exports.setFormLabelStyle = function () {

        if (navigator.userAgent.indexOf("MSIE") > 0) return 'margin-left:10px;width:50px;';
        else if (navigator.userAgent.indexOf("Chrome") > 0) return 'margin-left:10px;width:40px;';
    };

    /**
     * 重新设置检索面板样式
     * @param width :浏览器宽度
     * @param object:检索面板对象
     */
    exports.resetStyle = function (width, object) {

        if (navigator.userAgent.indexOf("MSIE") > 0) {
            if (width - 820 - 250 > 0) {
                var kWidth = (width - 620 - 250) / 2 + 'px';
                var sWidth = (width - 800 - 250) / 2 + 'px';
                if (object.container.dom != undefined) {
                    object.container.dom[0].style.marginLeft = kWidth;
                    object.container.dom[3].style.marginLeft = sWidth;
                }
            }
        }
    };

    /**
     * 获取当前浏览器宽度、高度
     * @param width :
        * @param height:
     */
    exports.getClientProperty = function (width, height) {

        exports.constant.cWidth = width;
        exports.constant.cHeight = height;
    };

    /**
     * 判断当前登录用户是否拥有知识库操作权限
     * @param operationName:当前操作名
     */
    exports.isHasOperation = function (operationName) {

        //todo 权限校验
        return true;
        /*if(knowledgeOperations && knowledgeOperations !='' && knowledgeOperations.indexOf(operationName) != '-1')return true;
        return false;*/
    };
});