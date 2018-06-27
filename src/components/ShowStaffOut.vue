<template>
<div style="width: 70%;">
    <el-form :model="form" ref="form" label-width="100px" size="small">
        <el-form-item label="调出员工：">
            <span class="form-record-show">{{ form.name }}</span>
        </el-form-item>
        <el-form-item label="调出日期：">
            <span class="form-record-show">{{ form.date }}</span>
        </el-form-item>
        <el-form-item label="类别：">
            <span class="form-record-show">{{ form.type_text }}</span>
        </el-form-item>
        <el-form-item label="调入门店：">
            <span class="form-record-show">{{ form.to_store_name }}</span>
        </el-form-item>
        <el-form-item label="状态：">
            <span class="form-record-show">{{ form.status_text }}</span>
        </el-form-item>
        <el-form-item label="说明：">
            <el-input v-model="form.desc" type="textarea" :rows="4" clearable placeholder="请输入说明..."></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">撤销</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getStaffOutRecord, cancleStaffOut } from 'api'
import { mapState } from 'vuex'

export default {
    name: 'app-show-staff-out',
    props: ['recordId'],
    data (){
        return {
            form: {
                name: '',
                date: '',
                type_text: '',
                to_store_name: '',
                status_text: '',
                desc: ''
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading'])
    },
    methods: {
        async getFormInfo(request, attrName){
            const response = await request()
            if (response.code == 1){
                this[attrName] = response.data || []
            } else {
                this.$message.error(response.message)
            }
        },
        async saveRecord(){
            const response = await cancleStaffOut({ id: this.recordId })
            if (response.code == 1){
                this.closePanle()
            } else {
                this.$message.error(response.message)
            }
        },
        submitForm(){
            this.$confirm(`确认撤销调出员工吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                this.saveRecord()
            }).catch(() => {})
        },
        closePanle(){
            this.$emit('reloadEvent', 'reload')
        }
    },
    created(){
        this.getFormInfo(async () => getStaffOutRecord({ id: this.recordId }), 'form')
    }
}
</script>

<style>
</style>