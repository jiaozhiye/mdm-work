export default class TableCell {
    constructor(options){
        this.setParams(options)
        if (!this.wrapper){
            throw new Error('组件参数有误！')
        }
    }
    setParams(options){
        this.wrapper = options.tbodyWrapper || this.wrapper || null
        this.exceptIndexs = options.exceptCellIndexs || this.exceptIndexs || []
        this.callback = options.callback || this.callback || null
    }
    install(){
        // 当前操作的节点，用于判断是否需要执行核心算法
        this.currentNode = null
        // 事件绑定
        this.bindEvent()
    }
    bindEvent(){
        this.wrapper.onmouseover  = this.enterFunc.bind(this)
        this.wrapper.onmouseleave = this.leaveFunc.bind(this)
    }
    leaveFunc(){
        // 参数 -1 -> 取消所有高亮样式
        this.setCellStyle(-1)
        this.currentNode = null
    }
    enterFunc(ev){
        ev.stopPropagation()
        // 获取单元格td节点
        const node = this.findParent(ev.target, 'td')
        if (node === this.currentNode) return
        this.currentNode = node
        // 获取当前td节点在tr中的索引
        let index = this.findIndex(node.parentNode.children, node)
        // 设置单元格样式
        this.setCellStyle(index)
        // 执行回调
        this.callback && this.callback(this.findIndex(this.wrapper.children, node.parentNode), index)
    }
    setCellStyle(v){
        const trNodes = this.wrapper.children
        for (let i = 0, len = trNodes.length; i < len; i++){
            let tdNodes = trNodes[i].children
            // 清空所有高亮样式
            for (let k = 0, len = tdNodes.length; k < len; k++){
                tdNodes[k].classList.remove('ctd')
            }
            if (v !== -1 && this.exceptIndexs.indexOf(v) === -1){
                tdNodes[v].classList.add('ctd')
            }
            tdNodes = null
        }
    }
    findParent(obj, tname){
        while (obj && obj != document){
            if (obj.tagName.toLowerCase() === tname){
                return obj
            } else {
                 obj = obj.parentNode
            }
        }
        return null
    }
    findIndex(nodeList, obj){
        return Array.from(nodeList).findIndex(item => item === obj)
    }
    update(options){
        this.setParams(options)
    }
    remove(){
        // 解绑事件
        this.wrapper.onmouseover  = null
        this.wrapper.onmouseleave = null
        // 移除节点
        // 释放内存
        for (let attr in this){
            this[attr] = null
        }
    }
}
