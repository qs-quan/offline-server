/**
 * Created by enjoy on 2016/3/11 0011.
 */
Ext.define(
    'OrientTdm.HomePage.Link.LinkWindow', {
        extend: 'Ext.window.Window',
        uses: [
            'Ext.layout.container.Border',
            'Ext.form.field.Text',
            'Ext.form.field.ComboBox',
            'Ext.toolbar.TextItem',
            'Ext.layout.container.Fit'
        ],
        requires: [
            'OrientTdm.HomePage.Link.LinkBrowser',
            'Ext.ux.DataView.Animated'
        ],
        height: 400,
        width: 670,
        title: '选择快捷方式',
        closeAction: 'destroy',
        layout: 'border',
        border: false,
        bodyBorder: false,
        config: {
            functionNav:null
        },

        /**
         * initComponent is a great place to put any code that needs to be run when a new instance of a component is
         * created. Here we just specify the items that will go into our Window, plus the Buttons that we want to appear
         * at the bottom. Finally we call the superclass initComponent.
         */
        initComponent: function () {
            this.items = [
                {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'fit',
                    items: {
                        xtype: 'linkBrowser',
                        autoScroll: true,
                        id: 'img-chooser-view',
                        listeners: {
                            scope: this,
                            //selectionchange: this.onIconSelect
                            itemclick:this.onImgSelect
                            //itemdblclick: this.fireImageSelected
                        }
                    },
                    tbar: [
                        {
                            xtype: 'textfield',
                            name: 'filter',
                            fieldLabel: '名称',
                            labelAlign: 'right',
                            labelWidth: 35,
                            listeners: {
                                scope: this,
                                buffer: 50,
                                change: this.filter
                            }
                        }
                    ]
                }
            ];

            this.buttons = [
                //{
                //    text: '确定',
                //    scope: this,
                //    handler: this.fireImageSelected
                //},
                {
                    text: '关闭',
                    iconCls:'icon-close',
                    scope: this,
                    handler: function () {
                        this.close();
                    }
                }
            ];

            this.callParent(arguments);

            /**
             * Specifies a new event that this component will fire when the user selects an item. The event is fired by the
             * fireImageSelected function below. Other components can listen to this event and take action when it is fired
             */
            this.addEvents(
                /**
                 * @event selected
                 * Fired whenever the user selects an image by double clicked it or clicking the window's OK button
                 * @param {Ext.data.Model} image The image that was selected
                 */
                'selected'
            );
        },

        /**
         * @private
         * Called whenever the user types in the Filter textfield. Filters the DataView's store
         */
        filter: function (field, newValue) {
            var store = this.down('linkBrowser').store,
                view = this.down('dataview'),
                selModel = view.getSelectionModel(),
                selection = selModel.getSelection()[0];

            store.suspendEvents();
            store.clearFilter();
            store.filter({
                property: 'name',
                anyMatch: true,
                value: newValue
            });
            store.resumeEvents();
            if (selection && store.indexOf(selection) === -1) {
                selModel.clearSelections();
            }
            view.refresh();

        },

        /**
         * Called whenever the user clicks on an item in the DataView. This tells the info panel in the east region to
         * display the details of the image that was clicked on
         */
        onIconSelect: function (dataview, selections) {
            //var selectedImage = this.down('linkBrowser').selModel.getSelection()[0];
            //var functionId = selectedImage.data.id;
            //var action = "";
            //var iconName = selectedImage.data.icon;
            //var index = iconName.indexOf("_");
            //var tpl = this.down('linkBrowser').getSelectedNodes()[0];
            //var img = tpl.firstElementChild.firstElementChild;
            //
            //if(index==-1) {
            //    //未选择图片
            //    index = iconName.indexOf(".");
            //    iconName = iconName.substring(0,index)+"_checked.png";
            //    img.setAttribute("src",iconName);
            //}else{
            //    //已选择图片
            //    action = "remove";
            //    iconName = iconName.substring(0,index)+".png";
            //    img.setAttribute("src",iconName);
            //}

            //Ext.Ajax.request({
            //    url: serviceName + '/home/listUnSelectedFunction.rdm',
            //    async: false,
            //    success: function (response) {
            //        var retObj = response.decodedData;
            //        if (retObj.success == true) {
            //            var unselectedIds = [];//retObj.results;
            //            var results = retObj.results;
            //            for(var i=0;i<results.length;i++) {
            //                unselectedIds.push(results[i].id);
            //            }
            //            if (unselectedIds.indexOf(functionId) == -1) {
            //                canAdd = false;
            //            }
            //        }
            //        else {
            //
            //        }
            //    }
            //});
        },

        onImgSelect: function (dataview,record,selection) {
            var img =selection.childNodes[0].childNodes[0];
            var me = this;
            var functionId = record.data.id;
            var iconName = img.getAttribute("src")+"";
            record.data.icon = iconName;
            var index = iconName.indexOf("_checked");

            if (index == -1) {
                //未选择图片
                index = iconName.indexOf(".");
                iconName = iconName.substring(0, index) + "_checked.png";
                img.setAttribute("src", iconName);
                this.fireEvent('selected', record);
            } else {
                //已选择图片
                iconName = iconName.substring(0, index) + ".png";
                img.setAttribute("src", iconName);
                Ext.Ajax.request({
                    url: serviceName + '/home/removeUserQuickLink.rdm',
                    async: false,
                    params: {functionId:functionId},
                    success: function (response) {
                        var retObj = response.decodedData;
                        if (retObj.success == true) {
                            var quickLinkStore = Ext.getCmp("function-quickLink").getStore();
                            quickLinkStore.remove(record);
                        }
                    }
                });
                //OrientExtUtil.AjaxHelper.doRequest(serviceName + "/home/removeUserQuickLink.rdm", {
                //    functionId: functionId
                //}, true, function (resp) {
                //    if (resp.decodedData.success) {
                //        me.functionNav.getStore().remove(record);
                //        me.functionNav.getStore().reload();
                //    }
                //});
            }
        },

        /**
         * Fires the 'selected' event, informing other components that an image has been selected
         */
        fireImageSelected: function () {
            var selectedImage = this.down('linkBrowser').selModel.getSelection()[0];
            if (selectedImage) {
                this.fireEvent('selected', selectedImage);
                //this.close();
            }
        }
    });