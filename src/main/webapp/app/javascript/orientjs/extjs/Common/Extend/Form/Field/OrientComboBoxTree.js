Ext.define("OrientTdm.Common.Extend.Form.Field.OrientComboBoxTree", {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.orientComboboxTree',
    root: {
        expanded: true,
        id: "-1",
        text: "root"
    },
    url: '',
    tree: {},
    initComponent: function () {
        this.store = new Ext.data.Store({
            fields: [{
                name: 'id',
                type: 'string'
            }, {
                name: 'text',
                type: 'string'
            }]
        });
        Ext.apply(this, {
            editable: false,
            queryMode: 'local',
            select: Ext.emptyFn
        });

        this.displayField = this.displayField || 'text';
        this.valueField = this.valueField || 'id';
        this.treeid = Ext.String.format('tree-combobox-{0}', Ext.id());
        this.tpl = Ext.String.format('<div id="{0}"></div>', this.treeid);

        if (this.url) {
            var me = this;
            var store = Ext.create('Ext.data.TreeStore', {
                root: this.root,
                proxy: {
                    type: 'ajax',
                    url: this.url,
                    reader: {
                        type: 'json',
                        successProperty: 'success',
                        totalProperty: 'totalProperty',
                        root: 'results',
                        messageProperty: 'msg'
                    }
                }
            });
            this.tree = Ext.create('Ext.tree.Panel', {
                rootVisible: false,
                autoScroll: true,
                height: 200,
                store: store
            });
            this.tree.on('itemclick', function (view, record) {
                me.setValue(record);
                me.collapse();
            });
            me.on('expand', function () {
                if (!this.tree.rendered) {
                    this.tree.render(this.treeid);
                }
            });
        }
        this.callParent(arguments);
    },
    setValue: function (value, doSelect) {
        if (null == this.getValue()) {
            //判断是否可以转为json格式
            if (value && !(value instanceof Object)) {
                var originalValue = value;
                value = Ext.decode(value);
                if (this.isJson(value)) {
                    value = this.store.createModel(value);
                } else
                    value = originalValue;
            }
        }
        this.callParent(arguments);
    },
    isJson: function (obj) {
        var isJson = typeof(obj) == 'object' && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
        return isJson;
    }
});