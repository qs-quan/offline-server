/**
 * 预览和编辑文件页
 */

Ext.define('OrientTdm.TestBomBuild.Panel.Panel.Doc.DocFileViewPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.DocFileViewPanel',

    initEvents: function () {
        var me = this;
        me.callParent();
    },

    initComponent: function () {
        var me = this;

        // selectedData
        me.xmcswjData = OrientExtUtil.ModelHelper.getModelData("T_XMCSWJ", OrientExtUtil.FunctionHelper.getSchemaId(), me.dataId);
        var xmcswjDataFileInfo = Ext.decode(me.xmcswjData['M_FILEID_' + me.modelId]);
        if(xmcswjDataFileInfo.length > 0){
            me.fileId = xmcswjDataFileInfo[0].id;
            me.fileName = xmcswjDataFileInfo[0].name;
        }

        // 构建按钮
        // me.tbar = [{
        //     iconCls: 'icon-update',
        //     itemId: 'modify',
        //     text: '编辑',
        //     handler:function () {
        //         me._getDocWinodow('update');
        //     }
        // }];

        // 根据选择的
        var docPanel = me._createDocPanel();
        Ext.apply(me, {
            layout: 'fit',
            items: [docPanel],
            listeners: {
                doShow: function () {
                    var doc = me.down('DocFileViewPanel');
                    if(doc != undefined){
                        doc.fireEvent('show');
                    }
                }
            }
        });

        this.callParent(arguments);
    },

    /**
     * 获取新的
     * @returns {OrientTdm.TestBomBuild.Panel.Panel.Doc.DocPanel}
     * @private
     */
    _createDocPanel: function(){
        var me = this;

        var reportName = '';
        if(me.fileId != '' && me.fileId != undefined){
            // 根据cwmfileId请求文件路径
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DocController/getExcelImgPathByCwmfileId.rdm',{
                cwmFileId: me.fileId
            },false, function (response) {
                var respons = Ext.decode(response.responseText);
                if(respons.success){
                    reportName = respons.results;
                }
            });
        }

        var reloadCount = 0;
        function requestFile() {
            // 重置加载超时
            if(reloadCount > 1000){
                return;
            }
            Ext.Ajax.request({
                'url': serviceName + '/' + reportName,
                'timeout': 100000000,
                'async': false,
                'success': function (response) {
                    reloadCount++;
                },
                failure: function (response, opts) {
                    reloadCount++;
                    requestFile();
                }
            });
        }

        // 先请求一次，看看文件是否存在
        if(reportName != ''){
            requestFile();
            console.log('总计重新请求次数：' + reloadCount);
        }

        return Ext.create('Ext.panel.Panel', {
            title: '内容',
            autoScroll: true,
            autoShow: true,
            html: reportName == '' ? me.fileName : '',
            // 没有返回路径时不加载
            items: reportName == '' ? [] : [Ext.create('Ext.Img', {
                autoScroll: true,
                renderTo: Ext.getBody(),
                src:  reportName
            })]
        });
    },

    /**
     * 加载数据
     * @returns {Array}
     * @private
     */
   /* _getStoreData: function () {
        var me = this;
        var itemList = [];
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getModelData.rdm',{
            orientModelId: me.modelId,
            isView: '0',
            customerFilter: Ext.encode([new CustomerFilter('T_RW_INFO_' + OrientExtUtil.FunctionHelper.getSchemaId() + "_ID", CustomerFilter.prototype.SqlOperation.Equal, "", me.syxDataId)])
        },false, function (response) {
            var result = Ext.decode(response.responseText);
            if(result.totalProperty > 0){
                Ext.each(result.results, function (item) {
                    itemList.push({
                        'id': item['ID'],
                        'name': item['M_NAME_' + me.modelId],
                        'reportName': item['M_REPORT_NAME_' + me.modelId]
                    });
                });
            }
        });

        me.data = itemList;
    },*/

    /**
     * 更换选项后刷新内容组件
     * @param scope
     * @param newValue
     * @param oldValue
     * @param eOpts
     * @private
     */
    _showCollabTemp: function (scope, newValue, oldValue, eOpts) {
        var me = this;
        var combobox = Ext.getCmp('combobox_' + me.modelId);
        // 是否重新加载选项
        combobox.fireEvent('expand');

        // 移除旧的 pageoffice 页面
        me.removeAll();
        // 设置新的选中id
        if(newValue instanceof Array){
            me.selectedId = newValue[0].data['id'];
        }else{
            me.selectedId = newValue;
        }
        combobox.setValue(me.selectedId);

        // 从本地数据源找到对应的数据
        me._chooseSelectedItem();
        var item = me._createDocPanel();
        setTimeout(function () {
            me.add(item);
        }, '1000');
        // 添加新的组件

        // 激活pageoffice
        //me.fireEvent('doShow');
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TemplateRealController/upate.rdm", {
            realDataId: me.syxDataId,
            realTableId: me.syxModelId,
            templateTableId: me.modelId,
            templateDataId: me.selectedId
        }, false, function (response) {
            // var responseText = Ext.decode(response.responseText);
            // if(responseText.success){
            //     OrientExtUtil.Common.tip('提示', '更新内容成功！');
            // }
        });
    },

    /**
     * 新增或编辑或再次点击tab页后刷新页面
     * @private
     */
    /*_changeNewSelected: function () {
        var me = this;

        // 重新加载可选列表数据
        var itemList = me._getStoreData();
        var combobox = Ext.getCmp('combobox_' + me.modelId);
    },*/

    /**
     * 新增或者编辑试验条件、合格判据、试验过程
     * @param param
     * @returns {*|Ext.Window}
     * @private
     */
    _getDocWinodow: function(flag){
        var me = this;

        return new Ext.Window({
            title: '编辑',
            height: 0.95 * globalHeight,
            width: 0.8 * globalWidth,
            layout: 'fit',
            modal: true,
            //html: '<iframe src="javascript:false" style="position:absolute; visibility:inherit; top:0px; left:0px; width:150px; height:200px; z-index:-1; filter=\\\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\\\';"></iframe>',
            items: [
                Ext.create('OrientTdm.TestBomBuild.Panel.Panel.Doc.DocPanel', {
                    region: 'center',
                    dataId: me.dataId,
                    modelId: me.modelId,
                    modelName: me.modelName,
                    nameReadonly: false,
                    name: flag == 'create' ? '' : me.fileName,
                    reportName: flag == 'create' ? '' : me.xmcswjData['M_FILELOCATION_' + me.modelId],
                    reportNameFolderName: 'EMPTY'
                })
            ],
            listeners: {
                'show': function (scope, obj) {
                    this.down('DocPanel').fireEvent('show');
                }
            },
            bbar: ["->", {
                iconCls: 'icon-create',
                tooltip: '保存',
                text: '保存',
                handler: function(grid, rowIndex, colIndex, item, e, record) {
                    //var param_ = param;
                    var me_ = this;
                    // 校验名称
                    if(Ext.getCmp(me.modelName + me.modelId).validate()){
                        // 保存文档，新增则创建，编辑则更新文件内容
                        var docReportViewPanle = this.up().up().items.items[0].centerPanel;
                        // 保存文件至服务器目录：D:\ftpHome\docReports
                        // 文件名 - 名称_时间戳.doc
                        var realReportName = docReportViewPanle.saveToFtpHome();

                        // 更新试验条件（。。）的相关信息
                        var name = Ext.getCmp(me.modelName + me.modelId).getValue();

                        // 新增
                        if (Ext.isEmpty(docReportViewPanle.reportName)) {
                            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/PrjDocController/create.rdm", {
                                modelName: me.modelName,
                                schemaId: "tdm",
                                parentModelName: 'T_RW_INFO',
                                parentDataId: me.syxDataId,
                                name: name,
                                reportName: realReportName
                            }, false, function (response) {
                                var responseText = Ext.decode(response.responseText);
                                if(responseText.success){
                                    me.selectedId = responseText.results;
                                    //OrientExtUtil.Common.tip('提示', '新增成功！');
                                }
                            });

                            // 更新
                        }else{
                            // 名称和文件名没变时不更新
                            if(!(name == me.selectedData['name'] && realReportName == me.selectedData['reportName'])){
                                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/PrjDocController/updateInfo.rdm", {
                                    modelName: me.modelName,
                                    schemaId: "tdm",
                                    dataId: me.selectedId,
                                    name: name,
                                    reportName: realReportName
                                }, false, function (response) {
                                    var responseText = Ext.decode(response.responseText);
                                    if(responseText.success){
                                        OrientExtUtil.Common.tip('提示', '更新内容成功！');
                                    }
                                });
                            }
                        }
                        //me.up.fireEvent('refreshGrid');
                        // 关闭窗口
                        this.up().up().close();

                        // 刷新页面
                        me._showCollabTemp('', me.selectedId, '');
                    }else{
                        OrientExtUtil.Common.tip('提示','名称不能为空！');
                    }
                }}, '->']
        }).show();
    }

});