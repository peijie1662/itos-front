import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import VCharts from 'v-charts'
import 'element-ui/lib/theme-chalk/index.css'
import routes from './routes'
import './assets/iconfont/iconfont.css'
import './assets/first-page/iconfont.css'
import store from '@/api/store'
import VueKonva from 'vue-konva'
import Scroll from 'vue-seamless-scroll'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VCharts)
Vue.use(VueKonva)
Vue.use(Scroll)

const router = new VueRouter({
  //mode: "history",
  routes
})

//通过beforeEach判断用户是否登录，
router.beforeEach((to, from, next) => {
  //登录动作删除原用户
  if (to.path == '/login') {
    store.commit('update_userInfo', null)
    next()
  } else {
    //如果无登录信息则转向登录页面，否则继续加载组件.
    let userInfo = store.state.userInfo;
    if (!userInfo && to.path != '/login' && router.currentRoute.path != "/login") {
      next({ path: '/login' })
    } else {
      //按照用户权限设置菜单 
      var power = userInfo.authority;
      let rs = router.options.routes;
      for (let i in rs) {
        if ("children" in rs[i]) {
          for (let m in rs[i].children) {
            let r = rs[i].children[m];
            if (power.indexOf(r.meta.funId) < 0) {
              r.meta.dis = true;
            } else {
              r.meta.dis = false;
            }
          }
        }
      }
      next()
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
