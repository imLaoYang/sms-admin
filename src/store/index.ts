import Vue from 'vue'
import Vuex from 'vuex'
import { RouteConfig } from 'vue-router'
import { mainMenu } from '@/router/menu'
import router from '@/router'
import Cookies from 'js-cookie'
import { formatMenus, getRouters, layzLoading } from '@/router/layzLoading'
import { menuList } from '@/api/menuList'
import $api from '@/api'
Vue.use(Vuex)

interface RootState {
  loading: boolean;
  windowSize: { width: number; height: number } | null;
  token: string | undefined;
  isCollapse: boolean;
  menuList: any[];
  mainMenu: Array<RouteConfig>;
  initRoute: null | any;
  systemInfo: {
    systemId: string;
    sysName: string;
    layzLoading: Function;
  } | null;
  VersionSwitch?: any;
  route?: any;
  // userInfo: any;
  userInfo: {} | any;
  toggleLogout: boolean;
}

export default new Vuex.Store<RootState>({
  state: {
    loading: false,
    windowSize: null,
    token: '',
    isCollapse: false,
    menuList: [],
    // 路由
    mainMenu: mainMenu,
    initRoute: sessionStorage.initRoute ? JSON.parse(sessionStorage.initRoute) : null,
    systemInfo: null,
    userInfo: {
      avatar: '/img/icons/avatar.jpg',
      userName: '',
      isLogin: false
    },
    toggleLogout: false
  },
  mutations: {
    updateMainMenu(state, mainMenu) {
      state.mainMenu = mainMenu
    },
    updateMenuList(state, menuList) {
      state.menuList = menuList
    },
    updateLoading(state, loading) {
      state.loading = loading
    },
    // 更新token
    updateToken(state, token) {
      state.token = token
      if (!token) {
        localStorage.removeItem("token")
      }
    },
    updateIsCollapse(state, isCollapse) {
      state.isCollapse = isCollapse
    },
    updateSize(state, size) {
      if (size && size.width) {
        state.isCollapse = size.width < 768
      }
      size.windowSize = size
    },
    updateIntRoute(state, initRoute = null) {
      if (initRoute) sessionStorage.setItem('initRoute', JSON.stringify(initRoute))
      else sessionStorage.removeItem('initRoute')
      state.initRoute = initRoute
    },
    updateLogout(state, toggleLogout) {
      state.toggleLogout = toggleLogout
      state.userInfo.isLogin = false
    },
    // updateLogout (state, logout) {
    //   state.logout = logout
    // }
  },
  actions: {
    menuListForMessage({ commit, state: { mainMenu, initRoute } }) {
      return menuList().then((res: any) => {
        if (res && res.length) {
          const arr: any[] = formatMenus(res)
          commit('updateMenuList', arr)
          const routes = getRouters(arr, layzLoading)
          if (mainMenu[0].children) {
            mainMenu[0].children.push(...routes)
          }
          router.addRoutes(mainMenu)
          if (initRoute) {
            router.push(initRoute)
          } else {
            router.push('/')
          }
          commit('updateIntRoute')
        } else {
          throw new Error('没有权限访问')
        }
      })
    },


    async login({ commit, dispatch }, payload) {
      const res = await $api.login(payload)
      // Cookies.set('sessionToken', 'abcdefghigklm')
      // 添加token
      commit('updateToken', res.token)
      localStorage.setItem("token", res.token)
      this.state.userInfo.userName = res.userName
      this.state.userInfo.isLogin = true
      router.push({ name: 'index' })
      // await dispatch('menuListForMessage')
      return res
    },
    logout({ commit }) {
      const res = $api.logout()
      localStorage.removeItem("token")
      const item = localStorage.getItem('token')
      console.log(item);
      commit('updateLogout')
      return res
    }
  },
  getters: {
    breadcrumbList({ menuList, route }) {
      const arr: any[] = []
      menuList.some(function isHas(obj: any) {
        if (obj.id === route.meta.id) {
          arr.unshift(obj)
          return true
        } else if (obj.children && obj.children.length && obj.children.some(isHas)) {
          arr.unshift(obj)
          return true
        } else {
          return false
        }
      })
      return arr
    }
  }
})
