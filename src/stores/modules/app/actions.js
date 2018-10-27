import * as types from '../../types'
import * as GlobalsApi from '@/api/globals'
import * as PosterApi from '@/api/poster'
import * as UserApi from '@/api/user'
import * as OrderApi from '@/api/order'
import * as config from '@/config/common.config'

const basePromiss = (apiGroup, apiKey, params) => {
  return new Promise((resolve, reject) => {
    apiGroup[apiKey](params.data).then(response => {
      if (response.code === config.StatusCode.Success) {
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
    return new Promise((resolve, reject) => {
      GlobalsApi.Login(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
        //   // commit(types.SetCosmeClassList, {Data: response.Data})
          commit(types.Login, {})
          resolve(response)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch(error => {
        console.error('[Login]: \n', error)
        reject(error)
      })
    })
  },
  Getkeypass ({commit}, opt) {
    return new Promise((resolve, reject) => {
      GlobalsApi.Getkeypass(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch(error => {
        console.error('[Getkeypass]: \n', error)
        reject(error)
      })
    })
  },
  ApplyBecomeMerchant ({commit}, opt) {
    return new Promise((resolve, reject) => {
      GlobalsApi.ApplyBecomeMerchant(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch(error => {
        console.error('[ApplyBecomeMerchant]: \n', error)
        reject(error)
      })
    })
  },
  SendSecurityCode ({commit}, opt) {
    return new Promise((resolve, reject) => {
      GlobalsApi.SendSecurityCode(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch(error => {
        console.error('[SendSecurityCode]: \n', error)
        reject(error)
      })
    })
  },
  GetRecommendGoods ({commit}, opt) {
    return new Promise((resolve, reject) => {
      GlobalsApi.GetRecommendGoods(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch(error => {
        console.error('[GetRecommendGoods]: \n', error)
        reject(error)
      })
    })
  },
  SynchroData ({commit}, opt) {
    return new Promise((resolve, reject) => {
      GlobalsApi.Basic(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          console.log(response)
          reject(response)
        }
      }).catch(error => {
        console.error('[Login]: \n', error)
        reject(error)
      })
    })
  },
  GetGoodsById ({commit}, opt) {
    return new Promise((resolve, reject) => {
      GlobalsApi.GetGoodsById(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetGoodsById]: \n', error)
        reject(error)
      })
    })
  },
  GetStoreInfoById ({commit}, opt) {
    return new Promise((resolve, reject) => {
      GlobalsApi.GetStoreInfoById(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetGoodsById]: \n', error)
        reject(error)
      })
    })
  },
  GetCommentList ({commit}, opt) {
    return new Promise((resolve, reject) => {
      GlobalsApi.GetCommentList(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetCommentList]: \n', error)
        reject(error)
      })
    })
  },
  BuildPoster ({commit}, opt) {
    return new Promise((resolve, reject) => {
      PosterApi.Build(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[BuildPoster]: \n', error)
        reject(error)
      })
    })
  },
  GetUserInfo ({commit}, opt) {
    return new Promise((resolve, reject) => {
      UserApi.GetUserInfo().then(response => {
        if (response.code === config.StatusCode.Success) {
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
    return new Promise((resolve, reject) => {
      UserApi.GetFinanceDetail(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetFinanceDetail]: \n', error)
        reject(error)
      })
    })
  },
  GetSalesRecord ({commit}, opt) {
    return new Promise((resolve, reject) => {
      UserApi.GetSalesRecord(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetSalesRecord]: \n', error)
        reject(error)
      })
    })
  },
  ReceiveCoupon ({commit}, opt) {
    return new Promise((resolve, reject) => {
      UserApi.ReceiveCoupon(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[ReceiveCoupon]: \n', error)
        reject(error)
      })
    })
  },
  GetCouponList ({commit}, opt) {
    return new Promise((resolve, reject) => {
      UserApi.GetCouponList(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetCouponList]: \n', error)
        reject(error)
      })
    })
  },
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
    return new Promise((resolve, reject) => {
      OrderApi.GetOrderList(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetOrderList]: \n', error)
        reject(error)
      })
    })
  },
  GetOrderDetail ({commit}, opt) {
    return new Promise((resolve, reject) => {
      OrderApi.GetOrderDetail(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetOrderDetail]: \n', error)
        reject(error)
      })
    })
  },
  GetOrderCodeList ({commit}, opt) {
    return new Promise((resolve, reject) => {
      OrderApi.GetOrderCodeList(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetOrderCodeList]: \n', error)
        reject(error)
      })
    })
  },
  CreateEncryptCode ({commit}, opt) {
    return new Promise((resolve, reject) => {
      OrderApi.CreateEncryptCode(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetOrderCodeList]: \n', error)
        reject(error)
      })
    })
  },
  GetCommentatorBoughtGoods ({commit}, opt) {
    return new Promise((resolve, reject) => {
      GlobalsApi.GetCommentatorBoughtGoods(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetCommentatorBoughtGoods]: \n', error)
        reject(error)
      })
    })
  },
  Bindmobilebyauth ({commit}, opt) {
    return new Promise((resolve, reject) => {
      UserApi.Bindmobilebyauth(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[Bindmobilebyauth]: \n', error)
        reject(error)
      })
    })
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
    return new Promise((resolve, reject) => {
      UserApi.GetWithdrawRecord(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[GetWithdrawRecord]: \n', error)
        reject(error)
      })
    })
  },
  Withdraw ({commit}, opt) {
    return new Promise((resolve, reject) => {
      UserApi.Withdraw(opt.data).then(response => {
        if (response.code === config.StatusCode.Success) {
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(error => {
        console.error('[Withdraw]: \n', error)
        reject(error)
      })
    })
  },
  UpLoadPqcode ({commit}, opt) {
    return basePromiss(UserApi, 'upLoadPqcode', opt)
  },
  GetAwardhistory ({commit}, opt) {
    return basePromiss(UserApi, 'getAwardhistory', opt)
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
  }

}
