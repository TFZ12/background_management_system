<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script lang='ts' setup>
import { nextTick, ref, watch } from 'vue';
import { useLayOutSettingStore } from '@/store/modules/setting'

const layOutSettingStore = useLayOutSettingStore()

const flag = ref(true)

watch(() => layOutSettingStore.refsh, () => {
  flag.value = false
  nextTick(() => {
    flag.value = true
  })
})

</script>

<script lang='ts'>
export default {
  name: 'Main'
}
</script>

<style scoped lang='scss'>
.fade-enter-from {
  opacity: 0;
  // transform: scale(0);
}

.fade-enter-active {
  transition: all .6s;
}

.fade-enter-to {
  opacity: 1;
  // transform: scale(1);
}
</style>