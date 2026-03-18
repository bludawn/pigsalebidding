import request from '@/utils/request'

// 查询场点列表
export function listSite(query) {
  return request({
    url: '/pig/site/list',
    method: 'get',
    params: query
  })
}

// 查询场点详细
export function getSite(id) {
  return request({
    url: '/pig/site/' + id,
    method: 'get'
  })
}

// 新增场点
export function addSite(data) {
  return request({
    url: '/pig/site',
    method: 'post',
    data: data
  })
}

// 修改场点
export function updateSite(data) {
  return request({
    url: '/pig/site',
    method: 'put',
    data: data
  })
}

// 删除场点
export function delSite(id) {
  return request({
    url: '/pig/site/' + id,
    method: 'delete'
  })
}
