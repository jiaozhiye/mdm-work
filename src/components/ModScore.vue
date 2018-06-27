<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="员工">
            <el-input v-model="form.names" disabled></el-input>
        </el-form-item>
        <el-form-item label="日期">
            <el-date-picker
                v-model="form.date"
                type="date"
                disabled
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="类别" prop="type">
            <el-select v-model="form.type" clearable placeholder="请选类别">
                <el-option v-for="(item, key) in scoreTypeList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="money">
            <el-input type="number" v-model="form.money" placeholder="保留两位小数"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="desc">
            <el-input v-model="form.desc" type="textarea" :rows="4" clearable placeholder="请输说明..."></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { modStaffScoreRecord, getStaffScoreRecord } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-mod-score',
    props: ['recordId'],
    data (){
        return {
            form: {
                id: '',
                names: '',
                date: '',
                type: '',
                money: '',
                desc: ''
            },
            rules: {
                type: [
                    { required: true, message: '请选择类别', trigger: 'change' }
                ],
                money: [
                    { required: true, message: '请输入金额', trigger: 'blur' }
                ],
                desc: [
                    { required: true, message: '请输入说明', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading']),
        ...mapState('dict', ['scoreTypeList'])
    },
    methods: {
        ...mapActions('dict', ['createScoreTypeList']),
        async getFormInfo(request, attrName){
            const response = await request()
            if (response.code == 1){
                this[attrName] = response.data || []
            } else {
                this.$message.error(response.message)
            }
        },
        async saveRecord(){
            const response = await modStaffScoreRecord(this.form)
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
        this.getFormInfo(async () => getStaffScoreRecord({ id: this.recordId }), 'form')
        this.createScoreTypeList()
    }
}
</script>

<style>
</style>