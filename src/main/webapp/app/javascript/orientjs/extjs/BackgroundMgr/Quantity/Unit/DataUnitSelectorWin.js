/**
 * Created by Administrator on 2016/7/21 0021.
 */
Ext.define('OrientTdm.BackgroundMgr.Quantity.Unit.DataUnitSelectorWin', {
        extend: 'Ext.window.Window',
        alias: 'widget.dataUnitSelectorWin',
        config: {
            bindRecord: null,
            afterSelected: Ext.emptyFn
        },
        requires: [
            'OrientTdm.Common.Extend.Tree.OrientTree'
        ],
        initComponent: function () {
            var me = this;
            var dataTypeTree = me._createUnitTree();
            Ext.apply(me, {
                plain: true,
                height: 600,
                width: 200,
                layout: 'fit',
                maximizable: false,
                title: '选择单位',
                modal: true,
                autoShow: true,
                items: [dataTypeTree],
                buttons: [
                    {
                        text: '取消',
                        iconCls: 'icon-close',
                        handler: function () {
                            this.up('window').close();
                        }
                    },
                    {
                        text: '保存',
                        iconCls: 'icon-save',
                        handler: me._saveSelected,
                        scope: me
                    }
                ]
            });
            me.callParent(arguments);
        },
        _createUnitTree: function () {
            var store = Ext.create('Ext.data.TreeStore', {
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    api: {
                        "read": serviceName + '/Quantity/getAllUnits.rdm'
                    },
                    reader: {
                        type: 'json',
                        successProperty: 'success',
                        totalProperty: 'totalProperty',
                        root: 'results',
                        messageProperty: 'msg'
                    }
                }
            });
            var toolBar = Ext.create('Ext.toolbar.Toolbar', {
                items: [
                    {
                        xtype: 'trigger',
                        triggerCls: 'x-form-clear-trigger',
                        onTriggerClick: function () {
                            this.setValue('');
                            this.up('treepanel')._clearFilter();
                        },
                        emptyText: '快速搜索',
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function (field, e) {
                                if (Ext.EventObject.ESC == e.getKey()) {
                                    field.onTriggerClick();
                                } else {
                                    this.up('treepanel')._filterByText(this.getRawValue(), "text");
                                }
                            }
                        }

                    }
                ]
            });
            var retVal = Ext.create('Ext.tree.Panel', {
                hideHeaders: true,
                rootVisible: false,
                store: store,
                dockedItems: [toolBar],
                selModel: {
                    mode: 'SINGLE'
                },
                selType: "checkboxmodel",
                listeners: {
                    beforeselect: function (model, record) {
                        return record.childNodes.length > 0 ? false : true;
                    }
                },
                _filterByText: function (text, propName) {
                    this._clearFilter();
                    var view = this.getView();
                    var me = this;
                    var nodesAndParents = [];
                    this.getRootNode().cascadeBy(function (tree, view) {
                        var currNode = this;
                        if (currNode && currNode.data[propName] && currNode.data[propName].toString().toLowerCase().indexOf(text.toLowerCase()) > -1) {
                            me.expandPath(currNode.getPath());
                            while (currNode.parentNode) {
                                nodesAndParents.push(currNode.id);
                                currNode = currNode.parentNode;
                            }
                        }
                    }, null, [me, view]);
                    this.getRootNode().cascadeBy(function (tree, view) {
                        var uiNode = view.getNodeByRecord(this);
                        if (uiNode && !Ext.Array.contains(nodesAndParents, this.id)) {
                            Ext.get(uiNode).setDisplayed('none');
                        }
                    }, null, [me, view]);
                },
                _clearFilter: function () {
                    var view = this.getView();
                    this.getRootNode().cascadeBy(function (tree, view) {
                        var uiNode = view.getNodeByRecord(this);
                        if (uiNode) {
                            Ext.get(uiNode).setDisplayed('table-row');
                        }
                    }, null, [this, view])
                }
            });
            return retVal;
        },
        _saveSelected: function () {
            var me = this;
            var treepanel = this.down('treepanel');
            var records = treepanel.getSelectionModel().getSelection();
            if (records.length == 0) {
                OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.atleastSelectOne);
            } else {
                var unitInfo = {
                    unitId: records[0].raw.unitId,
                    unitName: records[0].raw.text
                };
                if (me.afterSelected) {
                    me.afterSelected.call(me, unitInfo);
                    me.close();
                }
            }

        }
    }
);