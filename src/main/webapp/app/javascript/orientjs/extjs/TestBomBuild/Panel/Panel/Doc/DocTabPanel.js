/**
 * 试验条件、合格判据、试验过程标签页
 */

Ext.define('OrientTdm.TestBomBuild.Panel.Panel.Doc.DocTabPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.DocTabPanel',

    initEvents: function () {
        var me = this;
        me.callParent();
    },

    initComponent: function () {
        var me = this;

        // selectedId 根据试验项Id获取试验项选择的试验条件、合格判据、试验过程的id
        me._getSelected();
        // data 根据试验项id 获取参数列表
        me._getStoreData();
        // selectedData 根据所选id 从所有数据中选择数据
        me._chooseSelectedItem();

        // 构建按钮
        me.tbar = [{
            id: 'combobox_' + me.modelId,
            xtype : 'combobox',
            iconCls: 'icon-create',
            name : 'currYear',
            fieldLabel : '选择',
            disabled: me.btnPower == undefined ? false : !me.btnPower,
            labelAlign : 'left',
            labelWidth : 30,
            emptyText : '',
            margin : '5 5 5 5',
            displayField : 'name',
            valueField : 'id',
            triggerAction : 'all',
            queryMode: 'local',
            store: Ext.create('Ext.data.Store', {
                fields: ['id', 'name', 'reportName'],
                data: me.data
            }),
            listeners: {
                /**
                 * 更换选项后刷新内容组件
                 */
                change: me._showCollabTemp,
                /**
                 * 展开时重新加载数据
                 */
                /*expand: function () {
                    me._getStoreData();
                    Ext.getCmp('combobox_' + me.modelId).store.loadData(me.data);
                },*/
                scope: me
            },
            value: me.selectedId
        },{
            iconCls: 'icon-create',
            itemId: 'create',
            disabled: me.btnPower == undefined ? false : !me.btnPower,
            text: '新增',
            handler: function () {
                me._getDocWinodow('create');
            }
        },{
            iconCls: 'icon-update',
            itemId: 'modify',
            text: '编辑',
            disabled: me.btnPower == undefined ? false : !me.btnPower,
            handler:function () {
                me._getDocWinodow('update');
            }
        }];

        // 根据选择的
        var docPanel = me._createDocPanel();
        Ext.apply(me, {
            layout: 'fit',
            items: [docPanel],
            listeners: {
                doShow: function () {
                    var doc = me.down('DocPanel');
                    if(doc != undefined){
                        doc.fireEvent('show');
                    }
                }
            }
        });

        this.callParent(arguments);
    },

    /**
     * 创建内容 panel
     * @returns {OrientTdm.TestBomBuild.Panel.Panel.Doc.DocPanel}
     * @private
     */
    _createDocPanel: function(){
        var me = this;

        me.fileName = me.selectedData['reportName'];

        var panel = Ext.create('Ext.panel.Panel', {
            title: '内容',
            autoScroll: true,
            autoShow: true,
            items: [{
                html: me.fileName ? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在加载数据，请稍后......</h1>': ''
            }],
            listeners: {
                afterrender: function () {
                    showChild(me.fileName);
                }
            }
        });

        return panel;

        function showChild(reportName) {
            setTimeout(function () {
                // 没有选择文档时不请求
                if(reportName != ''){
                    // 根据模版名称请求文件路径
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DocController/getDocImgPath.rdm?random=' + Math.random(),{
                        imgName: reportName
                    },false, function (response) {
                        var respons = Ext.decode(response.responseText);
                        if(respons.success){
                            me.reportName = respons.results;
                        }
                    });
                }

                // 先请求一次，看看文件是否存在
                var reloadCount = 0;
                var url = serviceName + '/' + me.reportName;// + '?random=' + Math.random();
                if(reportName != ''){
                    setTimeout(function () {
                        reloadCount++;
                        requestFile();
                    }, 1000);

                }else if(!me.fileName){
                    panel.removeAll();
                    panel.add({
                       html: '<h1>文档不存在，预览内容失败</h1>'
                    });
                }

                // 递归：后台请求预览图片
                function requestFile() {
                    // 重置加载超时
                    if(reloadCount > 50){
                        panel.removeAll();
                        panel.add({
                            html: '<h1>文档不存在，预览内容失败</h1>'
                        });
                        return;
                    }
                    Ext.Ajax.request({
                        'url': url,
                        'timeout': 100000000,
                        'async': false,
                        'success': function (response) {
                            panel.removeAll();
                            panel.add(Ext.create('Ext.Img', {
                                autoScroll: true,
                                renderTo: Ext.getBody(),
                                src: url
                            }));
                        },
                        failure: function (response, opts) {
                            setTimeout(function () {
                                reloadCount++;
                                requestFile();
                            }, 1000);
                        }
                    });
                }
            }, 1);
        }
    },

    /**
     * 根据所选id 从所有数据中选择数据
     * @param data
     * @private
     */
    _chooseSelectedItem: function(){
        var me = this;
        me.selectedData = {
            'name': '',
            'reportName': '',
            'id': ''
        };
        Ext.each(me.data, function (item) {
            if(item['id'] == me.selectedId){
                me.selectedData = item;
                return;
            }
        });
    },

    /**
     * 获取选择的参数
     * @private
     */
    _getSelected: function(){
        var me = this;

        me.selectedId = '';
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TemplateRealController/querySlaveIds.rdm',{
            realDataId: me.syxDataId,
            realTableId: me.syxModelId,
            templateTableId: me.modelId,
            templateDataId: ''
        },false, function (response) {
            me.selectedId = Ext.decode(response.responseText);
        });
    },

    /**
     * 加载数据
     * @returns {Array}
     * @private
     */
    _getStoreData: function () {
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
    },

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
        //combobox.fireEvent('expand');

        // 移除旧的 pageoffice 页面
        me.removeAll();

        // 加载新的值
        me._getStoreData();
        var comonbox = Ext.getCmp('combobox_' + me.modelId);
        comonbox.store.loadData(me.data);

        // 设置新的选中id
        me.selectedId = comonbox.getValue();
        /*if(newValue instanceof Array){
            me.selectedId = newValue[0].data['id'];
        }else{
            me.selectedId = newValue;
        }*/

        //combobox.setValue(me.selectedId);

        // 从本地数据源找到对应的数据
        me._chooseSelectedItem();
        // 添加新的组件
        me.add(me._createDocPanel());

        // 激活pageoffice
        //me.fireEvent('doShow');
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TemplateRealController/upate.rdm", {
            realDataId: me.syxDataId,
            realTableId: me.syxModelId,
            templateTableId: me.modelId,
            templateDataId: me.selectedId
        }, true);
    },

    /**
     * 新增或者编辑试验条件、合格判据、试验过程
     * @param param
     * @returns {*|Ext.Window}
     * @private
     */
    _getDocWinodow: function(flag){
        var me = this;

        return new Ext.Window({
            title: flag == 'create' ? '新增' : '编辑',
            height: 0.9 * globalHeight,
            width: 0.6 * globalWidth,
            layout: 'fit',
            modal: true,
            items: [
                Ext.create('OrientTdm.TestBomBuild.Panel.Panel.Doc.DocPanel', {
                    region: 'center',
                    dataId: me.dataId,
                    modelId: me.modelId,
                    modelName: me.modelName,
                    nameReadonly: false,
                    name: flag == 'create' ? '' : me.selectedData['name'],
                    reportName: flag == 'create' ? '' : me.selectedData['reportName']
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
                        // 关闭窗口
                        this.up().up().close();

                        // 加载组件刷新页面
                        Ext.getCmp('combobox_' + me.modelId).setValue(me.selectedId);
                        Ext.getCmp('combobox_' + me.modelId).fireEvent('change');
                        //me._showCollabTemp('', me.selectedId, '');
                    }else{
                        OrientExtUtil.Common.tip('提示','名称不能为空！');
                    }
                }}, '->']
        }).show();
    }

});