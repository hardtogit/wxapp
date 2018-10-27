import * as Fly from '@/utils/fetch'
import * as COMMON_CONFIG from '@/config/common.config'

// 获取用户信息
export function GetUserInfo () {
  return Fly.Request({
    url: COMMON_CONFIG.USER_API + '/info',
    method: 'post'
  })
}
// 获取用户财务明细
export function GetFinanceDetail (data) {
  return Fly.Request({
    url: COMMON_CONFIG.USER_API + '.finance/basic',
    method: 'post',
    data
  })
}

// 获取用户直销记录
export function GetSalesRecord (data) {
  return Fly.Request({
    url: COMMON_CONFIG.USER_API + '/salelist',
    method: 'post',
    data
  })
}

// 领取优惠券
export function ReceiveCoupon (data) {
  return Fly.Request({
    url: COMMON_CONFIG.COUPON_API + '/getcoupon',
    method: 'post',
    data
  })
}

// 获取优惠券列表
export function GetCouponList (data) {
  return Fly.Request({
    url: COMMON_CONFIG.COUPON_API + '/getlist',
    method: 'post',
    data
  })
}

// 通过小程序接口绑定手机号
export function Bindmobilebyauth (data) {
  return Fly.Request({
    url: COMMON_CONFIG.USER_API + '/bindmobilebyauth',
    method: 'post',
    data
  })
}

// 通过短信验证码绑定手机号
export function Bindmobile (data) {
  return Fly.Request({
    url: COMMON_CONFIG.USER_API + '/bindmobile',
    method: 'post',
    data
  })
}

// 获取提现记录
export function GetWithdrawRecord (data) {
  return Fly.Request({
    url: COMMON_CONFIG.USER_API + '.finance/drawing',
    method: 'post',
    data
  })
}

// 余额提现
export function Withdraw (data) {
  return Fly.Request({
    url: COMMON_CONFIG.USER_API + '.finance/drawingpush',
    method: 'post',
    data
  })
}

// 上传群二维码
export function upLoadPqcode (data) {
  return Fly.Request({
    url: COMMON_CONFIG.USER_API + '/setqrcode',
    method: 'post',
    data
  })
}

// 获得奖励明细
export function getAwardhistory (data) {
  return Fly.Request({
    url: COMMON_CONFIG.USER_API + '/awardhistory',
    method: 'post',
    data
  })
}
