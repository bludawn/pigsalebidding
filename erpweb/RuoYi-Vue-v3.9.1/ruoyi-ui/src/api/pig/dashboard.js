import request from '@/utils/request'

// 首页聚合统计
export function getPigDashboardOverview() {
  return request({
    url: '/pig/dashboard/overview',
    method: 'get'
  })
}
