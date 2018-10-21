import * as Fly from '@/utils/fetch'
import * as COMMON_CONFIG from '@/config/common.config'

// 登陆API
export function Login (data) {
  return Fly.Request({
    url: COMMON_CONFIG.GLOBALS_API + '/login',
    method: 'post',
    data
  })
}

// 获取海报key对应值
export function Getkeypass (data) {
  return Fly.Request({
    url: COMMON_CONFIG.GLOBALS_API + '/getkeypass',
    method: 'post',
    data
  })
}

// 同步基本资料API
export function Basic (data) {
  return Fly.Request({
    url: COMMON_CONFIG.GLOBALS_API + '/basic',
    method: 'post',
    data
  })
}

// 地理周边搜索
export function Lbskey (data) {
  return Fly.Request({
    url: COMMON_CONFIG.GLOBALS_API + '/lbskey',
    method: 'post',
    data
  })
}

// 根据经纬度定位
export function Lbs (data) {
  return Fly.Request({
    url: COMMON_CONFIG.GLOBALS_API + '/lbs',
    method: 'post',
    data
  })
}

// 申请开通商户账号
export function ApplyBecomeMerchant (data) {
  return Fly.Request({
    url: COMMON_CONFIG.GLOBALS_API + '/datum',
    method: 'post',
    data
  })
}

// 根据商品id获取商品详情
export function GetGoodsById (data) {
  return Fly.Request({
    url: COMMON_CONFIG.GLOBALS_API + '/goods',
    method: 'post',
    data
  })
}

// 根据商品id获取商户基本信息
export function GetStoreInfoById (data) {
  return Fly.Request({
    url: COMMON_CONFIG.GLOBALS_API + '/storeinfo',
    method: 'post',
    data
  })
}

// 获取评论列表
export function GetCommentList (data) {
  return Fly.Request({
    url: COMMON_CONFIG.GLOBALS_API + '/discuss',
    method: 'post',
    data
  })
}

// 获取评论人购买过的商品
export function GetCommentatorBoughtGoods (data) {
  return Fly.Request({
    url: COMMON_CONFIG.GLOBALS_API + '/buygoods',
    method: 'post',
    data
  })
}

// 发送短消息
export function SendSecurityCode (data) {
  return Fly.Request({
    url: '/miniapp/sms/sendsecuritycode',
    method: 'post',
    data
  })
}

// 获取推荐商品
export function GetRecommendGoods (data) {
  return Fly.Request({
    url: '/miniapp/goods/recommend',
    method: 'post',
    data
  })
}
