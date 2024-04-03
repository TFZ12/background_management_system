<template>
  <div>
    <el-card>
      <div class="box">
        <img :src="useStore.avatar" alt="" class="avatar">
        <div class="bottom">
          <h3 class="title">{{ getTime() }}好 {{ useStore.username }}</h3>
          <p class="subtitle">逸轩管理运营平台</p>
        </div>
      </div>
    </el-card>
    <div class="bottoms">
      <svg-icon name="welcome" width="500px" height="500px"></svg-icon>
    </div>
  </div>
</template>

<script lang='ts' setup>
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'

const useStore = useUserStore()


</script>

<style scoped lang='scss'>
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;
    margin-top: 15px;

    .title {
      font-size: 30px;
      font-weight: 700;
      margin-bottom: 30px;
    }

    .subtitle {
      font-style: italic;
      color: rgba(222, 220, 218);
    }
  }
}

.bottoms {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>