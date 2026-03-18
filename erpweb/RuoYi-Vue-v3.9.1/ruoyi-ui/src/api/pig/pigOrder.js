import request from '@/utils/request'

// 查询订单列表
export function listPigOrder(query) {
  return request({
    url: '/pig/pigOrder/list',
    method: 'get',
    params: query
  })
}

// 查询订单详细
export function getPigOrder(id) {
  return request({
    url: '/pig/pigOrder/' + id,
    method: 'get'
  })
}

// 新增订单
export function addPigOrder(data) {
  return request({
    url: '/pig/pigOrder',
    method: 'post',
    data: data
  })
}

// 修改订单
export function updatePigOrder(data) {
  return request({
    url: '/pig/pigOrder',
    method: 'put',
    data: data
  })
}

// 删除订单
export function delPigOrder(id) {
  return request({
    url: '/pig/pigOrder/' + id,
    method: 'delete'
  })
}
