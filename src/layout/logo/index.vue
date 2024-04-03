<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="">
    <p>{{ setting.title }}</p>
  </div>
</template>

<script lang='ts' setup>
import setting from '@/setting'
</script>

<script lang='ts'>
export default {
  name: 'Logo'
}
</script>

<style scoped lang='scss'>
.logo {
  width: 100%;
  height: $base_menu_logo_height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  word-break: keep-all;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  p {
    font-size: $base_logo_title_fontSize;
    margin-left: 5px;
    transition: all .3s;
    // white-space: nowrap;

    &.active {
      display: none;
    }
  }
}
</style>