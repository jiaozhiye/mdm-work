<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="岗位" prop="kind">
            <el-select 
                class="fl" 
                size="small"
                v-model="form.kind" 
                clearable 
                placeholder="选择岗位">
                <el-option
                    v-for="(item, key) in kindsList"
                    :key="key"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
            <el-input v-model="form.name" clearable placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { addQuestionClassify } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-add-question-classify',
    data (){
        return {
            form: {
                kind: '',
                name: ''
            },
            rules: {
                kind: [
                    { required: true, message: '请选择岗位名称', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading']),
        ...mapState('dict', ['kindList']),
        kindsList(){
            return this.kindList.slice(1)
        }
    },
    methods: {
        ...mapActions('dict', ['createKindList']),
        async saveRecord(){
            const response = await addQuestionClassify(this.form)
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
        this.createKindList()
    }
}
</script>

<style>
</style>