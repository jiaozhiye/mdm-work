<template>
<div style="width: 70%;">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <h5 class="form-part-line">员工基本信息</h5>
        <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" clearable placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
                <el-radio label="1">男</el-radio>
                <el-radio label="0">女</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
            <el-date-picker
                v-model="form.birthday"
                type="date"
                placeholder="选择生日"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
            <el-input v-model="form.phone" clearable placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="id_num">
            <el-input v-model="form.id_num" clearable placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item label="住址">
            <el-input v-model="form.address" type="textarea" :rows="2" clearable placeholder="请输入住址"></el-input>
        </el-form-item>
        <h5 class="form-part-line">员工入职信息</h5>
        <el-form-item label="工号">
            <el-input v-model="form.emp_num" clearable placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="入职日期" prop="hiredate">
            <el-date-picker
                v-model="form.hiredate"
                type="date"
                placeholder="选择入职时间"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="所在门店" prop="dept_id">
            <el-select v-model="form.dept_id" clearable placeholder="请选门店">
                <el-option v-for="(item, key) in deptList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="job">
            <el-select v-model="form.job" clearable placeholder="请选职位">
                <el-option v-for="(item, key) in jobList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="岗位">
            <el-checkbox-group v-model="form.kind">
                <el-checkbox v-for="(item, key) in kindListNoAll" :key="key" :label="item.value">
                    {{ item.name }}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="在职状态" prop="status">
            <el-select v-model="form.status" clearable placeholder="请选在职状态">
                <el-option v-for="(item, key) in jobStatusList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item label="工作类型" prop="work_type">
            <el-select v-model="form.work_type" clearable placeholder="请选工作类型">
                <el-option v-for="(item, key) in workTypeList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="级别">
            <el-select v-model="form.level" clearable placeholder="请选级别">
                <el-option v-for="(item, key) in jobLevelList" :key="key" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <h5 class="form-part-line">员工其他信息</h5>
        <el-form-item label="时薪">
            <el-input type="number" v-model="form.hour_wage" placeholder="保留两位小数"></el-input>
        </el-form-item>
        <el-form-item label="月薪">
            <el-input type="number" v-model="form.month_wage" placeholder="保留两位小数"></el-input>
        </el-form-item>
        <el-form-item label="开户行">
            <el-input v-model="form.bank" clearable placeholder="请输入开户行"></el-input>
        </el-form-item>
        <el-form-item label="银行卡">
            <el-input v-model="form.bank_card_num" clearable placeholder="请输入银行卡号"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { modStaffInfo, getStaffRecord, getOffJobStaffRecord } from 'api'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
    name: 'app-mod-staff',
    props: ['recordId', 'type'],
    data (){
        const checkPhone = (rule, value, callback) => {
            const regExp = /^1\d{10}$/
            if (!regExp.test(value)){
                callback(new Error('手机号格式不正确'))
            }
        }
        const checkIdnum = (rule, value, callback) => {
            const regExp = /^\d{17}[0-9a-zA-Z]$/
            if (!regExp.test(value)){
                callback(new Error('身份证号格式不正确'))
            }
        }
        return {
            form: {
                name: '',
                gender: '1',
                birthday: '1990-01-01',
                phone: '',
                address: '',
                emp_num: '',
                hiredate: moment().format('YYYY-MM-DD'),
                dept_id: '',
                job: '',
                kind: [],
                status: '',
                id_num: '',
                work_type: '',
                level: '',
                hour_wage: '',
                month_wage: '',
                bank: '',
                bank_card_num: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '请选择性别', trigger: 'change' }
                ],
                birthday: [
                    { required: true, message: '请输入生日', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkPhone, trigger: 'blur' }
                ],
                id_num: [
                    { validator: checkIdnum, trigger: 'blur' }
                ],
                hiredate: [
                    { required: true, message: '请输入入职日期', trigger: 'blur' }
                ],
                dept_id: [
                    { required: true, message: '请选择门店', trigger: 'change' }
                ],
                job: [
                    { required: true, message: '请选择职位', trigger: 'change' }
                ],
                status: [
                    { required: true, message: '请选择在职状态', trigger: 'change' }
                ],
                work_type: [
                    { required: true, message: '请选择工作类型', trigger: 'change' }
                ]
            }
        }
    },
    computed: {
        ...mapState('dict', ['deptList', 'jobList', 'kindList', 'workTypeList', 'jobStatusList', 'jobLevelList']),
        ...mapState('stateChange', ['btnLoading']),
        kindListNoAll(){
            return this.kindList.slice(1)
        }
    },
    methods: {
        ...mapActions('dict', ['createDeptList', 'createJobList', 'createKindList', 'createJobStatusList', 'createWorkTypeList', 'createJobLevelList']),
        async getFormInfo(request, attrName){
            const response = await request()
            if (response.code == 1){
                this[attrName] = response.data || []
            } else {
                this.$message.error(response.message)
            }
        },
        async saveRecord(){
            const response = await modStaffInfo(this.form)
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
        this.getFormInfo(async () => {
            if (this.type == 'onjob'){
                return getStaffRecord({ id: this.recordId })
            } else {
                return getOffJobStaffRecord({ id: this.recordId })
            }
        }, 'form')
        this.createDeptList()
        this.createJobList()
        this.createKindList()
        this.createWorkTypeList()
        this.createJobStatusList()
        this.createJobLevelList()
    }
}
</script>

<style>
</style>