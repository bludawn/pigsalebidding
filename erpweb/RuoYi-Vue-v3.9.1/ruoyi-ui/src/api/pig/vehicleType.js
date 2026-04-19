import request from '@/utils/request'

// 查询车辆类型列表
export function listVehicleType(query) {
  return request({
    url: '/pig/vehicleType/list',
    method: 'get',
    params: query
  })
}

// 查询车辆类型详细
export function getVehicleType(id) {
  return request({
    url: '/pig/vehicleType/' + id,
    method: 'get'
  })
}

// 新增车辆类型
export function addVehicleType(data) {
  return request({
    url: '/pig/vehicleType',
    method: 'post',
    data: data
  })
}

// 修改车辆类型
export function updateVehicleType(data) {
  return request({
    url: '/pig/vehicleType',
    method: 'put',
    data: data
  })
}

// 删除车辆类型
export function delVehicleType(id) {
  return request({
    url: '/pig/vehicleType/' + id,
    method: 'delete'
  })
}
