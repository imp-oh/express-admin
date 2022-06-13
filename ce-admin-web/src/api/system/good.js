import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listGood(query) {
  return request({
    url: '/system/good/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getGood(id) {
  return request({
    url: '/system/good/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addGood(data) {
  return request({
    url: '/system/good',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateGood(data) {
  return request({
    url: '/system/good',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delGood(id) {
  return request({
    url: '/system/good/' + id,
    method: 'delete'
  })
}
