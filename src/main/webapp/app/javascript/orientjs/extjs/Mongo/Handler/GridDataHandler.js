/**
 * Created by GNY on 2018/5/30
 */
Ext.define('OrientTdm.Mongo.Handler.GridDataHandler', {
    extend: 'Ext.Base',
    alternateClassName: 'GridDataHandler',
    statics: {
        gridShow: {
            dataHandle: function (infos) {
                var headers = [];
                var colsStr = infos.cols;
                var cols = colsStr.split(",");
                Ext.each(cols, function (col) {
                    headers.push(col);
                });
                //返回表格columns
                var columns = [];
                Ext.each(headers, function (header) {
                    var col = {
                        header: header,
                        flex: 1,
                        dataIndex: header,
                        editor: {
                            xtype: 'textfield'
                        }
                    };
                    columns.push(col);
                });
                //返回表格fields
                var fields = ["ID"];
                Ext.each(cols, function (col) {
                    fields.push(col);
                });
                //返回store的data
                var datas = [];
                var records = infos.datas;
                Ext.each(records, function (record) {
                    var obj = {};
                    var r = record.split(",");
                    for (var i = 0; i < fields.length; i++) {
                        obj[fields[i]] = r[i];
                    }
                    datas.push(obj);
                });
                //返回结果格式{fields:fields,datas:datas,columns:columns}
                return {
                    fields: fields,
                    datas: datas,
                    columns: columns
                }

            }
        }
    }
});