/**
 * 文档类型附件展现
 */
Ext.define('OrientTdm.DataMgr.FileMgr.Grid.OrientModelVideoFileGrid', {
    // extend: 'OrientTdm.DataMgr.FileMgr.Grid.OrientModelFileGrid',
    extend: 'OrientTdm.TestBomBuild.Panel.GridPanel.FileGridpanel',
    alternateClassName: 'OrientExtend.ModelVideoFileGrid',
    alias: 'widget.orientModelVideoFileGrid',
    beforeInitComponent: function () {

    },
    afterInitComponent: function () {
        //增加预览操作
        var me = this;
        me.columns = me.columns || [];
        me.columns.push({
            header: '预览',
            width: 50,
            sortable: true,
            dataIndex: 'filename',
            renderer: function (value, metaData, record) {
                var retVal = [];
                var fileId = record.getId();
                retVal.push(
                    "<a href='#' onclick='OrientExtUtil.FileHelper.showVideo(\""+fileId+"\")' class='preview'>",
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





