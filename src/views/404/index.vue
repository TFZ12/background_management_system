<template>
  <div class="box">
    <img src="../../assets/images/error_images/404.png" alt="">
    <el-button type="success" @click="goHome">点击我去首页</el-button>
  </div>
</template>

<script lang='ts' setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/home')
}
</script>
<style scoped lang='scss'>
.box {
  width: 100vw;
  height: 100vh;
  background-color: aqua;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>