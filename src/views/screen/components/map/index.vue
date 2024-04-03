<template>
  <div class="box4" ref="map">

  </div>
</template>

<script lang='ts' setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import chinaJson from './china.json'

const map = ref()

echarts.registerMap('china', chinaJson as any)

onMounted(() => {
  const mychart = echarts.init(map.value)
  mychart.setOption({
    geo: {
      map: 'china',
      roam: true,
      left: 50,
      top: 100,
      right: 50,
      bottom: 0,
      label: {
        show: true,
        color: 'white',
        fontSize: 14
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
        },
        opacity: .8
      },
      emphasis: {
        itemStyle: {
          color: 'red'
        },
        label: {
          fontSize: 40
        }
      }
    },
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    series: [
      {
        type: 'lines',
        data: [
          {
            coords: [
              [116.405285, 39.904989],  // 起点
              [121.472644, 31.231706]   // 终点      
            ],
            // 统一的样式设置
            lineStyle: {
              color: 'orange',
              width: 5
            },
          },
          {
            coords: [
              [116.405285, 39.904989],  // 起点
              [112.549248, 37.857014]   // 终点      
            ],
            // 统一的样式设置
            lineStyle: {
              color: 'yellow',
              width: 5
            },
          }
        ],
        effect: {
          show: true,
          symbol: 'arrow',
          color: 'white',
          symbolSize: 10
        }
      }
    ]
  })
})


</script>
<style scoped lang='scss'></style>