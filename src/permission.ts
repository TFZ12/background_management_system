import router from '@/router'
//@ts-ignore
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from './store'
import useUserStore from './store/modules/user'
import setting from './setting'

nprogress.configure({ showSpinner: false });

const userStore = useUserStore(pinia)

router.beforeEach(async (to: any, _from: any, next: any) => {
  // document.title = `${setting.title}-${to.meta.title}`
  nprogress.start()
  const token = userStore.token
  const username = userStore.username
  if (token) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        next()
      } else {
        try {
          await userStore.userInfo()
          next({...to})
        } catch (error) {
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }

})

router.afterEach((to: any, _from: any) => {
  document.title = `${setting.title}-${to.meta.title}`
  nprogress.done()
})