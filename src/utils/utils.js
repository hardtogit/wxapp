import SN from '@/config/localstorage.name'
import store from '@/stores/index'
export function isLogin () {
  if (wx.getStorageSync(SN.Auth) && wx.getStorageSync(SN.Auth).session_token && wx.getStorageSync(SN.UserInfo)) {
    return true
  } else {
    return false
  }
}
// 判断session_key是否过期，并重新登陆
export const reLogin = () => {
  return new Promise((resolve, reject) => {
    // session_key 已经失效，需要重新执行登录流程
    wx.login({
      success: res => {
        wx.setStorageSync(SN.wxCode, res.code)
        store.dispatch({
          type: 'Login',
          data: {
            code: res.code
          }
        }).then(obj => {
          wx.setStorageSync(SN.Auth, obj.data)
          resolve()
        })
      },
      fail: (e) => {
        console.log('登陆失败')
        reject(e)
      }
    })
  })
}
