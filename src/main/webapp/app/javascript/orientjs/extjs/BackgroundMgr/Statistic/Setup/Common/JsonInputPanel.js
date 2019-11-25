/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.Setup.Common.JsonInputPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.jsonInputPanel',
    config: {},
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: [
                {
                    name: 'jsonInput',
                    xtype: 'textarea',
                    listeners: {
                        afterrender: function (field) {
                            var itemId = this.getItemId() + '-inputEl';
                            me.codeMirror = CodeMirror.fromTextArea(document.getElementById(itemId), {
                                mode: "application/json",
                                indentWithTabs: true,
                                smartIndent: true,
                                lineNumbers: false,
                                matchBrackets: true,
                                autofocus: true,
                                extraKeys: {
                                    "Ctrl-Space": "autocomplete"
                                }
                            });
                            var jsonInput = this;
                            me.codeMirror.on('change', function (component) {
                                jsonInput.setValue(component.getValue());
                            });
                        },
                        bodyresize: function (panel, width, height) {
                            me.codeMirror.setSize(width, height);
                        }
                    }
                }
            ]
        });
        me.callParent(arguments);
    }
});