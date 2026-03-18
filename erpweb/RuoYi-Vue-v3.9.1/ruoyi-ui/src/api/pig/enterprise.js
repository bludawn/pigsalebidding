import request from '@/utils/request'

// 查询企业信息列表
export function listEnterprise(query) {
  return request({
    url: '/pig/enterprise/list',
    method: 'get',
    params: query
  })
}

// 查询企业信息详细
export function getEnterprise(id) {
  return request({
    url: '/pig/enterprise/' + id,
    method: 'get'
  })
}

// 新增企业信息
export function addEnterprise(data) {
  return request({
    url: '/pig/enterprise',
    method: 'post',
    data: data
  })
}

// 修改企业信息
export function updateEnterprise(data) {
  return request({
    url: '/pig/enterprise',
    method: 'put',
    data: data
  })
}

// 删除企业信息
export function delEnterprise(id) {
  return request({
    url: '/pig/enterprise/' + id,
    method: 'delete'
  })
}
