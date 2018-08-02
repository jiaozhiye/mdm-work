<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="标题" prop="name">
            <el-input v-model="form.name" clearable placeholder="请输入海报名称"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="desc">
            <el-input v-model="form.desc" type="textarea" :rows="6" clearable placeholder="请输入海报简介..."></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-set-poster',
    data (){
        return {
            form: {
                name: '',
                desc: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入海报名称', trigger: 'blur' }
                ],
                desc: [
                    { required: true, message: '请输入海报简介', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading']),
        ...mapState('editer', ['poster'])
    },
    methods: {
        ...mapActions('editer', ['createPosterName']),
        saveRecord(){
            this.createPosterName(this.form)
            this.closePanle()
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
        this.form.name = this.poster.name
        this.form.desc = this.poster.desc
    }
}
</script>

<style>
</style>