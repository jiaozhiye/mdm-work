<template>
<div>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="所属分类" prop="class_id">
            <el-select v-model="form.class_id" clearable placeholder="选择分类">
                <el-option v-for="(item, key) in classifyList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="文章标题" prop="title">
            <el-input v-model="form.title" clearable placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="内容">
            <quill-editor v-model="form.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { modArticleRecord, getArticleRecord } from 'api'
import { mapState, mapActions } from 'vuex'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor, Quill } from 'vue-quill-editor'
import ImageResize from 'quill-image-resize-module'
Quill.register('modules/imageResize', ImageResize)

export default {
    name: 'app-mod-article',
    props: ['recordId'],
    data (){
        return {
            form: {
                class_id: '',
                title: '',
                content: ''
            },
            rules: {
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' }
                ],
                class_id: [
                    { required: true, message: '请选所属分类', trigger: 'change' }
                ]
            },
            editorOption: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'font': [] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        ['clean'],
                        ['link', 'image', 'video']
                    ],
                    history: {
                        delay: 1000,
                        maxStack: 50,
                        userOnly: false
                    },
                    imageResize: {
                        displayStyles: {
                            backgroundColor: 'black',
                            border: 'none',
                            color: 'white'
                        },
                        modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
                    }
                }
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading']),
        ...mapState('dict', ['classifyList'])
    },
    methods: {
        ...mapActions('dict', ['createClassifyList']),
        async getFormInfo(request, attrName){
            const response = await request()
            if (response.code == 1){
                this[attrName] = response.data || []
            } else {
                this.$message.error(response.message)
            }
        },
        async saveRecord(){
            const response = await modArticleRecord(this.form)
            if (response.code == 1){
                this.closePanle()
            } else {
                this.$message.error(response.message)
            }
        },
        submitForm(){
            this.$refs['form'].validate(valid => {
                if (valid){
                    this.saveRecord()
                } else {
                    console.log('error submit!')
                }
            })
        },
        resetForm(){
            this.$refs['form'].resetFields()
        },
        closePanle(){
            this.$emit('reloadEvent', 'reload')
        }
    },
    created(){
        this.getFormInfo(async () => getArticleRecord({ id: this.recordId }), 'form')
        this.createClassifyList()
    },
    components: {
        quillEditor
    }
}
</script>

<style>
.quill-editor:not(.bubble) .ql-container,
.quill-editor:not(.bubble) .ql-container .ql-editor {
    height: 30rem;
    padding-bottom: 1rem;
}
.quill-editor .ql-formats * {
    line-height: 20px;
}
</style>