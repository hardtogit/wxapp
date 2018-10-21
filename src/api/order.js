import * as Fly from '@/utils/fetch'
import * as COMMON_CONFIG from '@/config/common.config'

// 提交普通订单
export function SubmitCommonOrder (data) {
  return Fly.Request({
    url: COMMON_CONFIG.ORDER_API + '/ready',
    method: 'post',
    data
  })
}

// 获取订单列表
export function GetOrderList (data) {
  return Fly.Request({
    url: COMMON_CONFIG.ORDER_API + '/lists',
    method: 'post',
    data
  })
}

// 获取订单详情
export function GetOrderDetail (data) {
  return Fly.Request({
    url: COMMON_CONFIG.ORDER_API + '/detail',
    method: 'post',
    data
  })
}

// 获取验证码列表
export function GetOrderCodeList (data) {
  return Fly.Request({
    url: COMMON_CONFIG.USER_API + '.goods/vlist',
    method: 'post',
    data
  })
}

// 验证码加密串生成
export function CreateEncryptCode (data) {
  return Fly.Request({
    url: COMMON_CONFIG.USER_API + '.goods/vqrcode',
    method: 'post',
    data
  })
}

// 创建评论
export function CreateComment (data) {
  return Fly.Request({
    url: '/miniapp/discuss/push',
    method: 'post',
    data
  })
}
