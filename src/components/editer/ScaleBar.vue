<template>
    <div class="mdm-scale-bar">
        <span class="icon real border" @click.stop="realHandler">1:1</span>
        <i class="icon eqf-bigger fit border" @click.stop="adaptHandler"></i>
        <i class="icon eqf-minus" @click.stop="minusHandler(0.05)"></i>
        <span class="icon num">{{ scalePercent }}</span>
        <i class="icon eqf-plus plus" @click.stop="plusHandler(0.05)"></i>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    name: 'scale-bar',
    data(){
        return {
            element: null
        }
    },
    computed: {
        ...mapState('editer', ['poster']),
        ...mapGetters('editer', ['scalePercent'])
    },
    methods: {
        ...mapActions('editer', ['createPosterScale']),
        realHandler(){
            this.createPosterScale(1)
        },
        minusHandler(step){
            let val = (this.poster.scale - step) < 0.1 ? 0.1 : (this.poster.scale - step)
            this.createPosterScale(val)
        },
        plusHandler(step){
            let val = (this.poster.scale + step) > 2 ? 2 : (this.poster.scale + step)
            this.createPosterScale(val)
        },
        adaptHandler(){ // 适配
            this.createPosterScale((this.element.clientHeight - 40) / this.poster.size[1])
        },
        bindWheelEvent(){
            this.element.addEventListener('mousewheel', this.scrollFunc, false)
            this.element.addEventListener('DOMMouseScroll', this.scrollFunc, false)
        },
        scrollFunc(ev){
            ev.stopPropagation()
            let dir = 0 // 0 -> 上 -> 放大     1 -> 下 -> 缩小

            if (ev.wheelDelta){ // Chrome
            	dir = ev.wheelDelta > 0 ? 0 : 1
            } else if (ev.detail){ // Firefox
            	dir = ev.detail < 0 ? 0 : 1
            }

            if (!dir){
                this.plusHandler(0.01)
            } else {
                this.minusHandler(0.01)
            }

            return false
        }
    },
    mounted(){
        this.element = document.getElementById('workspace')
        this.adaptHandler()
        this.bindWheelEvent()
    }
}
</script>

<style scoped>
.mdm-scale-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    left: 20px;
    bottom: 20px;
    font-size: 12px;
    color: #fff;
    background: rgba(0, 0, 0, .7);
    border-radius: 14px;
}
.mdm-scale-bar .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 28px;
    height: 28px;
    font-size: 16px;
    transition: all .3s;
    cursor: pointer;
}
.mdm-scale-bar .icon.border::after {
    position: absolute;
    right: -1px;
    top: 0;
    width: 1px;
    height: 100%;
    background: hsla(0,0%,100%,.3);
    content: "";
}
.mdm-scale-bar .icon.real {
    width: 34px;
    padding-right: 6px;
    justify-content: flex-end;
    font-size: 12px;
    border-radius: 14px 0 0 14px;
}
.mdm-scale-bar .icon.fit {
    width: 28px;
    margin: 0 1px;
}
.mdm-scale-bar .icon.num {
    width: 40px;
    font-size: 12px;
    cursor: default;
}
.mdm-scale-bar .icon.plus {
    width: 30px;
    padding-left: 6px;
    justify-content: flex-start;
    border-radius: 0 14px 14px 0;
}
.mdm-scale-bar .icon:hover {
    background: #000;
}


.mdm-elements .editor-img {
    opacity: 1;
    vertical-align: top;
    box-sizing: unset;
}
</style>