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
        <el-form-item label="视频地址">
            <el-input type="textarea" :rows="3" v-model="form.video" clearable placeholder="格式：多个视频地址用逗号分割"></el-input>
        </el-form-item>
        <el-form-item label="PDF文件">
            <el-upload
                ref="upload"
                :action="uploadUrl"
                :multiple="true"
                :file-list="fileList"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="handleAvatarSuccess">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传 pdf 文件，大小不超过 5M</div>
            </el-upload>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { modArticleRecord, getArticleRecord, uploadPdfUrl } from 'api'
import { mapState, mapActions } from 'vuex'
import { getFileName } from 'assets/js/util'

export default {
    name: 'app-mod-article',
    props: ['recordId'],
    data (){
        return {
            uploadUrl: uploadPdfUrl,
            form: {
                class_id: '',
                title: '',
                video: '',
                org_name: '',
                pdf_path: ''
            },
            fileList: [], // 上传文件列表
            rules: {
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' }
                ],
                class_id: [
                    { required: true, message: '请选所属分类', trigger: 'change' }
                ]
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading']),
        ...mapState('dict', ['classifyList'])
    },
    methods: {
        ...mapActions('dict', ['createClassifyList']),
        beforeRemove(file, fileList){
            return this.$confirm(`确定移除 ${ file.name }？`)
        },
        handleRemove(file, fileList){
            // 重置 fileList 数组
            this.fileList = fileList
        },
        handleAvatarSuccess(res, file){ // res -> response
            if (res.code == 1){
                // 在 fileList 中追加新上传的数据
                this.fileList.push({ name: res.data.org_name, url: res.data.url })
                let nameStr = ''
                let pathStr = ''
                this.fileList.forEach(item => {nameStr += `${item.name},`;pathStr += `${item.url},`})
                this.form.org_name = nameStr
                this.form.pdf_path = pathStr
            } else {
                this.$message.error(res.message)
            }
        },
        async getFormInfo(request, attrName, callback){
            const response = await request()
            if (response.code == 1){
                this[attrName] = response.data || []
                callback && callback()
            } else {
                this.$message.error(response.message)
            }
        },
        async saveRecord(){
            const response = await modArticleRecord({
                id: this.recordId,
                ...this.form
            })
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
        this.getFormInfo(async () => getArticleRecord({ id: this.recordId }), 'form', () => {
            if (!this.form.pdf_path) return
            const arr_path = this.form.pdf_path.split(',')
            const arr_name = this.form.pdf_org_name.split(',')
            // 初始化设置 fileList
            arr_path.forEach((item, key) => this.fileList.push({ name: arr_name[key], url: item }) )
        })
        this.createClassifyList()
    }
}
</script>

<style>
.el-upload__tip {
    line-height: 12px;
}
</style>