import SN from '@/config/localstorage.name'
export function isLogin () {
  if (wx.getStorageSync(SN.Auth) && wx.getStorageSync(SN.Auth).session_token && wx.getStorageSync(SN.UserInfo)) {
    return true
  } else {
    return false
  }
}
