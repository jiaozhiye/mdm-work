<template>
<div style="width: 70%;">
    <el-form :model="form" ref="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="date">
            <el-date-picker
                v-model="form.date"
                type="date"
                disabled
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="所属门店" prop="from_store">
            <el-select v-model="form.from_store" disabled placeholder="请选择所属门店">
                <el-option
                    v-for="(item, key) in deptList"
                    :key="key"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="操作人" prop="user">
            <el-input v-model="form.user" disabled></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="remark">
            <el-input v-model="form.remark" type="textarea" :rows="3" disabled clearable></el-input>
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
import { getNoticeFireById, execApplyIn } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-notice-quit',
    props: ['recordId'],
    data (){
        return {
            form: {
                name: '',
                date: '',
                from_store: '',
                user: '',
                remark: '',
                desc: ''
            },
            rules: {
                name: [
                    { required: true, message: '', trigger: 'blur' }
                ],
                date: [
                    { required: true, message: '请选择日期', trigger: 'change' }
                ],
                from_store: [
                    { required: true, message: '请选择所属门店', trigger: 'change' }
                ],
                user: [
                    { required: true, message: '', trigger: 'blur' }
                ],
                remark: [
                    { required: true, message: '请输入说明', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading']),
        ...mapState('dict', ['deptList'])
    },
    methods: {
        ...mapActions('dict', ['createDeptList']),
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
                status: status_num,
                ...this.form
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
                        this.$confirm(`确认拒绝此次辞退吗?`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(async () => {
                            if (!this.form.desc){
                                return this.$message.warning('拒绝原因不能为空！')
                            }
                            this.saveRecord('0')
                        }).catch(() => {})
                    } else {
                        this.saveRecord('1')
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
        this.createDeptList()
        this.getFormInfo(async () => getNoticeFireById({ id: this.recordId }), 'form')
    }
}
</script>

<style>
</style>