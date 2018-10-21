import * as Fly from '@/utils/fetch'
import * as COMMON_CONFIG from '@/config/common.config'

// 商户登陆
export function Login (data) {
  return Fly.Request({
    url: COMMON_CONFIG.STORE_API + '/login',
    method: 'post',
    data
  })
}

// 商户基本数据
export function BasicInfo (data) {
  return Fly.Request({
    url: COMMON_CONFIG.STORE_API + '.info/basic',
    method: 'post',
    data
  })
}

// 每日统计
export function DayInfo (data) {
  return Fly.Request({
    url: COMMON_CONFIG.STORE_API + '.info/day',
    method: 'post',
    data
  })
}

// 财务明细
export function FinanceLists (data) {
  return Fly.Request({
    url: COMMON_CONFIG.STORE_API + '.finance/lists',
    method: 'post',
    data
  })
}

// 验证虚拟商品
export function VirtualVerify (data) {
  return Fly.Request({
    url: COMMON_CONFIG.STORE_API + '.virtual/verify',
    method: 'post',
    data
  })
}

// 管理员小程序绑定
export function AdminLoginBind (data) {
  return Fly.Request({
    url: COMMON_CONFIG.STORE_API + '.login/bind',
    method: 'post',
    data
  })
}

// 获取授权(绑定免登录)
export function LoginNoPasswd (data) {
  return Fly.Request({
    url: COMMON_CONFIG.STORE_API + '.login/nopasswd',
    method: 'post',
    data
  })
}

// 客服会话列表
export function StoreChatIndex (data) {
  return Fly.Request({
    url: COMMON_CONFIG.STORE_API + '.chat/index',
    method: 'post',
    data
  })
}

// 加载新消息列表
export function StoreChatNewread (data) {
  return Fly.Request({
    url: COMMON_CONFIG.STORE_API + '.chat/newread',
    method: 'post',
    data
  })
}

// 加载商铺订单列表
export function ShopOrderList (data) {
  return Fly.Request({
    url: COMMON_CONFIG.STORE_API + '.order/lists',
    method: 'post',
    data
  })
}

// 获取核销记录列表
export function GetVirtualList (data) {
  return Fly.Request({
    url: COMMON_CONFIG.STORE_API + '.virtual/vlist',
    method: 'post',
    data
  })
}
