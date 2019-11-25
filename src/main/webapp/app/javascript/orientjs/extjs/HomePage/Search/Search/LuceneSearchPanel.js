/**
 * Created by Administrator on 2017/4/14 0014.
 */
Ext.define('OrientTdm.HomePage.Search.Search.LuceneSearchPanel', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.luceneSearchPanel',
    requires: [],
    config: {},
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: '关键词',
                    itemId: 'keyWord'
                }
            ],
            buttons: [
                {
                    text: '搜索',
                    iconCls: 'icon-search',
                    handler: me.doSearch,
                    scope: me
                }
            ],
            buttonAlign: 'center'
        });
        this.callParent(arguments);
        this.addEvents();
    },
    initEvents: function () {
        var me = this;
        me.getForm().getFields().each(function (item) {
            item.mon(item, 'specialkey', me.specialkeyPressed, me);
        });
        me.callParent();
    },
    doSearch: function () {
        var me = this;
        var keyWord = me.down('#keyWord').getValue();
        if (Ext.isEmpty(keyWord)) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, '请输入关键词');
        } else {
            var gridPanel = me.up('searchDashbord').fireEvent('doSearch', keyWord);
        }
    },
    specialkeyPressed: function (field, e) {
        if (e.getKey() == Ext.EventObject.ENTER && !Ext.isEmpty(field.getValue())) {
            field.up('luceneSearchPanel').doSearch();
        }
    }
})
;
