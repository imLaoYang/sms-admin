import Vue from 'vue'
import ElementUi from 'element-ui'
import 'nprogress/nprogress.css'
import { sync } from 'vuex-router-sync'
import mcommon from '@hanyk/mcommon'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Vcomp from '@/components/common/index'
import api from '@/api'
import Toast from '@/components/common/toast/index.js'
// 进度条
import NProgress from 'nprogress'
Vue.config.productionTip = false
Vue.prototype.$api = api

Vue.use(ElementUi, { size: 'small', zIndex: 3000 })
Vue.use(mcommon)
Vue.use(Vcomp)
sync(store, router)
// 弹窗
Vue.prototype.$Toast = Toast

router.beforeEach((to, from, next) => {
  // NProgress.start()
   // 是登录页面
   if(to.path === '/login') {
    next()
  } else {

    // 不是登录页面
    // 2. 判断 是否登录过
    const token = localStorage.getItem('token')
    token ? next() : next('/login')
  } 
})
router.afterEach(() => {
  // NProgress.done()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
