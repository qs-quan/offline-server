/**
 * Created by GNY on 2018/6/5
 */
Ext.define('OrientTdm.Mongo.Version.ChangeVersionPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.changeVersionPanel',
    layout: 'fit',
    config: {
        modelId: null,
        dataId: null
    },
    initComponent: function () {
        var me = this;
        var items = [];
        var radioGroupItems = null;
        var params = {
            modelId: me.modelId,
            dataId: me.dataId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/mongoService/queryVersionList.rdm', params, false, function (resp) {
            radioGroupItems = resp.decodedData.results;
        });
        for (var i = 0; i < radioGroupItems.length; i++) {
            var version = radioGroupItems[i].version;
            var isshow = radioGroupItems[i].isshow;
            var item = {
                boxLabel: '版本'+version,
                name: 'version',
                width: 180,
                inputValue: version,
                checked: isshow == "1"
            };
            items.push(item);
        }
        var groupItem = [{
            xtype: 'radiogroup',
            layout: {
                type: 'vbox',
                align: 'left'
            },
            items: items
        }];

        Ext.apply(me, {
            items: groupItem
        });

        me.callParent(arguments);
    }
});