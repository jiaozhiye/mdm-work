<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="所属分类" prop="class_id">
            <el-select v-model="form.class_id" clearable placeholder="选择分类">
                <el-option v-for="(item, key) in cityList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="文章标题" prop="title">
            <el-input v-model="form.title" clearable placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="内容">
            <el-input v-model="form.content" type="textarea" :rows="4" clearable></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { addArticleRecord } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-add-article',
    data (){
        return {
            form: {
                class_id: '',
                title: '',
                desc: ''
            },
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
        ...mapState('dict', ['cityList'])
    },
    methods: {
        ...mapActions('dict', ['createCityList']),
        async saveRecord(){
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
        this.createCityList()
    }
}
</script>

<style>
</style>