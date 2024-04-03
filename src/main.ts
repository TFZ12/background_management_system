import { createApp } from 'vue'
import App from '@/App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'virtual:svg-icons-register'
import globalComponents from '@/components'
import '@/styles/index.scss'
import router from './router'
import pinia from './store'
import './permission'
import { isHasButton } from './directive/has'

const app = createApp(App)

isHasButton(app)

app.use(ElementPlus, {
  locale: zhCn,
}).use(globalComponents).use(router).use(pinia)

app.mount('#app')
