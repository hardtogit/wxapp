import Fly from 'flyio/dist/npm/wx'
import SN from '@/config/localstorage.name'

var fly = new Fly()
fly.config.timeout = 300000
fly.config.baseURL = 'https://api.new.618000.com'

// 添加请求拦截器
fly.interceptors.request.use(request => {
  // 给所有请求添加自定义header
  request.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  request.headers['AppId'] = '1'
  // 对获取商品信息做单独处理
  if (request.url.indexOf('/miniapp/globals/goods') !== -1) {
    // 当用户登陆过的在header里面传AuthToken就能获取是否领取过优惠券, 没登陆过就不传
    if (wx.getStorageSync(SN.Auth) && wx.getStorageSync(SN.Auth).session_token) {
      request.headers['AuthToken'] = wx.getStorageSync(SN.Auth).session_token
    }
  }
  if (request.url.indexOf('/miniapp/globals') === -1) {
    request.headers['AuthToken'] = wx.getStorageSync(SN.Auth).session_token
    if (request.url.indexOf('/store/login') === -1 && request.url.indexOf('/store.login') === -1) {
      // console.log(wx.getStorageSync(SN.StoreAuthToken))
      request.headers['SotreAuthToken'] = wx.getStorageSync(SN.StoreAuthToken)
    }
  }
  return request
}, error => {
  Promise.reject(error)
})

// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  response => {
    // 只将请求结果的data字段返回
    return response.data
  },
  error => {
    // Vue.$vui.loading.hide()
    if (error.code === 'ECONNABORTED') {
      error.message = '连接服务器超时，请重试'
      // Vue.$vui.alert.show({
      //   content: error.message
      // })
      return Promise.reject(error)
    }
    if (error.message === 'Network Error') {
      error.message = '连接服务器出错，请检查网络是否正常'
      return Promise.reject(error)
    }
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误'
          break
        case 401:
          error.message = '您的登录会话已过期，请退出重新登录'
          break
        case 403:
          error.message = '您的请求过于频繁，请稍后重试'
          break
        case 404:
          error.mesage = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = '请求超时，请重试'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        case 501:
          error.message = '服务未实现'
          break
        case 502:
          error.message = '网关错误'
          break
        case 503:
          error.message = '系统维护中，请稍后访问'
          break
        case 504:
          error.message = '网关超时'
          break
        case 505:
          error.message = 'HTTP版本不受支持'
          break
        default:
      }
      if (error.response.status === 401) {
        // Vue.$vui.alert.show({
        //   content: '登录已过期，请重新登录',
        //   onHide () {
        //     window.location.href = window.location.origin + '#/login'
        //   }
        // })
      }
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

// export default fly
export function Request (opt) {
  return fly.request(opt.url, opt.data ? opt.data : {}, {method: opt.method})
}
