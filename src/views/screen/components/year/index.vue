<template>
  <div class="box7">
    <div class="title">
      <p>年度对比</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="charts">
    </div>
  </div>
</template>

<script lang='ts' setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const charts = ref()

onMounted(() => {
  const mychart = echarts.init(charts.value)
  mychart.setOption({
    title: {
      text: '散点图',
      left: '40%',
      textStyle: {
        color: 'white'
      }
    },
    xAxis: {
      type: 'category',
      show: true
    },
    yAxis: {
      show: false
    },
    grid: {
      left: 20,
      right: 0,
      top: 20,
      bottom: 20,
    },
    series: {
      type: 'scatter',
      data: [12, 334, 566, 32, 5667, 12, 95, 15, 4532, 2423, 33, 55, 2223, 678],
      symbol: 'diamond',
      symbolSize: 14,
      label: {
        show: true,
        position: 'top',
        color: 'yellow'
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'red' // 0% 处的颜色
          }, {
            offset: 1, color: 'blue' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    }
  })
})

</script>


<style scoped lang='scss'>
.box7 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;

  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 30px);
  }

}
</style>