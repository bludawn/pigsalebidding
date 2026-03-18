import request from '@/utils/request'

// 查询用户信息拓展列表
export function listUserExt(query) {
  return request({
    url: '/pig/userExt/list',
    method: 'get',
    params: query
  })
}

// 查询用户信息拓展详细
export function getUserExt(id) {
  return request({
    url: '/pig/userExt/' + id,
    method: 'get'
  })
}

// 新增用户信息拓展
export function addUserExt(data) {
  return request({
    url: '/pig/userExt',
    method: 'post',
    data: data
  })
}

// 修改用户信息拓展
export function updateUserExt(data) {
  return request({
    url: '/pig/userExt',
    method: 'put',
    data: data
  })
}

// 删除用户信息拓展
export function delUserExt(id) {
  return request({
    url: '/pig/userExt/' + id,
    method: 'delete'
  })
}
