<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="当前密码" prop="currentPwd">
            <el-input v-model="form.currentPwd" clearable placeholder="当前密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
            <el-input v-model="form.password" clearable placeholder="新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
            <el-input v-model="form.confirmPwd" clearable placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { updateUserInfo } from 'api'
import { mapState } from 'vuex'

export default {
    name: 'app-mod-personal',
    data (){
        const validatePass = (rule, value, callback) => {
            if (value === ''){
                callback(new Error('请再次输入密码'))
            } else if (value !== this.form.password){
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            form: {
                currentPwd: '',
                password: '',
                confirmPwd: ''
            },
            rules: {
                currentPwd: [
                    { required: true, message: '请输入当前密码', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入新密码', trigger: 'blur' }
                ],
                confirmPwd: [
                    { validator: validatePass, trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading'])
    },
    methods: {
        async saveRecord(){
            const response = await updateUserInfo(this.form)
            if (response.code == 1){
                this.$message.success(response.message)
                setTimeout(() => this.closePanle(), 500)
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
    }
}
</script>

<style>
</style>