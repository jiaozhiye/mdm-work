<template>
<div style="width: 70%;">
    <el-form :model="form" ref="form" label-width="100px" size="small">
        <h5 class="form-part-line">员工基本信息</h5>
        <el-form-item label="姓名" prop="name">
            <span class="form-record-show">{{ form.name }}</span>
        </el-form-item>
        <el-form-item label="性别" prop="name">
            <span class="form-record-show">{{ form.gender_text }}</span>
        </el-form-item>
        <el-form-item label="生日" prop="name">
            <span class="form-record-show">{{ form.birthday }}</span>
        </el-form-item>
        <el-form-item label="电话号码" prop="name">
            <span class="form-record-show">{{ form.phone }}</span>
        </el-form-item>
        <el-form-item label="身份证号" prop="name">
            <span class="form-record-show">{{ form.id_num }}</span>
        </el-form-item>
        <el-form-item label="住址" prop="name">
            <span class="form-record-show">{{ form.address }}</span>
        </el-form-item>
        <h5 class="form-part-line">员工入职信息</h5>
        <el-form-item label="工号" prop="name">
            <span class="form-record-show">{{ form.emp_num }}</span>
        </el-form-item>
        <el-form-item label="入职日期" prop="name">
            <span class="form-record-show">{{ form.hiredate }}</span>
        </el-form-item>
        <el-form-item label="所在门店" prop="name">
            <span class="form-record-show">{{ form.dept_text }}</span>
        </el-form-item>
        <el-form-item label="职位" prop="name">
            <span class="form-record-show">{{ form.job_text }}</span>
        </el-form-item>
        <el-form-item label="岗位" prop="name">
            <span class="form-record-show">{{ form.kind_text }}</span>
        </el-form-item>
        <el-form-item label="在职状态" prop="name">
            <span class="form-record-show">{{ form.status_text }}</span>
        </el-form-item>
        <el-form-item label="工作类型" prop="name">
            <span class="form-record-show">{{ form.work_type_text }}</span>
        </el-form-item>
        <el-form-item label="级别" prop="name">
            <span class="form-record-show">{{ form.level_text }}</span>
        </el-form-item>
        <h5 class="form-part-line">员工其他信息</h5>
        <el-form-item label="时薪" prop="name">
            <span class="form-record-show">{{ form.hour_wage }}</span>
        </el-form-item>
        <el-form-item label="月薪" prop="name">
            <span class="form-record-show">{{ form.month_wage }}</span>
        </el-form-item>
        <el-form-item label="开户行" prop="name">
            <span class="form-record-show">{{ form.bank }}</span>
        </el-form-item>
        <el-form-item label="银行卡" prop="name">
            <span class="form-record-show">{{ form.bank_card_num }}</span>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getStaffRecord, getOffJobStaffRecord } from 'api'

export default {
    name: 'app-show-staff',
    props: ['recordId', 'type'],
    data (){
        return {
            form: {
                name: '',
                gender_text: '',
                birthday: '',
                phone: '',
                address: '',
                emp_num: '',
                hiredate: '',
                dept_text: '',
                job_text: '',
                kind_text: '',
                status_text: '',
                id_num: '',
                work_type_text: '',
                level_text: '',
                hour_wage: '',
                month_wage: '',
                bank: '',
                bank_card_num: ''
            }
        }
    },
    methods: {
        async getFormInfo(request, attrName){
            const response = await request()
            if (response.code == 1){
                this[attrName] = response.data || []
            } else {
                this.$message.error(response.message)
            }
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
    }
}
</script>

<style>
</style>