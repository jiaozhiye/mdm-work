<template>
    <div class="category" :class="name">
        <div class="title" @click.stop="clickHandler">{{ title }}</div>
        <div class="detail"><slot></slot></div>
    </div>
</template>

<script>
export default {
    name: 'setting-panel-item',
    props: ['title', 'name', 'state'],
    data(){
        return {
            status: this.state
        }
    },
    methods: {
        initial(){
            if (this.state == 'on'){
                this.$el.style.height = 40 + this.$el.children[1].offsetHeight + 'px'
            }
        },
        clickHandler(event){
            this.execToggle(event.currentTarget.parentNode)
        },
        execToggle(obj){
            if (this.status == 'on'){
                obj.style.height = 40 + 'px'
                this.status = 'off'
            } else {
                obj.style.height = 40 + obj.children[1].offsetHeight + 'px'
                this.status = 'on'
            }
        }
    },
    mounted(){
        this.initial()
    }
}
</script>

<style scoped>
.category {
    height: 40px;
    overflow: hidden;
    transition: all .3s ease;
}
.category .title {
    position: relative;
    width: 100%;
    height: 40px;
    line-height: 38px;
    padding-left: 15px;
    color: #4f5d69;
    border-bottom: 1px solid #ddd;
    font-size: 12px;
    transition: all .3s ease;
    cursor: pointer;
}
.category .title:hover {
    background-color: #f7f8f9;
}
.category .detail {
    padding: 0 15px 15px;
    border-bottom: 1px solid #ddd;
    background: #eceef0;
}
</style>
