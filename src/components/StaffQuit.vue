<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="姓名">
            <el-input v-model="form.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="date">
            <el-date-picker
                v-model="form.date"
                type="date"
                placeholder="选择生日"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="操作人">
            <el-input v-model="form.user" disabled></el-input>
        </el-form-item>
        <el-form-item label="原因" prop="desc">
            <el-input v-model="form.desc" type="textarea" :rows="4" clearable placeholder="请输入离职原因..."></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { fireStaff } from 'api'
import { mapState, mapActions } from 'vuex'
import { getToken } from 'assets/js/auth'
import moment from 'moment'

export default {
    name: 'app-staff-quit',
    props: ['recordId', 'params'],
    data (){
        return {
            form: {
                name: '',
                date: moment().format('YYYY-MM-DD'),
                user: '',
                desc: ''
            },
            rules: {
                date: [
                    { required: true, message: '请选择离职日期', trigger: 'blur' }
                ],
                desc: [
                    { required: true, message: '请填写离职原因', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading']),
        ...mapState('app', ['loginInfo'])
    },
    methods: {
        async saveRecord(){
            const response = await fireStaff({
                staff_id: this.recordId,
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
        this.form.name = this.params.map(item => item.name).join(',')
        this.form.user = this.loginInfo.name || getToken()
    }
}
</script>

<style>
</style>