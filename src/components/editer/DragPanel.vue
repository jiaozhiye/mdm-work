<template>
    <div class="mdm-scale-drag" v-drag></div>
</template>

<script>
import DragElement from 'assets/js/drag'
import { prefixCss } from 'assets/js/util'

export default {
    name: 'drag-panel',
    props: [],
    data(){
        return {}
    },
    directives: {
        drag: {
            inserted(el, binding, vnode){ // 当被绑定的元素插入到 DOM 中时
                let timer   = null
                let element = null
                let tranX = 0 // translateX
                let tranY = 0 // translateY
                let oRegExp = /\([^\(\)]+\)/
                document.addEventListener('keydown', function(ev){
                    if (ev.keyCode !== 32) return
                    if (!timer){
                        timer = setTimeout(() => {
                            el.style.display = 'block'
                            el.style.cursor  = '-webkit-grab'
                            if (element != null) return
                            element = new DragElement({
                                el: el,
                                isprev: true,
                                dragstart(){
                                    let res = el.parentNode.children[0].style.transform.match(oRegExp)
                                    if (res != null && res.length > 0){
                                        let arr = res[0].slice(1, res[0].length - 1).split(', ')
                                        tranX = Number.parseFloat(arr[0])
                                        tranY = Number.parseFloat(arr[1])
                                    }
                                    // console.log(tranX, tranY)
                                },
                                dragging(l, t){
                                    // console.log(l, t)
                                    prefixCss(el.parentNode.children[0], 'transform', `translate3d(${l + tranX}px, ${t + tranY}px, 0)`)
                                }
                            })
                            element.install()
                        }, 300)
                    }
                }, false)
                document.addEventListener('keyup', function(ev){
                    el.style.cursor  = 'auto'
                    el.style.display = 'none'
                    clearTimeout(timer)
                    timer = null
                }, false)
            }
        }
    }
}
</script>

<style scoped>
.mdm-scale-drag {
    display: none;
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: auto;
    user-select: none;
    z-index: 1;
}
</style>