/**
 * Created by Administrator on 2016/8/24 0024.
 */
Ext.define('OrientTdm.Collab.common.auditFlow.StartAuditFlowPanel', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.startAuditFlowPanel',
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
        if(me.setShowName == true){
            me.firstTitle = '第二步（选择审批流程）';
            me.secondTitle = '第三步（设置人员）';
            me.thirdTitle = '第一步(输入流程名称)'
        }else{
            me.firstTitle = '第一步（选择审批流程）';
            me.secondTitle = '第二步（设置人员）';
        }

        //选择审批模板
        var selectPdCombobox = me._createSelectPdCombobox();
        //发起流程
        Ext.apply(me, {
            items: selectPdCombobox,
            buttons: [{
                    text: '提交',
                    handler: me._startAuditFLow,
                    scope: me,
                    iconCls: 'icon-startFlow'
                }
            ]
        });
        this.callParent(arguments);

        if (me.data.id && me.data.id != "") {
            // panel创建后触发设置默认值的combobox的加载流程图事件
            me._initChooseTaskAssignGrid(me.data.id, me.data.value);
        }
    },
    _createSelectPdCombobox: function () {
        var me = this;
        // 获取按model和申请类型的，获取到对应的combobox默认值
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/AuditFlowModelBind/setBindPds.rdm",{
            modelId: me.modelId,
            typeName: me.typeName
        },false, function (response) {
            me.data =  response.decodedData.results;
        });
        var combobox = Ext.create('OrientTdm.Common.Extend.Form.Field.OrientComboBox', {
            initFirstRecord: true,
            remoteUrl: serviceName + '/AuditFlowModelBind/getModelBindPds.rdm?modelId=' + me.modelId,
            anchor: '100%',
            name: 'pdId',
            fieldLabel: '选择流程定义',
            // 给定默认值，不用setValue因为没生效
            value: me.data.id,
            listeners: {
                select: me._createChooseTaskAssignGrid,
                scope: me
            }
        });
        var retVal = {
            xtype: 'fieldset',
            border: '1 1 1 1',
            collapsible: true,
            title: me.firstTitle,
            items: [
                combobox
            ]
        };
        if(me.setShowName == true){
            return [{
                xtype: 'fieldset',
                border: '1 1 1 1',
                collapsible: true,
                title: me.thirdTitle,
                items: [{
                    id: "customName",
                    xtype: 'textfield',
                    width: 300,
                    fieldLabel: '流程名称',
                    emptyText: '流程名称不可为空',
                    allowBlank: false
                }]
            },retVal];
        }else{
            return [retVal];
        }
    },

    /**
     * 初始流程图形界面（重新方法原因，现有方法无法复用）
     */
    _initChooseTaskAssignGrid: function (id, name) {
        var me = this;
        //初始化选人表格
        me.remove(me.down('#setAssignFieldSet'));
        var fieldSet = {
            xtype: 'fieldset',
            border: '1 1 1 1',
            itemId: 'setAssignFieldSet',
            collapsible: true,
            title: me.secondTitle,
            items: [
                Ext.create('OrientTdm.Collab.common.auditFlow.ChooseAuditAssignGraphPanel', {
                    bindId: id,
                    pdId: name,
                    auditType: me.auditType != undefined ? me.auditType : 'ModelDataAudit'
                })
            ]
        };
        me.add(fieldSet);

    },

    _createChooseTaskAssignGrid: function (combo, records) {
        var me = this;
        var selectData = records;
        if (Ext.isArray(records)) {
            selectData = records[0];
        }
        //初始化选人表格
        me.remove(me.down('#setAssignFieldSet'));
        var fieldSet = {
            xtype: 'fieldset',
            border: '1 1 1 1',
            itemId: 'setAssignFieldSet',
            collapsible: true,
            title: me.secondTitle,
            items: [
                Ext.create('OrientTdm.Collab.common.auditFlow.ChooseAuditAssignGraphPanel', {
                    bindId: selectData.get('id'),
                    pdId: selectData.get('value'),
                    auditType: me.auditType != undefined ? me.auditType : 'ModelDataAudit'
                })
            ]
        };
        me.add(fieldSet);

    },
    _startAuditFLow: function () {
        var me = this;
        // 校验是否为空
        var customNameLabel = Ext.getCmp("customName");
        if(customNameLabel != null && !customNameLabel.validate()){
            Ext.Msg.alert("提示", '流程名称不能为空！');
            return;
        }

        //判断是否选择流程定义
        var pdId = me.down('orientComboBox').getRawValue();
        if (Ext.isEmpty(pdId)) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.unBindPd);
        } else {
            var assigners = me.down('chooseAuditAssignGraphPanel').getAssignInfos(true);
            if (assigners.taskName) {
                OrientExtUtil.Common.info('提示', '请设置任务【<font color="red">' + assigners.taskName + '</font>】的审批人员！');
                return;
            }
            var bindDatas = [];
            Ext.each(me.dataIds, function (dataId) {
                bindDatas.push({
                        model: me.customModelId != undefined ? me.customModelId : me.modelId,
                        dataId: dataId,
                        extraParams: {
                            auditFlowModelBindId: me.down('orientComboBox').getValue()
                        }
                    }
                );
            });
            var taskUserAssigns = {};
            Ext.each(assigners, function (assigner) {
                if (!Ext.isEmpty(assigner.assign_username)) {
                    if (assigner.assign_username.indexOf(',') != -1) {
                        //用户组
                        taskUserAssigns[assigner.taskName] = {
                            candidateUsers: assigner.assign_username
                        };
                    } else {
                        //单用户
                        taskUserAssigns[assigner.taskName] = {
                            currentUser: assigner.assign_username
                        };
                    }
                }
            });
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/auditFlow/control/start.rdm',{
                    pdId: pdId,
                    auditType: me.auditType != undefined ? me.auditType : 'ModelDataAudit',
                    bindDatas: bindDatas,
                    taskUserAssigns: taskUserAssigns,
                    customName: customNameLabel == null ? "" : customNameLabel.getValue()
                }, true, function (resp) {
                    if(me.successCallback){
                        me.successCallback(resp, taskUserAssigns);
                    }
                    if (me.up('window')) {
                        me.up('window').close();
                    }
            }, true);
        }
    }

});