/**
 * Created by Seraph on 16/8/30.
 */
Ext.define("OrientTdm.Common.Util.HtmlTriggerHelper", {
    extend: 'Ext.Base',
    alternateClassName: 'HtmlTriggerHelper',
    statics: {
        startUpTool: function (clientType, toolPath, params, propSplit, paramSplit) {
            if(!clientType) {
                clientType = "null";
            }
            if(!toolPath) {
                toolPath = "null";
            }
            if(!propSplit) {
                propSplit = "@@";
            }
            if(!paramSplit) {
                paramSplit = "@@";
            }
            var paramString = null;
            if(typeof params == "object") {
                for (var proName in params) {
                    var proValue = params[proName];
                    if(paramString) {
                        paramString = paramString + paramSplit + proName + propSplit + proValue;
                    }
                    else {
                        paramString = proName + propSplit + proValue;
                    }
                }
            }
            else if(typeof params == "string") {
                paramString = params;
            }

            var command = 'orienttdmV1:// -type ' + clientType + ' -path null -params ' + paramString;
            debugger
            window.location.href = command;
            window.event.returnValue=false;

        },
        getToolPath: function(toolName) {
            var toolPath;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/userTool/getUserToolPathByName.rdm', {toolName: toolName}, false, function (response) {
                var retV = Ext.decode(response.responseText);
                toolPath = retV.results;
            });
            return toolPath;
        }
    }
});