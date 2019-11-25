/**
 *  calls the actually data obtainer supplied with user
 */

Ext.define('OrientTdm.FlowCommon.flowDiagram.dataObtainer.flowDataObtainer', {
    extend: 'Ext.Base',
    config:{
        obtainerImpl: null
    },
    config: {
        callStack: []
    },
    /**
     *  initial the obtainer by giving the model's path,
     *   and call the callback function with the jpdlContent
     */
    init: function (dataObtainerImpl, param, initDataGotCallback) {
        var me = this;
        this.callStack = [];
        me.obtainerImpl = dataObtainerImpl;
        me.obtainerImpl.getFlowInitData(param, initDataGotCallback);
    },

    initCompleted: function () {
        this.callFunctionCallStack();
    },

    //this asynchronous call will be push in to stack
    getTaskNodeStatusAsync: function (reqParam, reqSuccessClb) {

        // console.log("pushinstack");
        this.pushInToFunctionCallStack(this.getTaskNodeStatusImpl, arguments, this);
        return;

    },

    getTaskAssignAsync: function (reqParam, reqSuccessClb) {

        this.pushInToFunctionCallStack(this.getTaskAssignImpl, arguments, this);
        return;

    },

    getTaskAssignImpl: function (reqParam, reqSuccessClb) {
        var me = this;
        // console.log("updateData");
        me.obtainerImpl.getTaskAssign(reqParam, reqSuccessClb);
    },

    getFlowTrackInfos: function (reqParam, reqSuccessClb) {
        var me = this;
        me.obtainerImpl.getFlowTrackInfos(reqParam, reqSuccessClb);
    },


    getTaskNodeStatusImpl: function (reqParam, reqSuccessClb) {
        var me = this;
        // console.log("updateData");
        me.obtainerImpl.getTaskNodeStatus(reqParam, reqSuccessClb);
    },

    callFunctionCallStack: function () {
        for (var i = 0; i < this.callStack.length; i++) {
            var theCall = this.callStack[i];
            theCall.func.apply(theCall.env, theCall.params);
        }
        this.callStack = [];
    },

    //be careful with the ajax request
    pushInToFunctionCallStack: function (func, params, env) {
        var theCall = {func: func, params: params, env: env};
        this.callStack.push(theCall);
    }
});
