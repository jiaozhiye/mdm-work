<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="分类名称" prop="name">
            <el-input v-model="form.name" clearable placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="上级分类">
            <el-select v-model="form.parent_id" clearable placeholder="上级分类">
                <el-option v-for="(item, key) in classifyList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="排序">
            <el-input type="number" v-model="form.sort" placeholder="输入数字"></el-input>
        </el-form-item>
        <el-form-item label="分类描述">
            <el-input v-model="form.desc" type="textarea" :rows="4" clearable placeholder="请输入分类描述..."></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { modTrainClass, getTrainClass } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-mod-class',
    props: ['recordId'],
    data (){
        return {
            form: {
                name: '',
                parent_id: '',
                sort: '',
                desc: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
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
        async getFormInfo(request, attrName){
            const response = await request()
            if (response.code == 1){
                this[attrName] = response.data || []
            } else {
                this.$message.error(response.message)
            }
        },
        async saveRecord(){
            const response = await modTrainClass(this.form)
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
        this.getFormInfo(async () => getTrainClass({ id: this.recordId }), 'form')
        this.createClassifyList()
    }
}
</script>

<style>
</style>