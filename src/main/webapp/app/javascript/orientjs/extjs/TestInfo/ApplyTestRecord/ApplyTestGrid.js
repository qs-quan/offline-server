/**
 * 试验申请列表
 */
Ext.define('OrientTdm.TestInfo.ApplyTestRecord.ApplyTestGrid',{
    extend:  'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.ApplyTestGrid',
    alternateClassName: 'OrientExtend.ApplyTestGrid',

    // 静态方法
    statics: {
        /**
         * 当前任务信息关联的流程图
         * @param piId
         */
        showApplyFlowPanel: function(piId) {
            var flowPanel = Ext.getCmp('applyTestFlowPanel');
            flowPanel.setWidth(600);
            // 移除旧的
            flowPanel.removeAll();
            // 添加新的
            flowPanel.add([
                Ext.create("OrientTdm.Collab.common.auditFlow.MonitAuditFlowPanel", {
                    region: 'center',
                    piId: piId,
                    //width: flowPanel.getWidth(),
                    height: flowPanel.getHeight() - 30 - 400
                }),
                Ext.create('OrientTdm.Collab.MyTask.auditTask.Opinion.AuditTaskHisOpinionList', {
                    region: 'south',
                    piId: piId,
                    title: '历史意见',
                    split: true,
                    height: 150
                })
            ]);
            flowPanel.doLayout();
            flowPanel.expand();
        }
    },

    initComponent: function () {
        var me = this;

        me.modelName = 'T_APPLY_TEST_RECORD';
        me.modelId = OrientExtUtil.ModelHelper.getModelId(
            'T_APPLY_TEST_RECORD',
            OrientExtUtil.FunctionHelper.getSYZYSchemaId(),
            false
        );
        // 只显示自己创建的
        me.customerFilter = [
            new CustomerFilter("M_CREATE_" + me.modelId , CustomerFilter.prototype.SqlOperation.Equal, "", userId),
            new CustomerFilter("M_SOURCE_" + me.modelId , CustomerFilter.prototype.SqlOperation.Equal, "", 'TDM')
        ];

        me.layout='border';
        me.region='center';
        me.multiSelect = false;
        this.callParent(arguments);
    },

    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'customRefreshGrid', me._customRefreshGrid, me);
    },

    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [];
        Ext.each(me.modelDesc.btns, function (btn) {
            if((btn.issystem == '1' && Ext.Array.contains(['新增', '修改', '删除', '详细', '查询', '查询全部'], btn.name)) ||
                (btn.issystem == '0' && '发起审批' == btn.name)){
                retVal.push({
                    iconCls: 'icon-' + btn.code,
                    text: btn.name,
                    scope: me,
                    btnDesc: btn,
                    handler: Ext.bind(me.onGridToolBarItemClicked, me),
                    listeners:{
                        click: me._btnClickHandler,
                        scope: me
                    }
                });
            }
        });

        return retVal;
    },
    createStore: function () {
        var me = this;
        //获取fields
        var fields = [{
            name: 'ID'
        }];
        //获取模型操作描述
        var modelDesc = me.modelDesc;
        if (modelDesc && modelDesc.columns) {
            Ext.each(modelDesc.columns, function (column) {
                fields.push({
                    name: column.sColumnName
                });
            });
        }
        var retVal;
        if (me.dataList) {
            //直接加载数据 内存加载数据暂不支持 新增、修改、删除、查询等操作
            retVal = Ext.create('Ext.data.Store', {
                fields: fields,
                autoLoad: me.loadDataFirst,
                remoteSort: false,
                data: me.dataList,
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json'
                    }
                }
            });
        } else {
            //从后台加载数据
            retVal = Ext.create('Ext.data.Store', {
                fields: fields,
                autoLoad: me.loadDataFirst,
                remoteSort: true,
                // 在后台获取完数据后传到前台进行根据id升序排序
                sorters: [{
                    property: 'id+0',
                    direction: me.sortDirection ? me.sortDirection : 'ASC',
                    property: 'M_CODE_' + me.modelId,
                    direction:'desc'
                }],
                proxy: {
                    type: 'ajax',
                    actionMethods: {
                        create: 'POST',
                        read: 'POST',
                        update: 'POST',
                        destroy: 'POST'
                    },
                    api: {
                        "read": me.queryUrl == "" ? serviceName + "/modelData/getModelData.rdm" : me.queryUrl,
                        "create": me.createUrl == "" ? serviceName + "/modelData/saveModelData.rdm" : me.createUrl,
                        "update": me.updateUrl == "" ? serviceName + "/modelData/updateModelData.rdm" : me.updateUrl,
                        "delete": me.deleteUrl == "" ? serviceName + "/modelData/deleteModelData.rdm" : me.deleteUrl
                    },
                    extraParams: {
                        orientModelId: me.modelId,
                        isView: me.isView,
                        customerFilter: Ext.isEmpty(me.customerFilter) ? "" : Ext.encode(me.customerFilter)
                    },
                    reader: {
                        type: 'json',
                        successProperty: 'success',
                        root: 'results',
                        totalProperty: 'totalProperty',
                        idProperty: 'ID',
                        messageProperty: 'msg'
                    },
                    listeners: {}
                }
            });
        }
        return retVal;
    },
    createColumns: function () {
        var me = this;
        //获取模型操作描述
        var retVal = [];
        var modelDesc = me.modelDesc;
        if (modelDesc && modelDesc.columns) {
            Ext.each(modelDesc.columns, function (column) {
                if (Ext.Array.contains(modelDesc.listColumnDesc, column.id)) {
                    retVal[Ext.Array.indexOf(modelDesc.listColumnDesc, column.id)] = OrientModelHelper.createGridColumn(column);
                }
            });
        }

        // 查看流程图
        retVal.push({
            header: '所属流程',
            sortable: true,
            dataIndex: 'ID',
            renderer: function (value, p, record) {
                // 获取关联审批流程信息
                var showInfo = '';
                var tipInfo =  '未发起';
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/auditFlow/info/getPiIdAndStatusByBindModel.rdm',{
                    modelId: me.modelId,
                    dataId: value
                }, false, function (resp) {
                    var result = resp.decodedData.results;

                    tipInfo = result['activeName'];
var btnHook = '<a href="javascript:;" onclick="OrientExtend.ApplyTestGrid.showApplyFlowPanel(' + '\'' + result["piId"] + '\'' + ')"> <font color="blue">' + tipInfo + '</font></a>';
                    showInfo =  tipInfo == '未发起' ? tipInfo : btnHook;
                });

                // 鼠标悬浮提示内容
                p.tdAttr = 'data-qtip="' + tipInfo + '"';
                return showInfo;
            }
        });

        return retVal;
    },

    /**
     * 提交审批后变更状态并刷新页面，并绑定审批流程
     */
    _customRefreshGrid: function(resp, taskUserAssigns){
        var me = this;
        if(taskUserAssigns == null || taskUserAssigns == undefined){
            // 刷新列表
            me.fireEvent('refreshGrid');
            return;
        }

        // 变更选择项的状态为【审批中】
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ModelController/update.rdm', {
            modelId: me.modelId,
            dataId: me.selectedIds,
            key: 'M_STATE',
            val: '审批中'
        }, false, function () {
            // 执行掉一个任务节点
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/auditFlow/info/commitFirstTask.rdm', {
                piId: Ext.decode(resp.responseText).results,
                taskUserAssigns: Ext.encode(taskUserAssigns)
            }, false, function () {
                // 刷新列表
                me.fireEvent('refreshGrid');
            });
        });
    },

    /**
     * 已发起的不能删除
     * @param selected
     * @returns {boolean}
     * @private
     */
    _deleteBtnVaHandler: function(selected){
        var me = this;
        if(selected.length == 0){
            OrientExtUtil.Common.info('提示', '请至少选择一条数据！');
            return false;
        }

        var flag = true;
        for(var i = 0; i < selected.length; i++){
            var itemData = selected[i].data;
            if(itemData['M_STATE_' + me.modelId] != '未发起'){
                var wtbh = itemData['M_CODE_' + me.modelId];
                OrientExtUtil.Common.info('提示', '委托编号【' + wtbh + '】' + itemData['M_STATE_' + me.modelId] + '，无法删除！');
                flag = false;
                break;
            }
        }

        return flag;
    },

    /**
     * 已发起的不能编辑
     * @param selected
     * @returns {boolean}
     * @private
     */
    _stateBtnHandler: function(selected, btnText){
        var me = this;
        if(selected.length != 1){
            OrientExtUtil.Common.info('提示', '请选择一条数据！');
            return false;
        }

        var state = selected[0].data['M_STATE_' + me.modelId];
        var wtbh = selected[0].data['M_CODE_' + me.modelId];
        if('未发起' != state){
            var msg = '';
            if(btnText == '修改'){
                msg = '禁止编辑！';
            }else{
                msg = '不能重复审批！';
            }
            OrientExtUtil.Common.info('提示', '委托编号【' + wtbh + '】' + state + '，' + msg);
            return false;
        }

        return true;
    },

    /**
     * 按钮点击事件
     * 根据按钮触发不同分类方法
     * @private
     */
    _btnClickHandler: function(btn, event, opts){
        var me = this;
        var selected = OrientExtUtil.GridHelper.getSelectedRecord(me);

        // 给保存按钮绑定事件
        me._saveButtonListeners();

        var flag = true;
        if('新增' === btn.text){
            // 新增需要赋值
            me.formInitData = {};

            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ApplyTestRecordController/getSerialNumber.rdm', {}, false, function (response) {
                if(response.decodedData.success){
                    me.formInitData['M_CODE_' + me.modelId] = response.decodedData.results;
                }else{
                    me.formInitData['M_CODE_' + me.modelId] = 'T' + Ext.Date.format(new Date(), 'YmdHis');
                }
            });

            // 给图号字段绑定事件
            me._checkThFieldListener();
        }else if('修改' === btn.text){
            flag = me._stateBtnHandler(selected, btn.text);

            // 给图号字段绑定事件
            me._checkThFieldListener();

        }else if('发起审批' === btn.text){
            flag = me._stateBtnHandler(selected, btn.text);

        }else if('删除' === btn.text){
            flag = me._deleteBtnVaHandler(selected, btn.text);

        }

        return flag;
    },

    /**
     * 给图号字段绑定事件
     * @private
     */
    _checkThFieldListener: function () {
        var me = this;

        // 指定字段绑定事件
        for(var i = 0; i < me.modelDesc.columns.length; i++){
            var column = me.modelDesc.columns[i];
            if(column.sColumnName == 'M_TH_' + me.modelId){
                column.listeners = {
                    blur: function (c, e, eopts) {
                        if(c.value == undefined || c.value.indexOf('AD') != 0){
                            OrientExtUtil.Common.info('提示', '图号格式不正确，格式：AD......');
                        }
                    }
                };
            }
        }
    },

    /**
     * 给保存按钮绑定事件
     * @private
     */
    _saveButtonListeners: function () {
        var me = this;

        me.saveButtonListeners = {
            click: function (c, b, a, d) {
                var result = true;
                this.scope.customPanel.getForm().getFields().each(function (item) {
                    if(item.name == 'M_TH_' + me.modelId){
                        if(item.value == undefined || item.value.indexOf('AD') != 0){
                            OrientExtUtil.Common.info('提示', '图号格式不正确，格式：AD......');
                            result = false;
                        }

                        return result;
                    }
                });

                return result;
            }
        };
    }

});