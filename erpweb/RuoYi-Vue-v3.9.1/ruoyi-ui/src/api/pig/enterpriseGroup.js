import request from '@/utils/request'

// 查询企业分组列表
export function listEnterpriseGroup(query) {
  return request({
    url: '/pig/enterpriseGroup/list',
    method: 'get',
    params: query
  })
}

// 查询企业分组详细
export function getEnterpriseGroup(id) {
  return request({
    url: '/pig/enterpriseGroup/' + id,
    method: 'get'
  })
}

// 新增企业分组
export function addEnterpriseGroup(data) {
  return request({
    url: '/pig/enterpriseGroup',
    method: 'post',
    data: data
  })
}

// 修改企业分组
export function updateEnterpriseGroup(data) {
  return request({
    url: '/pig/enterpriseGroup',
    method: 'put',
    data: data
  })
}

// 删除企业分组
export function delEnterpriseGroup(id) {
  return request({
    url: '/pig/enterpriseGroup/' + id,
    method: 'delete'
  })
}
