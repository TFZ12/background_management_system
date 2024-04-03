<template>
  <div class="layout_container">
    <div class="layout_slider" :class="{ fold: layOutSettingStore.fold }">
      <Logo></Logo>
      <el-scrollbar class="scrollbar">
        <el-menu :collapse="layOutSettingStore.fold" :default-active="$route.path" background-color="#001529"
          text-color="white">
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="layout_tabbar" :class="{ fold: layOutSettingStore.fold }">
      <Tabbar></Tabbar>
    </div>
    <div class="layout_main" :class="{ fold: layOutSettingStore.fold }">
      <Main></Main>
    </div>
  </div>
</template>

<script lang='ts' setup>
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Tabbar from './tabbar/index.vue'
import Main from './main/index.vue'
import useUserStore from '@/store/modules/user'
import { useLayOutSettingStore } from '@/store/modules/setting'
import { useRoute } from 'vue-router'

const userStore = useUserStore()

const $route = useRoute()

const layOutSettingStore = useLayOutSettingStore()


</script>

<script lang='ts'>
export default {
  name: 'Layout'
}
</script>

<style scoped lang='scss'>
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base_menu_width;
    height: 100vh;
    background-color: $base_menu_background;
    transition: all .2s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base_menu_logo_height);
      color: white;

      .el-menu {
        border-right: none;
      }
    }

    &.fold {
      width: $base_menu_min_width;
    }
  }

  .layout_tabbar {
    width: calc(100% - $base_menu_width);
    height: $base_tabbar_height;
    position: fixed;
    top: 0;
    left: $base_menu_width;
    transition: all .2s;

    &.fold {
      width: calc(100vw - $base_menu_min_width);
      left: $base_menu_min_width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base_menu_width);
    height: calc(100vh - $base_tabbar_height);
    left: $base_menu_width;
    top: $base_tabbar_height;
    padding: 20px;
    overflow: auto;
    transition: all .2s;

    &.fold {
      width: calc(100vw - $base_menu_min_width);
      left: $base_menu_min_width;
    }
  }
}
</style>