<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="选择城市" prop="city">
            <el-select v-model="form.city" clearable placeholder="请选择城市">
                <el-option v-for="(item, key) in cityList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="门店名称" prop="name">
            <el-input v-model="form.name" clearable placeholder="请输入门店名称"></el-input>
        </el-form-item>
        <el-form-item label="门店地址" prop="address">
            <el-input v-model="form.address" clearable placeholder="请输入门店地址"></el-input>
        </el-form-item>
        <el-form-item label="门店电话">
            <el-input v-model="form.phone" clearable placeholder="请输入门店电话"></el-input>
        </el-form-item>
        <el-form-item label="门店描述">
            <el-input v-model="form.desc" type="textarea" :rows="4" clearable placeholder="请输入门店描述..."></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { modStoreRecord, getStoreRecord } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-mod-store',
    props: ['recordId'],
    data (){
        return {
            form: {
                city: '',
                name: '',
                address: '',
                phone: '',
                desc: ''
            },
            rules: {
                city: [
                    { required: true, message: '请选择城市', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请输入门店名称', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请输入门店地址', trigger: 'blur' }
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
        async getFormInfo(request, attrName){
            const response = await request()
            if (response.code == 1){
                this[attrName] = response.data || []
            } else {
                this.$message.error(response.message)
            }
        },
        async saveRecord(){
            const response = await modStoreRecord(this.form)
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
        this.getFormInfo(async () => getStoreRecord({ id: this.recordId }), 'form')
        this.createCityList()
    }
}
</script>

<style>
</style>