<template>
  <div class="box6">
    <div class="title">
      <p>热门排行</p>
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
      text: '排行',
      left: '50%',
      link: 'https://fanyi.baidu.com/?aldtype=16047#en/zh/rank',
      textStyle: {
        color: 'yellowgreen',
        fontSize: 20,
      },
      subtext: '排行',
      subtextStyle: {
        color: 'yellowgreen',
        fontSize: 16,
      }
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {},
    grid: {
      left: 20,
      bottom: 20,
      right: 20
    },
    series: [
      {
        type: 'bar',
        data: [10, 20, 30, 40, 50, 60],
        label: {
          show: true,
          position: 'insideTop',
          color: 'yellowgreen',
        },
        showBackground: true,
        backgroundStyle: {
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
          },
        },
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          color: function (data: any) {
            const arr = ['red', 'orange', 'green', 'red', 'orange', 'green']
            return arr[data.dataIndex]
          }
        }
      },
      {
        type: 'bar',
        data: [10, 20, 30, 40, 50, 60],
        label: {
          show: true,
          position: 'insideTop',
          color: 'yellowgreen',
        },
        showBackground: true,
        backgroundStyle: {
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
          },
        },
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          color: function (data: any) {
            const arr = ['red', 'orange', 'green', 'red', 'orange', 'green']
            return arr[data.dataIndex]
          }
        }
      },
      {
        type: 'line',
        data: [10, 20, 30, 40, 50, 60],
        smooth: true
      }
    ],
    tooltip: {
      backgroundColor: 'rgba(50,50,50,0.7)'
    }
  })
})

</script>


<style scoped lang='scss'>
.box6 {
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