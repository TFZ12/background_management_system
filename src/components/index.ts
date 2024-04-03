import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const allGloablComponebt = { SvgIcon, Pagination, Category }

export default {
  //@ts-ignore
  install(app) {
    Object.keys(allGloablComponebt).forEach(key => {
      //@ts-ignore
      app.component(key, allGloablComponebt[key])
    })
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}