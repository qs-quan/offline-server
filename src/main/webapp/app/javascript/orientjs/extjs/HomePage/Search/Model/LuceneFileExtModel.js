/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.HomePage.Search.Model.LuceneFileExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'fileid',
        'filename',
        'filedescription',
        'filesize',
        'uploadUserName',
        'uploadDate',
        'filesecrecy',
        'filePath',
        'sFilePath',
        'content'
    ]
});