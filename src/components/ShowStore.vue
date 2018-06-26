<template>
<div style="width: 70%;">
    <el-form :model="form" ref="form" label-width="100px" size="small">
        <el-form-item label="所在城市：">
            <span class="form-record-show">{{ form.city_text }}</span>
        </el-form-item>
        <el-form-item label="门店名称：">
            <span class="form-record-show">{{ form.name }}</span>
        </el-form-item>
        <el-form-item label="门店地址：">
            <span class="form-record-show">{{ form.address }}</span>
        </el-form-item>
        <el-form-item label="门店电话：">
            <span class="form-record-show">{{ form.phone }}</span>
        </el-form-item>
        <el-form-item label="门店描述：">
            <span class="form-record-show">{{ form.desc }}</span>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import { getStoreRecord } from 'api'

export default {
    name: 'app-show-store',
    props: ['recordId'],
    data (){
        return {
            form: {
                city_text: '',
                name: '',
                address: '',
                phone: '',
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
        this.getFormInfo(async () => getStoreRecord({ id: this.recordId }), 'form')
    }
}
</script>

<style>
.form-record-show {
    display: block;
    min-height: 30px;
    line-height: 30px;
    border: 1px dashed #ddd;
    padding: 0 10px;
    background: #f2f2f2;
}
</style>