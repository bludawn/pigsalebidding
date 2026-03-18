import request from '@/utils/request'

// 查询业务消息列表
export function listBusinessMessage(query) {
  return request({
    url: '/pig/businessMessage/list',
    method: 'get',
    params: query
  })
}

// 查询业务消息详细
export function getBusinessMessage(id) {
  return request({
    url: '/pig/businessMessage/' + id,
    method: 'get'
  })
}

// 新增业务消息
export function addBusinessMessage(data) {
  return request({
    url: '/pig/businessMessage',
    method: 'post',
    data: data
  })
}

// 修改业务消息
export function updateBusinessMessage(data) {
  return request({
    url: '/pig/businessMessage',
    method: 'put',
    data: data
  })
}

// 删除业务消息
export function delBusinessMessage(id) {
  return request({
    url: '/pig/businessMessage/' + id,
    method: 'delete'
  })
}
