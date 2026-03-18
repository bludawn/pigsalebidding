import request from '@/utils/request'

// 查询地址管理列表
export function listAddress(query) {
  return request({
    url: '/pig/address/list',
    method: 'get',
    params: query
  })
}

// 查询地址管理详细
export function getAddress(id) {
  return request({
    url: '/pig/address/' + id,
    method: 'get'
  })
}

// 新增地址管理
export function addAddress(data) {
  return request({
    url: '/pig/address',
    method: 'post',
    data: data
  })
}

// 修改地址管理
export function updateAddress(data) {
  return request({
    url: '/pig/address',
    method: 'put',
    data: data
  })
}

// 删除地址管理
export function delAddress(id) {
  return request({
    url: '/pig/address/' + id,
    method: 'delete'
  })
}
