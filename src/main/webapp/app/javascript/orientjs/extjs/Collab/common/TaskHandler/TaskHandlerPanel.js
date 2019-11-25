/**
 * Created by Administrator on 2017/7/20 0020.
 */
Ext.define('OrientTdm.Collab.common.TaskHandler.TaskHandlerPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.taskHandlerPanel',
    config: {
        dataId: null,
        modelId: null
    },
    initComponent: function () {
        var _this = this;
        Ext.apply(_this, {
            layout: 'fit'
        });
        _this.callParent(arguments);
    },
    initEvents: function () {
        var _this = this;
        _this.callParent(arguments);
    }, afterRender: function () {
        this.callParent();
        var _this = this;
        var params = {
            modelId: _this.modelId,
            dataId: _this.dataId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ComponentBind/list.rdm', params, true, function (response) {
            if (response.decodedData) {
                var results = response.decodedData.results;
                //取第一个
                if (results.length > 0) {
                    var componentItem = _this._createComponent(results[0]);
                    _this.add(componentItem);
                }
            }
        });
    },
    _createComponent: function (componentBind) {
        var _this = this;
        var componentDesc = componentBind.belongComponent;
        var retVal = null;
        if (componentDesc) {
            _this.componentDesc = componentDesc;
            Ext.require(componentBind.componentExtJsClass);
            retVal = Ext.create(componentBind.componentExtJsClass, {
                flowTaskId: '',
                modelId: _this.modelId,
                dataId: _this.dataId,
                componentId: componentDesc.id
            });
        }
        return retVal;
    }
});