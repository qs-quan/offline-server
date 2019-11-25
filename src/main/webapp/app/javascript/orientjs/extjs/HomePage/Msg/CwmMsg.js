/**
 * Created by Administrator on 2016/12/17.
 */
Ext.define('OrientTdm.HomePage.Msg.CwmMsg', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'title', type:'string'},
        {name:'content', type:'string'},
        {name:'timestamp', type:'int'},
        {name:'userId', type:'int'},
        {name:'type', type:'string'},
        {name:'src', type:'string'},
        {name:'dest', type:'string'},
        {name:'readed', type:'boolean'}
    ]
});