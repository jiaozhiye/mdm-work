<template>
<div style="width: 70%;">
    <el-form :model="form" ref="form" label-width="100px" size="small">
        <el-form-item label="员工：">
            <span class="form-record-show">{{ form.names }}</span>
        </el-form-item>
        <el-form-item label="日期：">
            <span class="form-record-show">{{ form.date }}</span>
        </el-form-item>
        <el-form-item label="类别：">
            <span class="form-record-show">{{ form.type_text }}</span>
        </el-form-item>
        <el-form-item label="金额：">
            <span class="form-record-show">{{ form.money }}</span>
        </el-form-item>
        <el-form-item label="说明：">
            <span class="form-record-show">{{ form.desc }}</span>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getStaffScoreRecord } from 'api'

export default {
    name: 'app-show-score',
    props: ['recordId'],
    data (){
        return {
            form: {
                names: '',
                date: '',
                type_text: '',
                money: '',
                desc: ''
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
        this.getFormInfo(async () => getStaffScoreRecord({ id: this.recordId }), 'form')
    }
}
</script>

<style>
</style>