/**
 * Created by duanduanpan on 16-3-16.
 */
Ext.define('OrientTdm.BackgroundMgr.CodeGenerate.GenerateCodeForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.generateCodeForm',
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        Ext.apply(me, {
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1
                    },
                    items: [
                        {
                            name: 'name',
                            xtype: 'textfield',
                            fieldLabel: '模块名称',
                            margin: '0 5 0 0',
                            afterLabelTextTpl: required,
                            allowBlank: false
                        }, {
                            name: 'packagePath',
                            xtype: 'textfield',
                            fieldLabel: '包路径',
                            afterLabelTextTpl: required,
                            allowBlank: false
                        }
                    ]
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1
                    },
                    items: [
                        {
                            name: 'hibernateBeanName',
                            xtype: 'orientComboBox',
                            fieldLabel: '绑定Hibernate模型',
                            margin: '0 5 0 0',
                            remoteUrl: serviceName + '/codeTemplate/getHibernateBeanList.rdm',
                            allowBlank: false
                        }
                    ]
                }, {
                    name: 'desc',
                    xtype: 'textareafield',
                    grow: true,
                    labelWidth: 100,
                    height: 300,
                    fieldLabel: '模块说明'
                }
            ]
        });
        this.callParent(arguments);
        this.addEvents("doGenerateCodeEvent", "");
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'doGenerateCodeEvent', me.doGenerateCodeEvent, me);
    },
    doGenerateCodeEvent:function(successCallBack){
        var me = this;
        //收集数据 准备文件
        var form = this.getForm();
        form.submit({
            clientValidation: true,
            url: serviceName + "/codeTemplate/doGemerateCode.rdm",
            success: function (form, action) {
                //生成代码压缩包
                if(successCallBack){
                    successCallBack.call(me,action.result.msg);
                }
            },
            failure: function (form, action) {
                switch (action.failureType) {
                    case Ext.form.action.Action.CLIENT_INVALID:
                        OrientExtUtil.Common.err('失败', '表单存在错误');
                        break;
                    case Ext.form.action.Action.CONNECT_FAILURE:
                        OrientExtUtil.Common.err('失败', '无法连接服务器');
                        break;
                    case Ext.form.action.Action.SERVER_INVALID:
                        OrientExtUtil.Common.err('失败', action.result.msg);
                }
            }
        });

    }
});
