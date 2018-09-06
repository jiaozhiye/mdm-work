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
            <el-input v-model="form.video" clearable placeholder="请输入视频地址"></el-input>
        </el-form-item>
        <el-form-item label="PDF文件" prop="pdf_path">
            <el-upload
                ref="upload"
                :action="uploadUrl"
                :multiple="false"
                :auto-upload="false"
                :file-list="fileList"
                :on-change="handleChange"
                :on-success="handleAvatarSuccess">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
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
            fileList: [],
            rules: {
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' }
                ],
                class_id: [
                    { required: true, message: '请选所属分类', trigger: 'change' }
                ],
                pdf_path: [
                    { required: true, message: '请上传PDF文件' }
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
        handleChange(file, fileList){
            if (fileList.length > 1){
                this.fileList = fileList.slice(1)
            }
        },
        handleAvatarSuccess(res, file){ // res -> response
            if (res.code == 1){
                this.form.org_name = res.data.org_name
                this.form.pdf_path = res.data.url
            } else {
                this.$message.error(res.message)
            }
        },
        submitUpload(){
            this.$refs.upload.submit()
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
            this.fileList.push({
                name: getFileName(this.form.pdf_path),
                url: this.form.pdf_path
            })
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