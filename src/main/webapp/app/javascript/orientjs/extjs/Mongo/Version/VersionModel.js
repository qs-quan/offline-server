/**
 * Created by GNY on 2018/6/6.
 */
Ext.define('OrientTdm.Mongo.Version.VersionModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'versionId', mapping: 'versionId', type: 'string'},
        {name: 'versionName', mapping: 'versionName', type: 'string'},
        {name: 'isShow', mapping: 'isShow', type: 'string'}
    ]
});