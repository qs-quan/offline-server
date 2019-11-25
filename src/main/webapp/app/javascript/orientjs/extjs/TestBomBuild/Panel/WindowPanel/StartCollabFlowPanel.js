/**
 * Created by Administrator on 2016/8/24 0024.
 */
Ext.define('OrientTdm.TestBomBuild.Panel.WindowPanel.StartCollabFlowPanel', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.StartCollabFlowPanel',
    requires: [
        'OrientTdm.Collab.common.auditFlow.ChooseAuditAssignGraphPanel'
    ],
    config: {
        modelId: '',
        dataIds: [],
        successCallback: Ext.emptyFn
    },

    initComponent: function () {
        var me = this;
        //选择审批模板
        var selectPdCombobox = me._createSelectPdCombobox();
        //发起流程
        Ext.apply(me, {
            items: [selectPdCombobox],
            buttons: ['->',{
                text: me.param.isSetTemplate == true ? '保存' : '下发',
                handler: me._startCollabFLow,
                scope: me,
                iconCls: me.param.isSetTemplate == true ?  'icon-saveSingle' : 'icon-startFlow'
            },'->']
        });
        this.callParent(arguments);
    },

    /**
     * 构建协同流程下拉列表选择面板
     * @returns {{border: string, xtype: string, title: string, collapsible: boolean, items: OrientTdm.Common.Extend.Form.Field.OrientComboBox[]}}
     * @private
     */
    _createSelectPdCombobox: function () {
        var me = this;

        me._getSelected();
        var combobox = Ext.create('OrientTdm.Common.Extend.Form.Field.OrientComboBox', {
            initFirstRecord: true,
            remoteUrl: serviceName + '/TaskController/getCollabTemplateList.rdm',
            anchor: '100%',
            name: 'pdId',
            fieldLabel: '选择流程模板',
            listeners: {
                select: me._showWorkFlowImge,
                scope: me
            },
            selected: me.selected
        });

        return {
            xtype: 'fieldset',
            border: '1 1 1 1',
            collapsible: true,
            title: '选择试验流程',
            items: [
                combobox
            ]
        };
    },

    /**
     * 预览所选模板
     * @param combo
     * @param records
     * @private
     */
    _showCollabTemp: function (combo, records) {
        var me = this;
        var selectData = records.data;
        if (Ext.isArray(records)) {
            selectData = records[0].data;
        }
        me.param.templateId = selectData.id;
        me.param.temmplateName = selectData.value.split('-')[0];

        // 移除旧的预览模板，并添加新的
        var oldPanel = me.queryById("setAssignFieldSet");
        if (!Ext.isEmpty(oldPanel)) {
            me.remove(oldPanel);
        }

        me.add({
            xtype: 'fieldset',
            border: '1 1 1 1',
            itemId: 'setAssignFieldSet',
            collapsible: true,
            items: [{
                layout: 'fit',
                width: 1000,
                height: 435,
                items: [
                    Ext.create('OrientTdm.Collab.common.template.TemplatePreviewPanel', {
                        dataPrincipal: me.param.dataPrincipal,
                        title: '模板预览"' + selectData.value + '"',
                        closable: true,
                        templateId: selectData.id
                    })
                ]
            }]
        });
    },

    /**
     * 流程图展示
     */
    _showWorkFlowImge: function (combo, records) {
        var me = this;
        var selectData = records.data;
        if (Ext.isArray(records)) {
            selectData = records[0].data;
        }
        me.param.templateId = selectData.id;
        me.param.temmplateName = selectData.value.split('-')[0];

        // 移除旧的预览模板，并添加新的
        var oldPanel = me.queryById("setAssignFieldSet");
        if (!Ext.isEmpty(oldPanel)) {
            me.remove(oldPanel);
        }

        // 根据流程模板id 获取模板中计划的id
        var collabFlowPanel;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/templatePreview/getPlanByTemplate.rdm', {
            templateId : me.param.templateId
        }, false, function (response) {
            // 根据模板id 和上一步查询到的计划节点id查询流程图需要的参数
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/templatePreview/comps.rdm', {
                dataPrincipal: '',
                nodeId: response.decodedData.ID,
                templateId : me.param.templateId,
                previewType : 'tab'
            }, false, function (response) {
                // 构造流程图
                collabFlowPanel = Ext.create("OrientTdm.Collab.common.collabFlow.collabFlowPanel", {
                    layout: 'fit',
                    localMode : true,
                    readOnly: true,
                    iconCls: "icon-flow",
                    title: '查看【' + me.param.testName + '】流程图',
                    localData : response.decodedData.extraInfo
                });
            });
        });

        if(collabFlowPanel != null){
            me.add({
                xtype: 'fieldset',
                border: '1 1 1 1',
                itemId: 'setAssignFieldSet',
                collapsible: true,
                items: [{
                    layout: 'fit',
                    width: 1000,
                    height: 435,
                    items: [
                        collabFlowPanel
                    ]
                }]
            });
        }

    },


    /**
     * 启动协同流程
     * @private
     */
    _startCollabFLow: function () {
        var me = this;
        var param = me.param;

        if(param.isSetTemplate == true){
            // 获取已选择的模板id
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TemplateRealController/upate.rdm',{
                realDataId: me.param.dataId,
                realTableId: me.param.modelId,
                templateTableId: 'COLLAB_TEMPLATE',
                templateDataId: me.param.templateId
            }, false, function (response) {
                OrientExtUtil.Common.tip('提示', '选择模板成功！');
                if(me.successCallback != undefined){
                    me.successCallback();
                }
                me.up().close();
            });
        }/*else {

        }*/

        // 批量启动
        /*Ext.each(param.dataIdArr, function (item) {
            param.dataId = item;
            // 后台启动试验任务
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TaskController/startTestPrjWithTemplate.rdm',
                me.param,
                true,
                function (resp) {
                    /!* 启动成功后根据试验任务的负责人设置项目执行人等
                       为什么要用两个方法？
                           一个方法，更新试验项目数据时，数据库没有当前新增的试验项目，不知道是事务没提交还是别的原因，总之就是数据库没有目标数据，更新失败。
                    *!/
                    if(resp.decodedData.success){
                        var result = resp.decodedData.results;
                        result.templateId = me.param.templateId;
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TaskController/changePrincipal.rdm',{
                            param : Ext.encode(result)
                        }, true, function (resp) {
                            if(me.successCallback != undefined){
                                me.successCallback();
                            }
                            // 关闭窗口
                            me.up().close();
                        });
                    }
                }
            );
        })*/
    },

    /**
     * 获取试验项已绑定的流程模板Id
     * @private
     */
    _getSelected: function () {
        var me = this;

        // 如果选择多条数据则不需要设置获取已选择模板
        if(me.param.dataId.indexOf(',') === -1) {
            // 获取已选择的模板id
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TemplateRealController/querySlaveIds.rdm',{
                realDataId: me.param.dataId,
                realTableId: me.param.modelId,
                templateTableId: 'COLLAB_TEMPLATE',
                templateDataId: ''
            }, false, function (response) {
                me.selected = Ext.decode(response.responseText);
            });
        }else {
            me.selected = '';
        }
    }
});