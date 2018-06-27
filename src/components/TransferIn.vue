<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="上岗日期">
            <el-input v-model="form.work_date" disabled clearable placeholder="请输入上岗日期"></el-input>
        </el-form-item>
        <el-form-item label="类别">
            <el-input v-model="form.type_text" disabled clearable placeholder="请输入类别"></el-input>
        </el-form-item>
        <el-form-item label="调入门店">
            <el-input v-model="form.from_store_name" disabled clearable placeholder="请输入调入门店"></el-input>
        </el-form-item>
        <el-form-item label="说明">
            <el-input v-model="form.explain" type="textarea" disabled :rows="3" clearable placeholder="请输入说明..."></el-input>
        </el-form-item>
        <el-form-item label="拒绝原因">
            <el-input v-model="form.desc" type="textarea" :rows="3" clearable placeholder="请输入拒绝原因..."></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('form', 'agree')" :loading="btnLoading">同意</el-button>
            <el-button type="danger" plain @click="submitForm('form', 'refuse')" :loading="btnLoading">拒绝</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getNoticeRecord, execApplyInfo } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-transfer-in',
    props: ['recordId'],
    data (){
        return {
            form: {
                work_date: '',
                type_text: '',
                from_store_name: '',
                explain: '',
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
        async saveRecord(status_num){
            const response = await execApplyIn({
                id: this.recordId,
                status: status_num,
                desc: this.form.desc
            })
            if (response.code == 1){
                this.closePanle()
            } else {
                this.$message.error(response.message)
            }
        },
        submitForm(formName, _type){
            this.$refs[formName].validate(valid => {
                if (valid){
                    if (_type === 'refuse'){
                        this.$confirm(`确认拒绝此次调入吗?`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(async () => {
                            if (this.form.desc === ''){
                                return this.$message.warning('拒绝原因不能为空！')
                            }
                            this.saveRecord()
                        }).catch(() => {})
                    } else {
                        this.saveRecord()
                    }
                } else {
                    console.log('error submit!')
                }
            })
        },
        closePanle(){
            this.$emit('reloadEvent', 'reload')
        }
    },
    created(){
        this.getFormInfo(async () => getNoticeRecord({ id: this.recordId }), 'form')
    }
}
</script>

<style>
</style>