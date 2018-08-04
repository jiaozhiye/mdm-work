export default class DragElement {
    constructor(options){
        this.setParams(options)
        if (!this.el){
            throw new Error('组件参数有误！')
        }
    }
    setParams(options){
        this.el = options.el || this.el
        this.axis = options.axis || this.axis || 'both'
        this.parent = options.parent || this.parent || false
        this.isprev = options.isprev || this.isprev || false
        this.dragstart = options.dragstart || this.dragstart || null
        this.dragging = options.dragging || this.dragging || null
        this.dragstop = options.dragstop || this.dragstop || null
    }
    install(){
        let _this = this

        // 获取当前节点的父节点
        this.elParent = this.el.parentNode

        this.el.onmousedown = function(ev){
            let mouseOffX = ev.pageX
            let mouseOffY = ev.pageY

            let disX = ev.pageX - this.offsetLeft
            let disY = ev.pageY - this.offsetTop
            
            document.onmousemove = function(ev){
                let l = ev.pageX - disX
                let t = ev.pageY - disY

                let mx = ev.pageX - mouseOffX
                let my = ev.pageY - mouseOffY

                if (_this.parent){ // 限定父元素的范围
                    if (l < 0){
                        l = 0
                    }
                    if (l > _this.elParent.clientWidth - _this.el.offsetWidth){
                        l = _this.elParent.clientWidth - _this.el.offsetWidth
                    }
                    if (t < 0){
                        t = 0
                    }
                    if (t > _this.elParent.clientHeight - _this.el.offsetHeight){
                        t = _this.elParent.clientHeight - _this.el.offsetHeight
                    }
                }

                _this.dragging && _this.dragging(l, t, mx, my)
            }
            
            document.onmouseup = function(){
                this.onmousemove = null
                this.onmouseup   = null
                _this.dragstop && _this.dragstop()
            }

            _this.dragstart && _this.dragstart()
            
            // 取消默认行为
            if (this.isprev){
                ev.preventDefault()
                return false
            }
        }
    }
    update(options){
        this.setParams(options)
    }
    remove(){
        // 解绑事件
        this.el.onmousedown = null
        // 移除节点
        // 释放内存
        for (let attr in this){
            this[attr] = null
        }
    }
}
