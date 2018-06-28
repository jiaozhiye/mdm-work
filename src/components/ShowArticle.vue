<template>
<div>
    <section class="show-arc-wrapper">
        <h4 class="title">{{ form.title }}</h4>
        <h5 class="sub-desc">创建时间：{{ form.create_time }}　作者：{{ form.author }}</h5>
        <div class="content" v-html="form.content"></div>
    </section>
</div>
</template>

<script>
import { getArticleRecord } from 'api'

export default {
    name: 'app-show-article',
    props: ['recordId'],
    data (){
        return {
            form: {
                title: '',
                content: '',
                create_time: '',
                author: ''
            }
        }
    },
    methods: {
        async getFormInfo(request, attrName){
            const response = await request()
            if (response.code == 1){
                this[attrName] = response.data || []
            } else {
                this.$message.error(response.message)
            }
        }
    },
    created(){
        this.getFormInfo(async () => getArticleRecord({ id: this.recordId }), 'form')
    }
}
</script>

<style>
.show-arc-wrapper {
    width: 346px;
    height: 826px;
    padding: 0 27px;
    background: url(../assets/img/iphone-bg.png) 50% 0 no-repeat;
    background-size: 100% auto;
    margin: 0 auto;
}
.show-arc-wrapper > .title {
    line-height: 24px;
    font-size: 18px;
    font-weight: normal;
    text-align: center;
    padding: 110px 0 10px;
    border-bottom: 1px solid #ddd;
}
.show-arc-wrapper > .sub-desc {
    color: #666;
    font-size: 12px;
    font-weight: normal;
    text-align: center;
    line-height: 24px;
}
.show-arc-wrapper > .content {
    line-height: 24px;
    padding: 5px 10px;
}
.show-arc-wrapper > .content img {
    display: inline-block;
    text-align: center;
    max-width: 100%;
}
</style>