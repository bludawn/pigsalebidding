import request from '@/utils/request'

// 查询送货信息列表
export function listDeliveryInfo(query) {
  return request({
    url: '/pig/deliveryInfo/list',
    method: 'get',
    params: query
  })
}

// 查询送货信息详细
export function getDeliveryInfo(id) {
  return request({
    url: '/pig/deliveryInfo/' + id,
    method: 'get'
  })
}

// 获取运输编码
export function getNextTransportCode() {
  return request({
    url: '/pig/deliveryInfo/nextCode',
    method: 'get'
  })
}

// 新增送货信息
export function addDeliveryInfo(data) {
  return request({
    url: '/pig/deliveryInfo',
    method: 'post',
    data: data
  })
}

// 修改送货信息
export function updateDeliveryInfo(data) {
  return request({
    url: '/pig/deliveryInfo',
    method: 'put',
    data: data
  })
}

// 删除送货信息
export function delDeliveryInfo(id) {
  return request({
    url: '/pig/deliveryInfo/' + id,
    method: 'delete'
  })
}
