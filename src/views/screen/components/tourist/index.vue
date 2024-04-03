<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">可预约总量<span>&nbsp;99999&nbsp;</span>人</p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="charts">
    </div>
  </div>
</template>

<script lang='ts' setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'

const people = ref<string>('213478人')

const charts = ref()

onMounted(() => {
  const mycharts = echarts.init(charts.value)
  mycharts.setOption({
    title: {
      text: '水球图'
    },
    xAxis: {},
    yAxis: {},
    series: {
      type: 'liquidFill',
      waveAnimation: true,
      animationDuration: 3,
      animationDurationUpdate: 0,
      data: [0.7, 0.5, 0.4, 0.3],
      radius: '90%',
      outline: {
        show: true,
        borderDistance: 8,
        itemStyle: {
          color: 'none',
          borderColor: '#294D99',
          borderWidth: 8,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.25)'
        }
      },
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    }
  })
})

</script>
<style scoped lang='scss'>
.box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top {
    margin-left: 20px;

    .title {
      color: white;
      font-size: 20px;
      margin-top: 20px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }

    .right {
      float: right;
      color: white;
      font-size: 16px;
      margin-right: 10px;

      span {
        color: rgb(229, 181, 36);
      }
    }
  }

  .number {
    margin-top: 30px;
    display: flex;
    padding: 10px;

    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
    }
  }

  .charts {
    width: 100%;
    height: 250px;
  }
}
</style>
