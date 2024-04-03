<template>
  <div class="box5">
    <div class="title">
      <p>未来七天的趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="line">
      fgfgfg
    </div>
  </div>
</template>

<script lang='ts' setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const line = ref()

onMounted(() => {
  const mycharts = echarts.init(line.value)
  mycharts.setOption({
    title: {
      text: '访问量'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      splitLine: {
        show: false
      },
      data: ['一', '二', '三', '四', '五', '六', '七'],
      axisLine: {
        show: true
      },
      axisTick: {
        show: true
      }
    },
    yAxis: {
      splitLine: {
        show: false
      },
      axisLine: {
        show: true
      },
      axisTick: {
        show: true
      }
    },
    grid: {
      left: 40,
      top: 0,
      right: 20,
      bottom: 20
    },
    series: [
      {
        type: 'line',
        data: [120, 1240, 89, 2213, 567, 1000, 145],
        smooth: true,
        areaStyle: {
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
    ]
  })
})
</script>
<style scoped lang='scss'>
.box5 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 20px;

  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }

  }

  .charts {
    height: calc(100% - 40px);
  }
}
</style>