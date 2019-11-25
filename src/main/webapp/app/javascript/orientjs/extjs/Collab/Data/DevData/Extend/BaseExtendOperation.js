/**
 * Created by Administrator on 2016/7/22 0022.
 * 扩展类型定制功能基类
 */
Ext.define("OrientTdm.Collab.Data.DevData.Extend.BaseExtendOperation", {
    extend: 'Ext.Base',
    customRenderer: function (value, p, record) {
        //自定义单元格展现模式 返回渲染单元格html串
        throw ('子类必须实现');
    },
    customEditor: function (clickedColumn, record) {
        //自定义双击单元格时 编辑方式 返回true or false
    },
    beforeSave: function (record) {
        //保存数据前操作 返回true 或者 错误提示
    },
    afterSave: function (record) {
        //保存成功后定制操作 如发起审批流程等
    }
});