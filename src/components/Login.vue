<template>
<el-row class="login-wrapper">
    <el-col :span="6" :offset="9">
        <h3 class="welcome">欢迎使用</h3>
        <el-form class="app-form" ref="form" label-position="top" :model="form" :rules="rules">
            <el-form-item label="请输入用户名" prop="username">
                <el-input v-model="form.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="请输入密码" prop="password">
                <el-input type="password" v-model="form.password" placeholder="密码" @keyup.enter.native="doLogin"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width: 100%" @click.stop="doLogin" :loading="btnLoading">登 录</el-button>
            </el-form-item>
        </el-form>
    </el-col>
</el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { doLogin } from 'api'

export default {
    name: 'app-login',
    data (){
        return {
            form: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名.', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码.', trigger: 'blur' },
                    { min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading'])
    },
    methods: {
        ...mapActions('app', ['createLoginInfo']),
        async doLogin(){
            if (this.form.username == '' || this.form.password == ''){
                return this.$message.warning('请正确填写用户名和密码！')
            }
            const response = await doLogin({
                username: this.form.username,
                password: this.form.password
            })
            // console.log(response)
            if (response.code == 1){
                this.createLoginInfo({
                    id: response.data.id,
                    name: response.data.name,
                    roles: response.data.roles || []
                })
                this.$router.push({ path: '/' })
            } else {
                this.$message.error(response.message)
            }
        }
    }
}
</script>

<style>
.login-wrapper {
    height: 100vh;
    background: #f2f2f2;
}
.login-wrapper .welcome {
    text-align: center;
    padding: 60px 0 30px;
    font-size: 30px;
    font-weight: normal;
    line-height: 40px;
}
.login-wrapper .app-form {
    padding: 10px 20px 0;
    background-color: #fff;
    border: 1px solid #d8dee2;
    border-radius: 5px;
}
</style>