import * as Fly from '@/utils/fetch'
import * as COMMON_CONFIG from '@/config/common.config'

// 生成海报
export function Build (data) {
  return Fly.Request({
    url: COMMON_CONFIG.POSTER_API + '/build',
    method: 'post',
    data
  })
}

// 获取可用海报列表
export function Lists (data) {
  return Fly.Request({
    url: COMMON_CONFIG.POSTER_API + '/lists',
    method: 'post',
    data
  })
}
