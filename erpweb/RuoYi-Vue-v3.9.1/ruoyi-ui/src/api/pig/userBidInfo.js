import request from '@/utils/request'

// 查询用户竞价信息维护列表
export function listUserBidInfo(query) {
  return request({
    url: '/pig/userBidInfo/list',
    method: 'get',
    params: query
  })
}

// 查询用户竞价信息维护详细
export function getUserBidInfo(id) {
  return request({
    url: '/pig/userBidInfo/' + id,
    method: 'get'
  })
}

// 新增用户竞价信息维护
export function addUserBidInfo(data) {
  return request({
    url: '/pig/userBidInfo',
    method: 'post',
    data: data
  })
}

// 修改用户竞价信息维护
export function updateUserBidInfo(data) {
  return request({
    url: '/pig/userBidInfo',
    method: 'put',
    data: data
  })
}

// 删除用户竞价信息维护
export function delUserBidInfo(id) {
  return request({
    url: '/pig/userBidInfo/' + id,
    method: 'delete'
  })
}
