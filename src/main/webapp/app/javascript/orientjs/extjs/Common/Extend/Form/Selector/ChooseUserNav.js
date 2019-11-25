/**
 * Created by qjs on 2016/11/3.
 */
Ext.define('OrientTdm.Common.Extend.Form.Selector.ChooseUserNav', {
    extend: 'Ext.view.View',
    alias: 'widget.chosenuserbrowser',
    uses: 'Ext.data.Store',
    singleSelect: true,
    overItemCls: 'x-view-over',
    itemSelector: 'div.thumb-wrap',
    tpl: [
        '<tpl for=".">',
        '<div class="thumb-wrap">',
        '<div class="thumb">',
        (!Ext.isIE6 ? '<img src="{icon}" />' :
            '<div style="width:32px;height:32px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'{icon}\')"></div>'),
        '</div>',
        '<span>{name}</span>',
        '</div>',
        '</tpl>'
    ],
    config: {
        //已经选中的数据
        selectedValue: '',
        selectedUsers:[]
    },
    initComponent: function () {
        var me = this;
        if (!Ext.isEmpty(me.selectedValue)) {
            me.extraFilter = {
                idFilter: {
                    'in': me.selectedValue
                }
            };
        }
        var chosenUsers = [];
        var userArr = me.selectedValue.split(',');
        Ext.Ajax.request({
            url: serviceName + '/user/listByFilter.rdm',
            params: {extraFilter: Ext.isEmpty(me.extraFilter) ? '' : Ext.encode(me.extraFilter)},
            async: false,
            success: function (response) {
                var retObj = response.decodedData;
                if (retObj.success == true) {
                    for(var i=0; i<retObj.results.length; i++) {
                        for(var j=0; j<userArr.length; j++) {
                            if(userArr[j] == (retObj.results[i].id)) {
                                chosenUsers.push(retObj.results[i]);
                            }
                        }
                    }

                }
                else {

                }
            }
        });
        //var selectedUsers = me.selectedValue.split(',');
        me.selectedUsers = chosenUsers;
        var tplData = [];
        for(var user in me.selectedUsers) {
            if(me.selectedUsers[user]['allName'].length>0) {
                tplData.push({name:me.selectedUsers[user]['allName'],icon:'app/images/head/defaultUser.png',userName:me.selectedUsers[user]['userName']});
            }
        }

        me.store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            data:tplData,
            fields: [ 'name', 'icon','userName']
        });

        Ext.apply(me,{
            listeners: {
                scope: this,
                itemdblclick: this.fireImageSelected
            }
        });

        this.callParent(arguments);
        this.store.sort();
    },
    fireImageSelected:function(dataview,record,selection) {
        var me = this;
        //var selectedUsers = me.selectedValue.split(',');
        var selectedUsers = me.selectedUsers;
        me.selectedValue = '';
        var name = record.data.userName;
        var tplData = [];
        for(var index in selectedUsers) {
            if(selectedUsers[index]['userName'] == name) {
                delete me.selectedUsers[index];
            }else if(!Ext.isEmpty(selectedUsers[index]) && selectedUsers[index]['allName'].length>0){
                tplData.push({name:selectedUsers[index]['allName'],icon:'app/images/head/defaultUser.png',userName:selectedUsers[index]['userName']});
                me.selectedValue += selectedUsers[index]['userName']+',';
            }
        }
        //me.selectedValue = selectedUsers.join(',');
        //var afterSelectedUsers = me.selectedValue.split(',');
        //
        //for(var user in afterSelectedUsers) {
        //    if(afterSelectedUsers[user].length>0) {
        //        tplData.push({name:afterSelectedUsers[user],icon:'icon-userPic'});
        //    }
        //}
        me.getStore().loadData(tplData);

        //针对数据库操作删除记录
        var store = me.up('chooseUserPanel').down('unSelectedUserPanel').selectedUsers;//这是要修改的变量
        for(var key in store) {
            if(store[key].userName == name) {
                delete store[key];
            }
        }

        //重新勾选grid
        var toSelectRecords = [];
        var beforeChosenRecords = me.up('chooseUserPanel').down('unSelectedUserPanel').getSelectionModel().getSelection();
        for(var i=0; i<beforeChosenRecords.length; i++){
            var record = beforeChosenRecords[i];
            if(!Ext.isEmpty(store[beforeChosenRecords[i].data.id])||me.selectedValue.indexOf(record.data.userName)>=0){
                toSelectRecords.push(beforeChosenRecords[i]);
            }
        }
        me.up('chooseUserPanel').down('unSelectedUserPanel').getSelectionModel().select(toSelectRecords);

    }

});