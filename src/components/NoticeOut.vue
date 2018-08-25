<template>
<div style="width: 70%;">
    <el-form :model="form" ref="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="上岗日期" prop="work_date">
            <el-date-picker
                v-model="form.work_date"
                type="date"
                disabled
                placeholder="选择上岗日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="类别" prop="type">
            <el-select v-model="form.type" clearable disabled placeholder="请选择类别">
                <el-option
                    v-for="(item, key) in transferInList"
                    :key="key"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="调入门店" prop="from_store">
            <el-select v-model="form.from_store" clearable disabled placeholder="请选择调入门店">
                <el-option
                    v-for="(item, key) in deptList"
                    :key="key"
                    :label="item.name"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="说明">
            <el-input v-model="form.remark" type="textarea" disabled :rows="3" clearable placeholder="请输入说明..."></el-input>
        </el-form-item>
        <el-form-item label="拒绝原因">
            <el-input v-model="form.desc" type="textarea" :rows="3" 
                :disabled="form.status == '2' || form.status == '3'" 
                clearable placeholder="请输入拒绝原因...">
            </el-input>
        </el-form-item>
        <el-form-item v-if=" form.status != '2' && form.status != '3' ">
            <el-button type="primary" @click="submitForm('form', 'agree')" :loading="btnLoading">同意</el-button>
            <el-button type="danger" plain @click="submitForm('form', 'refuse')" :loading="btnLoading">拒绝</el-button>
        </el-form-item>
        <el-form-item v-else>
            <el-tag type="danger" v-if="form.status == '2'">已拒绝</el-tag>
            <el-tag type="success" v-if="form.status == '3'">已同意</el-tag>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getNoticeApplyById, execApplyIn } from 'api'
import { mapState, mapActions } from 'vuex'

export default {
    name: 'app-notice-out',
    props: ['recordId'],
    data (){
        return {
            form: {
                work_date: '',
                type: '',
                from_store: '',
                remark: '',
                desc: '',
                status: ''
            },
            rules: {
                work_date: [
                    { required: true, message: '请选择上岗日期', trigger: 'change' }
                ],
                type: [
                    { required: true, message: '请选择类别', trigger: 'change' }
                ],
                from_store: [
                    { required: true, message: '请选择来源门店', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请输入说明', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState('stateChange', ['btnLoading']),
        ...mapState('dict', ['deptList', 'transferInList'])
    },
    methods: {
        ...mapActions('dict', ['createDeptList', 'createTransferInList']),
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
                status2: status_num,
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
                        this.$confirm(`确认拒绝此次调出吗?`, '提示', {
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
        this.createTransferInList()
        this.getFormInfo(async () => getNoticeApplyById({ id: this.recordId }), 'form')
    }
}
</script>

<style>
</style>