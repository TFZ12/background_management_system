import { defineStore } from "pinia"

export const useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false,
      refsh: false
    }
  },
  persist: true,
})

// export default useLayOutSettingStore