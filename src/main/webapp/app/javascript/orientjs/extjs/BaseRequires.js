/**
 * Created by Administrator on 2016/8/3 0003.
 */
Ext.define('OrientTdm.BaseRequires', {
    extend: 'Ext.Base',
    requires: [
        //通用类
        'OrientTdm.Common.Locale.OrientLocale',
        'OrientTdm.Common.Util.OrientModelHelper',
        'OrientTdm.Common.Util.OrientExtUtil',
        //Ext扩展
        "OrientTdm.Common.Extend.Grid.OrientGrid",
        "OrientTdm.Common.Extend.Form.OrientForm",
        "OrientTdm.Common.Extend.Panel.OrientPanel",
        "OrientTdm.Common.Extend.Panel.OrientTabPanel",
        "OrientTdm.Common.Extend.Grid.OrientModelGrid",
        "OrientTdm.Common.Extend.Plugin.OrientUploadPanel",
        "OrientTdm.Common.Extend.Plugin.OrientTableEnumPanel",
        "OrientTdm.Common.Extend.Plugin.OrientRelationPanel",
        "OrientTdm.Common.Extend.Form.Field.OrientComboBox",
        "OrientTdm.Common.Extend.Tree.ModelTreePanel",
        //第三方插件
        'OrientTdm.Common.ThirdPart.DateTimeField',
        'OrientTdm.Common.Extend.Plugin.CombineCheckEditor',

        //首页
        'OrientTdm.HomePage.Search.SearchDashbord'
    ]
});