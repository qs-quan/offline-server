/**
 * Created by enjoy on 2016/3/11 0011.
 */
Ext.define('OrientTdm.SysMgr.FuncMgr.Common.IconWindow', {
    extend: 'Ext.window.Window',
    uses: [
        'Ext.layout.container.Border',
        'Ext.form.field.Text',
        'Ext.form.field.ComboBox',
        'Ext.toolbar.TextItem',
        'Ext.layout.container.Fit'
    ],
    requires: [
        'OrientTdm.SysMgr.FuncMgr.Common.IconBrowser',
        'Ext.ux.DataView.Animated'
    ],
    height: 300,
    width: 500,
    title: '选择图标',
    closeAction: 'destroy',
    layout: 'border',
    border: false,
    bodyBorder: false,

    /**
     * initComponent is a great place to put any code that needs to be run when a new instance of a component is
     * created. Here we just specify the items that will go into our Window, plus the Buttons that we want to appear
     * at the bottom. Finally we call the superclass initComponent.
     */
    initComponent: function () {
        this.items = [
            {
                xtype: 'panel',
                layout: 'fit',
                region: 'center',
                items: {
                    xtype: 'iconbrowser',
                    autoScroll: true,
                    id: 'img-chooser-view',
                    listeners: {
                        scope: this,
                        itemdblclick: this.fireImageSelected
                    }
                }
            }
        ];

        this.buttons = [
            {
                text: '确定',
                scope: this,
                handler: this.fireImageSelected
            },
            {
                text: '取消',
                scope: this,
                handler: function () {
                    this.close();
                }
            }
        ];

        this.callParent(arguments);
    },

    /**
     * Fires the 'selected' event, informing other components that an image has been selected
     */
    fireImageSelected: function () {
        var selectedImage = this.down('iconbrowser').selModel.getSelection()[0];
        if (selectedImage) {
            Ext.getCmp(this.iconImgField).setValue('<img src="app/images/function/' + selectedImage.data.thumb + '" />');
            Ext.getCmp(this.iconUrlField).setValue("app/images/function/" + selectedImage.data.thumb);
            this.close();
        }
    }
});