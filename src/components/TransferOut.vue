<template>
<div style="width: 70%;">
    <el-form :model="form" ref="form" label-width="100px" size="small">
        <el-form-item label="调出员工">
            <el-input v-model="form.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="调出日期">
            <el-date-picker
                v-model="form.date"
                type="date"
                placeholder="选择调出日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="类别">
            <el-select v-model="form.type" clearable placeholder="请选类别">
                <el-option v-for="(item, key) in transferOutList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="调入门店">
            <el-select v-model="form.to_store" clearable placeholder="请选门店">
                <el-option v-for="(item, key) in deptList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="说明">
            <el-input v-model="form.desc" type="textarea" :rows="3" clearable placeholder="请输入说明..."></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { execTransferOut } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-transfer-out',
    props: ['recordId', 'params'],
    data (){
        return {
            form: {
                name: '',
                date: '',
                type: '',
                to_store: '',
                desc: ''
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading']),
        ...mapState('dict', ['transferOutList', 'deptList'])
    },
    methods: {
        ...mapActions('dict', ['createTransferOutList', 'createDeptList']),
        async saveRecord(status_num){
            const response = await execTransferOut({
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
            this.resetForm()
        }
    },
    created(){
        this.form.name = this.params.map(item => item.name).join(',')
        this.createTransferOutList()
        this.createDeptList()
    }
}
</script>

<style>
</style>