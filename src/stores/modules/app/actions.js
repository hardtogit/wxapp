import * as types from '../../types'
import * as GlobalsApi from '@/api/globals'
import * as PosterApi from '@/api/poster'
import * as UserApi from '@/api/user'
import * as OrderApi from '@/api/order'
import * as StoreApi from '@/api/store'
import * as config from '@/config/common.config'
// import { BASE_API } from '../../../config/common.config'

const basePromiss = (apiGroup, apiKey, params, commit, key) => {
  return new Promise((resolve, reject) => {
    apiGroup[apiKey](params.data).then(response => {
      console.log(response)
      if (response.code === config.StatusCode.Success) {
        if (commit) {
          commit(key, response.data)
        }
        resolve(response)
      } else {
        console.log(response)
        reject(response)
      }
    }).catch(error => {
      console.error(apiKey + ':', error)
      reject(error)
    })
  })
}
// import * as config from '@/config/common.config'
export default {
  Login ({commit}, opt) {
    return basePromiss(GlobalsApi, 'Login', opt)
  },
  Getkeypass ({commit}, opt) {
    return basePromiss(GlobalsApi, 'Getkeypass', opt)
  },
  ApplyBecomeMerchant ({commit}, opt) {
    return basePromiss(GlobalsApi, 'ApplyBecomeMerchant', opt)
  },
  SendSecurityCode ({commit}, opt) {
    return basePromiss(GlobalsApi, 'SendSecurityCode', opt)
  },
  GetRecommendGoods ({commit}, opt) {
    return basePromiss(GlobalsApi, 'GetRecommendGoods', opt)
  },
  SynchroData ({commit}, opt) {
    return basePromiss(GlobalsApi, 'Basic', opt)
  },
  GetGoodsById ({commit}, opt) {
    return basePromiss(GlobalsApi, 'GetGoodsById', opt, commit, types.GOODS_INFO)
  },
  GetStoreInfoById ({commit}, opt) {
    return basePromiss(GlobalsApi, 'GetStoreInfoById', opt)
  },
  GetStoreGoodsList ({commit}, opt) {
    return basePromiss(GlobalsApi, 'GetStoreGoodsList', opt)
  },
  GetCommentList ({commit}, opt) {
    return basePromiss(GlobalsApi, 'GetCommentList', opt)
  },
  BuildPoster ({commit}, opt) {
    return basePromiss(PosterApi, 'Build', opt)
  },
  // TODO 公用使用vuex管理.避免改动太大
  GetUserInfo ({commit}, opt) {
    return new Promise((resolve, reject) => {
      UserApi.GetUserInfo().then(response => {
        if (response.code === config.StatusCode.Success) {
          commit(types.USER_INFO, response.data)
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetUserInfo]: \n', error)
        reject(error)
      })
    })
  },
  GetFinanceDetail ({commit}, opt) {
    return basePromiss(UserApi, 'GetFinanceDetail', opt)
  },
  GetSalesRecord ({commit}, opt) {
    return basePromiss(UserApi, 'GetSalesRecord', opt)
  },
  ReceiveCoupon ({commit}, opt) {
    return basePromiss(UserApi, 'ReceiveCoupon', opt)
  },
  GetCouponList ({commit}, opt) {
    return basePromiss(UserApi, 'GetCouponList', opt)
  },
  // Todo 有业务逻辑，暂不改动
  SubmitCommonOrder ({commit}, opt) {
    return new Promise((resolve, reject) => {
      OrderApi.SubmitCommonOrder(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          wx.hideLoading()
          return wx.showToast({
            title: response.msg,
            icon: 'none'
          })
        }
      }).catch(error => {
        console.error('[SubmitCommonOrder]: \n', error)
        wx.hideLoading()
        return wx.showToast({
          title: '提交失败',
          icon: 'none'
        })
      })
    })
  },
  GetOrderList ({commit}, opt) {
    return basePromiss(OrderApi, 'GetOrderList', opt)
  },
  GetOrderDetail ({commit}, opt) {
    return basePromiss(OrderApi, 'GetOrderDetail', opt)
  },
  GetOrderCodeList ({commit}, opt) {
    return basePromiss(OrderApi, 'GetOrderCodeList', opt)
  },
  CreateEncryptCode ({commit}, opt) {
    return basePromiss(OrderApi, 'CreateEncryptCode', opt)
  },
  GetCommentatorBoughtGoods ({commit}, opt) {
    return basePromiss(GlobalsApi, 'GetCommentatorBoughtGoods', opt)
  },
  Bindmobilebyauth ({commit}, opt) {
    return basePromiss(UserApi, 'Bindmobilebyauth', opt)
  },
  Bindmobile ({commit}, opt) {
    return new Promise((resolve, reject) => {
      UserApi.Bindmobile(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          wx.hideLoading()
          return wx.showToast({
            title: response.msg,
            icon: 'none'
          })
        }
      }).catch(error => {
        console.error('[Bindmobile]: \n', error)
        wx.hideLoading()
        return wx.showToast({
          title: '提交失败',
          icon: 'none'
        })
      })
    })
  },
  GetWithdrawRecord ({commit}, opt) {
    return basePromiss(UserApi, 'GetWithdrawRecord', opt)
  },
  Withdraw ({commit}, opt) {
    return basePromiss(UserApi, 'Withdraw', opt)
  },
  UpLoadPqcode ({commit}, opt) {
    return basePromiss(UserApi, 'UpLoadPqcode', opt)
  },
  GetAwardhistory ({commit}, opt) {
    return basePromiss(UserApi, 'GetAwardhistory', opt)
  },
  CreateComment ({commit}, opt) {
    return new Promise((resolve, reject) => {
      OrderApi.CreateComment(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          wx.hideLoading()
          return wx.showToast({
            title: response.msg,
            icon: 'none'
          })
        }
      }).catch(error => {
        console.error('[Bindmobile]: \n', error)
        wx.hideLoading()
        return wx.showToast({
          title: '提交失败',
          icon: 'none'
        })
      })
    })
  },

  // 个人
  GetAddressList ({commit}, opt) {
    return basePromiss(UserApi, 'GetAddressList', opt)
  },
  AddAddress ({commit}, opt) {
    return basePromiss(UserApi, 'AddAddress', opt)
  },
  EditAddress ({commit}, opt) {
    return basePromiss(UserApi, 'EditAddress', opt)
  },
  DeleteAddress ({commit}, opt) {
    return basePromiss(UserApi, 'DeleteAddress', opt)
  },
  GetDefaultAddress ({commit}, opt) {
    return basePromiss(UserApi, 'GetDefaultAddress', opt)
  },
  SureReceive ({commit}, opt) {
    return basePromiss(UserApi, 'SureReceive', opt)
  },

  // 商户
  GetCompany ({commit}, opt) {
    return basePromiss(StoreApi, 'GetCompany', opt)
  },
  SendFar ({commit}, opt) {
    return basePromiss(StoreApi, 'SendFar', opt)
  },
  FindCompany ({commit}, opt) {
    return basePromiss(StoreApi, 'FindCompany', opt)
  },
  FinanceCount ({commit}, opt) {
    return basePromiss(StoreApi, 'FinanceCount', opt)
  },
  BankList ({commit}, opt) {
    return basePromiss(StoreApi, 'BankList', opt)
  },
  StoreWithdraw ({commit}, opt) {
    return basePromiss(StoreApi, 'StoreWithdraw', opt)
  }
}
