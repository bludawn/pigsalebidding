import request from '@/utils/request'

// 查询生猪类型列表
export function listPigType(query) {
  return request({
    url: '/pig/pigType/list',
    method: 'get',
    params: query
  })
}

// 查询生猪类型详细
export function getPigType(id) {
  return request({
    url: '/pig/pigType/' + id,
    method: 'get'
  })
}

// 获取生猪类型编码
export function getNextPigTypeCode() {
  return request({
    url: '/pig/pigType/nextCode',
    method: 'get'
  })
}

// 新增生猪类型
export function addPigType(data) {
  return request({
    url: '/pig/pigType',
    method: 'post',
    data: data
  })
}

// 修改生猪类型
export function updatePigType(data) {
  return request({
    url: '/pig/pigType',
    method: 'put',
    data: data
  })
}

// 删除生猪类型
export function delPigType(id) {
  return request({
    url: '/pig/pigType/' + id,
    method: 'delete'
  })
}
