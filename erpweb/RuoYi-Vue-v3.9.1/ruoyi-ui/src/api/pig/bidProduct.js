import request from '@/utils/request'

// 查询竞价商品列表
export function listBidProduct(query) {
  return request({
    url: '/pig/bidProduct/list',
    method: 'get',
    params: query
  })
}

// 查询竞价商品详细
export function getBidProduct(id) {
  return request({
    url: '/pig/bidProduct/' + id,
    method: 'get'
  })
}

// 新增竞价商品
export function addBidProduct(data) {
  return request({
    url: '/pig/bidProduct',
    method: 'post',
    data: data
  })
}

// 修改竞价商品
export function updateBidProduct(data) {
  return request({
    url: '/pig/bidProduct',
    method: 'put',
    data: data
  })
}

// 删除竞价商品
export function delBidProduct(id) {
  return request({
    url: '/pig/bidProduct/' + id,
    method: 'delete'
  })
}
