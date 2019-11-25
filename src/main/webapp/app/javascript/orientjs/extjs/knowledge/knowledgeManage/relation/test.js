/**
 * 知识引用测试
 */

//////////////////需要引用的JS///////////////////////////////
//    '/jslib/ext3.4/ux/RowExpander.js',
//    '/frontView/knowledge/util/fileOperation.js',
//    '/frontView/knowledge/util/map.js',

var relWindow = require('../../../frontView/knowledge/knowledgeManage/relation/relWindow');
var callback = function (resultValue) {
    alert(resultValue.get('searchFile'));
    alert(resultValue.get('searchDiction'));
};
relWindow.init(callback);