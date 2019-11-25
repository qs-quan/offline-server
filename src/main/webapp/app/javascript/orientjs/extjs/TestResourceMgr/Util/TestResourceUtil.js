/**
 * Created by Fzh on 2016/9/26
 * Model相关通用函数
 */

Ext.define("OrientTdm.TestResourceMgr.Util.TestResourceUtil", {
    extend: 'Ext.Base',
    alternateClassName: 'TestResourceUtil',
    statics: {
        deviceModelId: null,
        getDeviceModelId: function() {
            if(TestResourceUtil.deviceModelId) {
                return TestResourceUtil.deviceModelId;
            }
            else {
                var deviceModelId = OrientExtUtil.ModelHelper.getModelId("T_DEVICE", TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID);
                TestResourceUtil.deviceModelId = deviceModelId;
                return deviceModelId;
            }
        },
        getDeviceStateFilter: function(state) {
            return new CustomerFilter("C_STATE_"+TestResourceUtil.getDeviceModelId(), CustomerFilter.prototype.SqlOperation.In, "", state);
        },
        setDeviceState: function(ids, state) {
            var success = true;
            if(ids instanceof Array) {
                ids = ids.join(",");
            }
            var params = {
                ids: ids,
                state: state
            };
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/resourceMgr/setDeviceState.rdm', params, false, function (response) {
                var retV = Ext.decode(response.responseText);
                success = retV.results;
            });
            return success;
        },
        addDeviceUseRecord: function(deviceId, task, outTime, inTime, times) {
            var newId = null;
            var params = {
                deviceId: deviceId,
                task: task,
                outTime: outTime,
                inTime: inTime,
                times: times
            };
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/resourceMgr/addDeviceUseRecord.rdm', params, false, function (response) {
                var retV = Ext.decode(response.responseText);
                newId = retV.results;
            });
            return newId;
        },
        addDeviceRepairRecord: function(deviceId, company, time, worker, bug, billId) {
            var newId = null;
            var params = {
                deviceId: deviceId,
                company: company,
                time: time,
                worker: worker,
                bug: bug,
                billId: billId
            };
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/resourceMgr/addDeviceRepairRecord.rdm', params, false, function (response) {
                var retV = Ext.decode(response.responseText);
                newId = retV.results;
            });
            return newId;
        },
        addDeviceCalcRecord: function(tableName, schemaId, modelId, dataId, code, time, worker, certificate, properties) {
            var newId = null;
            var params = {
                tableName: tableName,
                schemaId: schemaId,
                modelId: modelId,
                dataId: dataId,
                code: code,
                time: time,
                worker: worker,
                certificate: certificate,
                properties: properties
            };
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/resourceMgr/addDeviceCalcRecord.rdm', params, false, function (response) {
                var retV = Ext.decode(response.responseText);
                newId = retV.results;
            });
            return newId;
        }
    }
})
;
