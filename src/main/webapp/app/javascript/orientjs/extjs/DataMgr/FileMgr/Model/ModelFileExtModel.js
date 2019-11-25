/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.DataMgr.FileMgr.Model.ModelFileExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'fileid',
        'filename',
        'filedescription',
        'edition',
        'filesize',
        'uploadUserName',
        'uploadDate',
        'filesecrecy',
        'filePath',
        'sFilePath',
        'fileCatalog',
        'fileState'
    ]
});