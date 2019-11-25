/**
 * Created by enjoy on 2016/3/16 0016.
 */
Ext.define("OrientTdm.Common.Locale.OrientLocale", {
    extend: 'Ext.Base',
    alternateClassName: 'OrientLocal',
    statics: {
        prompt: {
            confirm: '确认',
            info: '提示',
            error: '错误',
            saveSuccess: '保存成功',
            formError: '表单存在错误',
            atleastSelectOne: '请至少选择一条记录',
            onlyCanSelectOne: '只能选择一条记录',
            deleteConfirm: '是否确定删除所选记录?',
            rootDelForbidden: '不可删除根节点',
            unBindModel: '未绑定模型!',
            unBindJSPath: '未指定按钮JS路径',
            alreadyTop: '已经到达顶部，无法再向上移动',
            alreadyBottom: '已经到达底部，无法再向下移动',
            alreadyLeft: '已经到达最左侧，无法再向左移动',
            alreadyRight: '已经到达最右侧，无法再向右移动',
            converUncompleted: '转化还未完成，请稍后再试',
            assignSuccess: '分配成功',
            assignFail: '分配失败',
            saveLinkError: '保存快捷方式失败，请联系管理员',
            removeLinkError: '删除快捷方式失败，请联系管理员',
            moveLinkError: '移动快捷方式失败，请联系管理员',
            removePortalSuccess: '成功移除磁贴',
            recorySuccess: "数据恢复成功",
            pauseSuccess: "任务暂停成功",
            resumeSuccess: "任务恢复成功",
            uploadFrist: "请先上传数据文件",
            mappingFirst: "请至少映射一个字段",
            exportAll: '是否确定导出所有记录?',
            dataConvering: '数据解析中，请稍后...',
            containsRepeatHead: '不可存在相同的列头名称',
            containsRepeatRole: '不可存在相同的签署角色名称',
            unBindSelector: '未绑定选择器',
            removeFirst: '只能选择一条数据，请先删除已经选中的数据',
            unModifyAble: '不可修改',
            reAddParam: '请删掉此参数，重新创建新类型的参数',
            complicateUnEditable: '复杂类型无法输入值',
            onlyCanUploadOne: '只能上传一个文件，请先清空上传面板',
            onlyMainParam: '所选数据中不可包含子数据',
            onlyCanRemoveModel: '只能删除业务模型',
            canNotMove: '不可再移动',
            existsModelAlready: '已经存在',
            'delete': '删除',
            confirmDelete: '是否确定删除',
            allreadyDelived: '数据已下发，不可删除',
            unBindPd: '未选择流程定义',
            unBindExtClass: '组件未绑定相关ExtJS类',
            opinionnotnull: '审批意见不可为空',
            onlyPrivateCanUnShare: '只有个人数据可以取消共享'
        },
        constants: {
            RESOURCE_SCHEMA_NAME: '试验资源管理',
            COLLAB_SCHEMA_NAME: '协同模型'
        }
    }
});