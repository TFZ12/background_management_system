import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/apis/user'
import type { UserState } from './types/type'
import type { loginFormData, loginResponseData, userInfoResponseData } from '@/apis/user/type'
import { constantRoute, asnycRoute, anyRoute } from '@/router/routes'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import router from '@/router'
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'

const filterAsyncRoute = (asnycRoute: any, routes: any) => {
  return asnycRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        //硅谷333账号:product\trademark\attr\sku
        item.children = filterAsyncRoute(item.children, routes);
      }
      return true;
    }
  })
}

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
      buttons: []
    }
  },
  actions: {
    async userLogin(data: loginFormData) {
      const res: loginResponseData = await reqLogin(data)
      if (res.code === 200) {
        this.token = (res.data as string)
        SET_TOKEN(res.data as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(res.data))
      }
    },

    async userInfo() {
      const res: userInfoResponseData = await reqUserInfo()
      if (res.code === 200) {
        this.username = res.data.name
        this.avatar = res.data.avatar
        this.buttons = res.data.buttons
        const userAsyncRoute = filterAsyncRoute(cloneDeep(asnycRoute), res.data.routes)
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute]
        const allRouter: any = [...userAsyncRoute, ...anyRoute]
        allRouter.forEach((route: any) => {
          router.addRoute(route)
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },

    async userLogout() {
      const res: any = await reqLogout()
      if (res.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }

    }
  },
  getters: {

  }
})

export default useUserStore