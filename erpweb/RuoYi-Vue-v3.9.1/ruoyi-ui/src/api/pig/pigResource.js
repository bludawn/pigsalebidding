import request from '@/utils/request'

// 查询生猪资源列表
export function listPigResource(query) {
  return request({
    url: '/pig/pigResource/list',
    method: 'get',
    params: query
  })
}

// 查询生猪资源详细
export function getPigResource(id) {
  return request({
    url: '/pig/pigResource/' + id,
    method: 'get'
  })
}

// 新增生猪资源
export function addPigResource(data) {
  return request({
    url: '/pig/pigResource',
    method: 'post',
    data: data
  })
}

// 修改生猪资源
export function updatePigResource(data) {
  return request({
    url: '/pig/pigResource',
    method: 'put',
    data: data
  })
}

// 删除生猪资源
export function delPigResource(id) {
  return request({
    url: '/pig/pigResource/' + id,
    method: 'delete'
  })
}
