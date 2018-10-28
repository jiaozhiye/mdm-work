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
                :data="postData"
                :file-list="fileList"
                :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess"
                :on-error="handleError">
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
import { addArticleRecord, uploadPdfUrl, getQnToken } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-add-article',
    data (){
        return {
            uploadUrl: uploadPdfUrl,
            postData: {
                key: '',
                token: ''
            },
            qiniu_url: 'http://pgvjtieqt.bkt.clouddn.com',
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
        handleRemove(file, fileList){
            // 重置 fileList 数组
            this.fileList = fileList
        },
        beforeAvatarUpload(file){
            this.postData.key = file.name
            return true
        },
        handleAvatarSuccess(res, file){ // res -> response
            // 在 fileList 中追加新上传的数据
            this.fileList.push({ name: res.key, url: `${this.qiniu_url}/${res.key}` })
        },
        handleError(res){
            this.$message.error('上传失败!')
        },
        async getQiniuToken(){
            const response = await getQnToken()
            if (response.code == 1){
                this.postData.token = response.token
            }
        },
        async saveRecord(){
            this.form.org_name = this.fileList.map(item => item.name).join(',')
            this.form.pdf_path = this.fileList.map(item => item.url).join(',')
            const response = await addArticleRecord(this.form)
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
        this.createClassifyList()
        this.getQiniuToken()
    }
}
</script>

<style>
.el-upload__tip {
    line-height: 12px;
}
</style>