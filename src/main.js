import Vue from 'vue'
import App from './App'
import store from '@/stores/index'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$store = store
const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      'pages/me/main',
      'pages/comment/main',
      '^pages/goods/main',
      'pages/orderDetail/main',
      'pages/orderList/main',
      'pages/myTeam/main',
      'pages/saleStatistics/main',
      'pages/accountBalance/main',
      'pages/reward/main',
      'pages/businessManage/main',
      'pages/businessLogin/main',
      'pages/paySuccess/main',
      'pages/createComment/main',
      'pages/news/main',
      'pages/changeInfo/main',
      'pages/withdrawRecord/main'
    ],
    window: {
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '小宝荐',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: true,
      backgroundTextStyle: 'dark',
      backgroundColor: '#f5f5f5'
    },
    debug: false
  }
}
