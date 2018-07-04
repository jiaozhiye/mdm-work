<template>
    <div class="chart-box" id="conver-manager"></div>
</template>

<script>
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
Exporting(Highcharts)

export default {
    name: 'app-salary-chart',
    props: ['dataList', 'title', 'subtitle', 'xAxisList', 'yAxisName'],
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
                chart: {
                    type: 'column'
                },
                title: {
                    text: this.title
                },
                subtitle: {
                    text: this.subtitle
                },
                xAxis: {
                    categories: this.xAxisList
                },
                yAxis: [
                    { title: {text: '日工资(元)'} },
                    { title: {text: '工时(小时)'}, opposite: true }
                ],
                legend: {
                    shadow: false
                },
                tooltip: {
                    shared: true
                },
                plotOptions: {
                    column: {
						grouping: false,
						shadow: false,
						borderWidth: 0
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