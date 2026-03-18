import request from '@/utils/request'

// 查询生猪标签列表
export function listPigTag(query) {
  return request({
    url: '/pig/pigTag/list',
    method: 'get',
    params: query
  })
}

// 查询生猪标签详细
export function getPigTag(id) {
  return request({
    url: '/pig/pigTag/' + id,
    method: 'get'
  })
}

// 新增生猪标签
export function addPigTag(data) {
  return request({
    url: '/pig/pigTag',
    method: 'post',
    data: data
  })
}

// 修改生猪标签
export function updatePigTag(data) {
  return request({
    url: '/pig/pigTag',
    method: 'put',
    data: data
  })
}

// 删除生猪标签
export function delPigTag(id) {
  return request({
    url: '/pig/pigTag/' + id,
    method: 'delete'
  })
}
