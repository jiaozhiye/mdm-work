<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="区域名称" prop="name">
            <el-input v-model="form.name" clearable placeholder="请输入区域名称"></el-input>
        </el-form-item>
        <el-form-item label="岗位">
            <el-checkbox-group v-model="form.kind">
                <el-checkbox v-for="(item, key) in kindListNoAll" :key="key" :label="item.value">
                    {{ item.name }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { modAreaInfo, getAreaRecord } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-mod-area',
    props: ['recordId'],
    data (){
        return {
            form: {
                name: '',
                kind: []
            },
            rules: {
                name: [
                    { required: true, message: '请输入区域名称', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState('dict', ['kindList']),
        ...mapState('stateChange', ['btnLoading']),
        kindListNoAll(){
            return this.kindList.slice(1)
        }
    },
    methods: {
        ...mapActions('dict', ['createKindList']),
        async getFormInfo(request, attrName){
            const response = await request()
            if (response.code == 1){
                this[attrName] = response.data || []
            } else {
                this.$message.error(response.message)
            }
        },
        async saveRecord(){
            const response = await modAreaInfo({
                id: this.recordId,
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
        this.getFormInfo(async () => getAreaRecord({ id: this.recordId }), 'form')
        this.createKindList()
    }
}
</script>

<style>
</style>