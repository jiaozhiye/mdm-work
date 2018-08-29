<template>
    <div class="welcome-text">欢迎使用HRMS管理系统</div>
</template>

<script>
import { testApi } from 'api'
export default {
    name: 'app-home',
    data (){
        return {}
    }
}
</script>

<style>
.welcome-text {
    text-align: center;
    font-size: 26px;
    padding: 30vh 0;
}
</style>