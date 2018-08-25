<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="岗位" prop="kind_id">
            <el-select 
                class="fl" 
                size="small"
                v-model="form.kind_id" 
                clearable 
                placeholder="选择岗位"
                @change="changeHandle">
                <el-option
                    v-for="(item, key) in kindsList"
                    :key="key"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="type_id">
            <el-select 
                class="fl" 
                size="small"
                v-model="form.type_id" 
                placeholder="选择分类">
                <el-option
                    v-for="(item, key) in classifyList"
                    :key="key"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
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
import { getQuestionRecord, modQuestionRecord, getQuestionClaSelect } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-mod-question',
    props: ['recordId'],
    data (){
        return {
            form: {
                kind_id: '',
                type_id: '',
                title: '',
                content: ''
            },
            classifyList: [],
            rules: {
                kind_id: [
                    { required: true, message: '请选择岗位名称', trigger: 'blur' }
                ],
                type_id: [
                    { required: true, message: '请选择分类名称', trigger: 'blur' }
                ],
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
        ...mapState('stateChange', ['btnLoading']),
        ...mapState('dict', ['kindList']),
        kindsList(){
            return this.kindList.slice(1)
        }
    },
    methods: {
        ...mapActions('dict', ['createKindList']),
        changeHandle(){
            this.getClassify()
            this.form.type_id = ''
        },
        async getClassify(){
            const response = await getQuestionClaSelect({ dict: this.form.kind_id })
            if (response.code == 1){
                this.classifyList = response.data
            } else {
                this.$message.error(response.message)
            }
        },
        async getFormInfo(request, attrName, callback){
            const response = await request()
            if (response.code == 1){
                this[attrName] = response.data || []
                // 执行回调
                callback && callback()
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
        this.getFormInfo(async () => getQuestionRecord({ id: this.recordId }), 'form', () => this.getClassify())
        this.createKindList()
    }
}
</script>

<style>
</style>