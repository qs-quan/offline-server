/**
 * 试验模板管理
 */
Ext.define('OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestType.GridPanel.TemplateGridpanel',{
    extend:  'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    // alias: 'widget.testerGridpanel',

    initComponent: function () {
        var me = this;
        var modelId = OrientExtUtil.ModelHelper.getModelId(me.modelName, OrientExtUtil.FunctionHelper.getExperimentSchemaId(), false);
        me.modelId = modelId;
        // me.modelName = "T_SYMB";
        me.customerFilter = [new CustomerFilter("T_SYLX_" + OrientExtUtil.FunctionHelper.getExperimentSchemaId() + "_ID",
            CustomerFilter.prototype.SqlOperation.Equal, "", me.dataId)];

        me.callParent();
        if (me.isSpecialSuccessCallBack) {
            me.addEvents("specialAddButtionSuccessCallBack");
        }
    },

    initEvents: function () {
        var me = this;
        me.callParent();
        if (me.isSpecialSuccessCallBack) {
            me.mon(me, 'specialAddButtionSuccessCallBack', me.specialAddButtionSuccessCallBack, me);
        }
    },

    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = me.callParent(arguments);
        var retV = [];
        var filterNameArray = me.isTemplate ?
            ['详细', '查询', '查询全部'] :
            ['新增','修改','详细', '删除', '查询', '查询全部', '导出'];
        Ext.each(retVal, function (item) {
            if (Ext.Array.contains(filterNameArray, item['text']) && item.btnDesc.issystem == 1) {
                retV.push(item);
            }
        });

        return retV;
    },

    onGridToolBarItemClicked: function (btn, event, eOpts) {
        var me = this;
        var btnDesc = btn.btnDesc;
        if (btnDesc.jspath) {
            Ext.require(btnDesc.jspath);
            var orientBtnInstance = Ext.create(btnDesc.jspath, {
                isSpecialButton: true,
                btnDesc: btnDesc
            });
            me.isSpecialButton = true;
            orientBtnInstance.triggerClicked(me);
        } else {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.unBindJSPath);
        }
    },

    // special buttons will do something specially， such as：
    specialAddButtionSuccessCallBack: function (resp) {
        // if argument is success
        var me = this;
        if (resp.success) {
            // todo set version and uploader and testType
            var dataId = resp.results;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TemplateController/updateVersionAndUploader.rdm', {
                modelId: me.modelId,
                dataId: dataId,
                testTypeId: me.dataId
            }, false, function (response) {

            })
        }
    }
});