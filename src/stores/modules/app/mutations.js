import SN from '@/config/localstorage.name'
import * as types from '../../types'

export default {
  [types.Login] (state, data) {
    state.count += 1
  },
  [types.USER_INFO] (state, data) {
    console.log(state, 'aaaaaaa')
    wx.setStorageSync(SN.UserInfo, data)
    state.UserInfo = data
  }
}
