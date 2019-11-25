/**
 * Created by enjoy on 2016/4/18 0018.
 */
Ext.define("OrientTdm.Common.Extend.Button.Override.QueryAllModelDataButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        modelGridPanel.fireEvent("refreshGridByCustomerFilter");
    }
})
;