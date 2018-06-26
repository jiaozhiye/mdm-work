<template>
    <div class="chart-box" id="conver-manager"></div>
</template>

<script>
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
Exporting(Highcharts)

export default {
    name: 'app-salary-chart',
    props: ['dataList', 'title', 'subtitle', 'yAxisName'],
    data(){
        return {
            chart: null
        }
    },
    watch: {
        dataList: {
            handler(newVal){
                this.createHighchar()
            },
            deep: true
        }
    },
    methods: {
        createHighchar(){
            this.chart = Highcharts.chart('conver-manager', {
                credits:{
                    enabled: false // 禁用版权信息
                },
                exporting: {   
                    enabled: false  // 设置导出按钮不可用    
                },
                title: {
                    text: this.title
                },
                subtitle: {
                    text: this.subtitle
                },
                xAxis: {
                    categories: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
                },
                yAxis: {
                    title: {
                        text: this.yAxisName
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true // 开启数据标签
                        }
                    }
                },
                series: this.dataList
            })
        }
    },
    mounted(){
        this.createHighchar()
    },
    destroyed(){
        this.chart.destroy()
    }
}
</script>

<style>
</style>