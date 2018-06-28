<template>
<div>
    <div style="padding-bottom: 10px;">
        来源门店：<span style="margin-right: 20px;">{{ dataInfo.out_store_name }}</span>
        调入日期：<span style="margin-right: 20px;">{{ dataInfo.date }}</span>
        类别：<span>{{ dataInfo.type }}</span>
    </div>
    <div class="component-main">
        <el-table :data="dataInfo.staffList" stripe border size="mini">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="gender" label="性别"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column prop="job" label="职位"></el-table-column>
            <el-table-column prop="kind" label="岗位"></el-table-column>
            <el-table-column prop="money" label="薪资"></el-table-column>
            <el-table-column prop="work_type" label="工作类型"></el-table-column>
        </el-table>
    </div>
    <div class="staff-in-desc-box">
        <p>说明：{{ dataInfo.desc }}</p>
    </div>
</div>
</template>

<script>
import { getStaffInRecord } from 'api'

export default {
    name: 'app-show-staff-in',
    props: ['recordId'],
    data (){
        return {
            dataInfo: {}
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
        this.getFormInfo(async () => getStaffInRecord({ id: this.recordId }), 'dataInfo')
    }
}
</script>

<style>
.staff-in-desc-box {
    padding-top: 15px;
    line-height: 22px;
    font-size: 12px;
}
</style>