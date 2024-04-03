<template>
  <el-icon style="margin-right: 10px;" @click="changeIcon">
    <component :is="layOutSettingStore.fold?'Fold':'Expand'"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path"
      class="breadcrumb_item">
      <el-icon style="vertical-align: top;">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span style="margin: 0 5px;">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang='ts' setup>
// import { ref } from 'vue'
import { useRoute } from 'vue-router';
import { useLayOutSettingStore } from '@/store/modules/setting'

const layOutSettingStore = useLayOutSettingStore()

const $route = useRoute()

const changeIcon = () => {
  layOutSettingStore.fold = !layOutSettingStore.fold
}


</script>

<script lang='ts'>
export default {
  name: 'Breadcrumb'
}
</script>

<style scoped lang='scss'>
</style>