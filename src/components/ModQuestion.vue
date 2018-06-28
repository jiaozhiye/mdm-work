<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" clearable placeholder="请输入考题名称"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
            <el-input v-model="form.content" type="textarea" :rows="6" clearable placeholder="请输入考题内容..."></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getQuestionRecord, modQuestionRecord } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-mod-question',
    props: ['recordId'],
    data (){
        return {
            form: {
                title: '',
                content: ''
            },
            rules: {
                title: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入考题内容', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading'])
    },
    methods: {
        async getFormInfo(request, attrName){
            const response = await request()
            if (response.code == 1){
                this[attrName] = response.data || []
            } else {
                this.$message.error(response.message)
            }
        },
        async saveRecord(){
            const response = await modQuestionRecord(this.form)
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
        this.getFormInfo(async () => getQuestionRecord({ id: this.recordId }), 'form')
    }
}
</script>

<style>
</style>