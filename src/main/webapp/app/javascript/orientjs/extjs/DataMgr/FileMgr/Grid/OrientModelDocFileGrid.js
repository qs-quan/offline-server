/**
 * 文档类型附件展现
 */
Ext.define('OrientTdm.DataMgr.FileMgr.Grid.OrientModelDocFileGrid', {
    // extend: 'OrientTdm.DataMgr.FileMgr.Grid.OrientModelFileGrid',
    extend: 'OrientTdm.TestBomBuild.Panel.GridPanel.FileGridpanel',
    alternateClassName: 'OrientExtend.ModelDocFileGrid',
    alias: 'widget.orientModelDocFileGrid',
    beforeInitComponent: function () {

    },
    afterInitComponent: function () {
        //增加预览操作
        var me = this;
        me.columns = me.columns || [];
        /*ToDo doc文件预览*/
        me.columns.push({
            header: '预览',
            width: 50,
            sortable: true,
            dataIndex: 'fileid',
            renderer: function (value, metaData, record) {
                var retVal = [];
                retVal.push(
                    "<a href='" + serviceName + "/modelFile/preview.rdm?fileId=" + value + "' class='preview' +' target=_Blank'>",
                    "</a>"
                );
                return retVal.join("");
            }
        });
    },
    initComponent: function () {
        this.callParent(arguments);
        this.addEvents();
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    }
})
;





