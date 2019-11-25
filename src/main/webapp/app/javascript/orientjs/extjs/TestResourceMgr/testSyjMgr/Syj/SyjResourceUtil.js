/**
 * 试验件相关通用函数
 */
Ext.define("OrientTdm.TestResourceMgr.testSyjMgr.Syj.SyjResourceUtil", {
    extend: 'Ext.Base',
    alternateClassName: 'SyjResourceUtil',
    statics: {
        syjModelId: null,

        getSyjModelId: function() {
            if(SyjResourceUtil.syjModelId) {
                return SyjResourceUtil.syjModelId;
            }else {
                var syjModelId = OrientExtUtil.ModelHelper.getModelId("T_SYJ", TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID);
                SyjResourceUtil.syjModelId = syjModelId;
                return syjModelId;
            }
        }/*,

        getSyjStateFilter: function(state) {
            return new CustomerFilter("C_STATE_"+TestResourceUtil.getSyjeModelId(), CustomerFilter.prototype.SqlOperation.In, "", state);
        },

        setSyjState: function(ids, state) {
            var success = true;
            if(ids instanceof Array) {
                ids = ids.join(",");
            }
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/resourceMgr/setSyjState.rdm', {
                    ids: ids,
                    state: state
                }, false, function (response) {
                    success = Ext.decode(response.responseText).results;
                });

            return success;
        },

        addSyjUseRecord: function(syjId, task, outTime, inTime, times) {
            var newId = null;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/resourceMgr/addSyjUseRecord.rdm', {
                    syjId: syjId,
                    task: task,
                    outTime: outTime,
                    inTime: inTime,
                    times: times
                }, false, function (response) {
                    newId = Ext.decode(response.responseText).results;
                });

            return newId;
        },

        addSyjRepairRecord: function(syjId, company, time, worker, bug, billId) {
            var newId = null;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/resourceMgr/addSyjRepairRecord.rdm', {
                    syjId: syjId,
                    company: company,
                    time: time,
                    worker: worker,
                    bug: bug,
                    billId: billId
                }, false, function (response) {
                    newId = Ext.decode(response.responseText).results;
                });

            return newId;
        },

        addSyjCalcRecord: function(tableName, schemaId, modelId, dataId, code, time, worker, certificate, properties) {
            var newId = null;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/resourceMgr/addSyjCalcRecord.rdm', {
                    tableName: tableName,
                    schemaId: schemaId,
                    modelId: modelId,
                    dataId: dataId,
                    code: code,
                    time: time,
                    worker: worker,
                    certificate: certificate,
                    properties: properties
                }, false, function (response) {
                    newId = Ext.decode(response.responseText).results;
                });

            return newId;
        }*/
    }
});
