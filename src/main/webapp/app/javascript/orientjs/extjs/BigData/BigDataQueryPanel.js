/*
 * Copyright (c) 2016. Orient Company
 *
 */

/**
 * Created by mengbin on 16/5/30.
 */
Ext.define('OrientTdm.BigData.BigDataQueryPanel', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.bigDataQueryPanel',
    bodyPadding: 10,
    layout: 'anchor',
    autoHeight: true,
    autoScroll: true,
    //自动生成get set方法
    initConfig: {
        hQueryInfo: null
    },

    defaults: {
        anchor: '100%',
        labelAlign: 'left',
        msgTarget: 'side',
        labelWidth: 90
    },
    defaultType: 'textfield',
    initComponent: function () {

        var  me  = this;
        var showColumns = [];
        if(this.initConfig.hQueryInfo!=null){
            var colNames = this.initConfig.hQueryInfo.colNameList;
            var  i = 0 ;
            Ext.each(colNames, function (colName) {
                var check = {
                    xtype: 'checkboxfield',
                    name: colName,
                    fieldLabel: colName,
                    boxLabel: ''

                }
                showColumns.push(check);

            });

        }



        Ext.apply(this, {
            items:  [{
                xtype: 'container',
                anchor: '100%',
                layout: 'hbox',
                items:[{
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [{
                        xtype:'textfield',
                        fieldLabel: '开始时间',
                        name: 'begin',
                        anchor:'95%'

                    }, {
                        xtype:'textfield',
                        fieldLabel: '结束时间',
                        name: 'end',
                        anchor:'95%'
                    }]
                },{
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: showColumns
                }]
            }],
            buttons: [{
                text: '查询',
                handler: function () {
                    me.fireEvent("doSearch");
                }
            }
            ]
        });
        this.callParent(arguments);

    },
    initEvents: function () {
        var me = this;
        me.callParent();

        me.mon(me, 'doSearch', me.doSearch, me);
    },
    afterRender: function () {
        this.callParent();

    },

    doSearch: function (extraParams) {
        //形成新的QueryInfo
        var me = this;
        var form = me.getForm();
        var formValue = OrientExtUtil.FormHelper.generateFormData(form);

        //me.initConfig.hQueryInfo.startTime = formValue.begin;
        //me.initConfig.hQueryInfo.endTime = formValue.end;
        //var cloNames = me.initConfig.hQueryInfo.colNameList;

        var newQueyInfo = {
            fileId:me.initConfig.hQueryInfo.fileId,
            startTime: formValue.begin,
            endTime:formValue.end,
            colNameList:[]
        }
        if(newQueyInfo.startTime==""){
            newQueyInfo.startTime =  me.initConfig.hQueryInfo.startTime;
        }
        var colNames = me.initConfig.hQueryInfo.colNameList;
        Ext.each(colNames, function (colName) {
            var col = formValue[colName];
            if(col!=undefined&&col!=null){
                newQueyInfo.colNameList.push(colName);
            }
        });


        var bigdataGrid = Ext.getCmp('bigdataGrid');
        if (bigdataGrid) {
            bigdataGrid.initConfig.hQueryInfo =  newQueyInfo;
            bigdataGrid.fireEvent("doSearch");

        }






    }

});