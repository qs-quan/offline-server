Ext.define('OrientTdm.FlowCommon.flowDiagram.process.flowUserInteraction', {
    extend: 'Ext.Base',
    config: {
        curSelCellAttr: null
    },
    registerSelChangeHandler: function (graph) {
        var me = this;
        graph.getSelectionModel().addListener(mxEvent.CHANGE, function (sender, evt) {
            me.selectionChanged(graph);
        });
    },

    selectionChanged: function (graph) {
        // Forces focusout in IE
        graph.container.focus();

        // Gets the selection cell
        var cell = graph.getSelectionCell();

        if (cell === null || typeof cell === "undefined") {
            this.curSelCellAttr = null;
            return;
        }

        if (cell.isVertex()) {
            this.curSelCellAttr = cell.flowAttrs;
        } else {
            this.curSelCellAttr = null;
        }
    },

    getCurSelectedCellAttr: function () {
        return this.curSelCellAttr;
    }

});