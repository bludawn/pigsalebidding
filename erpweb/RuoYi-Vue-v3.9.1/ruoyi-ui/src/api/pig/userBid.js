import request from '@/utils/request'

// 查询用户出价列表
export function listUserBid(query) {
  return request({
    url: '/pig/userBid/list',
    method: 'get',
    params: query
  })
}

// 查询用户出价详细
export function getUserBid(id) {
  return request({
    url: '/pig/userBid/' + id,
    method: 'get'
  })
}

// 新增用户出价
export function addUserBid(data) {
  return request({
    url: '/pig/userBid',
    method: 'post',
    data: data
  })
}

// 修改用户出价
export function updateUserBid(data) {
  return request({
    url: '/pig/userBid',
    method: 'put',
    data: data
  })
}

// 删除用户出价
export function delUserBid(id) {
  return request({
    url: '/pig/userBid/' + id,
    method: 'delete'
  })
}
