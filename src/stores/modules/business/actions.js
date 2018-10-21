// import * as types from '../../types'
import * as StoreApi from '@/api/store'
import * as config from '@/config/common.config'
// import * as config from '@/config/common.config'
export default {
  // 商户账号密码登陆
  BusinessLogin ({commit}, opt) {
    return new Promise((resolve, reject) => {
      StoreApi.Login(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          wx.showToast({
            title: response.msg,
            icon: 'none'
          })
          reject(response)
        }
      }).catch(error => {
        console.error('[BusinessLogin]: \n', error)
        wx.showToast({
          title: '登陆失败',
          icon: 'none'
        })
        reject(error)
      })
    })
  },
  // 管理员绑定小程序
  AdminLoginBind ({commit}, opt) {
    return new Promise((resolve, reject) => {
      StoreApi.AdminLoginBind(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch(error => {
        console.error('[BusinessLoginNoPasswd]: \n', error)
        reject(error)
      })
    })
  },
  // 商家免密登陆
  BusinessLoginNoPasswd ({commit}, opt) {
    return new Promise((resolve, reject) => {
      StoreApi.LoginNoPasswd({}).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch(error => {
        console.error('[BusinessLoginNoPasswd]: \n', error)
        reject(error)
      })
    })
  },
  // 验证虚拟商品
  VirtualVerify ({commit}, opt) {
    return new Promise((resolve, reject) => {
      StoreApi.VirtualVerify(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch(error => {
        console.error('[VirtualVerify]: \n', error)
        reject(error)
      })
    })
  },
  // 获取商户基本数据
  GetBusinessBasicInfo ({commit}, opt) {
    return new Promise((resolve, reject) => {
      StoreApi.BasicInfo({}).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch(error => {
        console.error('[BusinessBasicInfo]: \n', error)
        reject(error)
      })
    })
  },
  // 获取商户每日统计数据
  GetBusinessStatisticsData ({commit}, opt) {
    return new Promise((resolve, reject) => {
      StoreApi.DayInfo(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch(error => {
        console.error('[GetBusinessStatisticsData]: \n', error)
        reject(error)
      })
    })
  },
  // 获取商户订单列表数据
  GetShopOrderList ({commit}, opt) {
    return new Promise((resolve, reject) => {
      StoreApi.ShopOrderList(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch(error => {
        console.error('[GetShopOrderList]: \n', error)
        reject(error)
      })
    })
  },
  // 获取核销记录列表
  GetVirtualList ({commit}, opt) {
    return new Promise((resolve, reject) => {
      StoreApi.GetVirtualList(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetShopOrderList]: \n', error)
        reject(error)
      })
    })
  },
  // 获取客服会话列表
  StoreChatIndex ({commit}, opt) {
    return new Promise((resolve, reject) => {
      StoreApi.StoreChatIndex(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetShopOrderList]: \n', error)
        reject(error)
      })
    })
  },
  // 加载新消息列表
  StoreChatNewread ({commit}, opt) {
    return new Promise((resolve, reject) => {
      StoreApi.StoreChatNewread({}).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetShopOrderList]: \n', error)
        reject(error)
      })
    })
  }
}
