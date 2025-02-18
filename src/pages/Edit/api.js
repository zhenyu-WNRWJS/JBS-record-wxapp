
import request from '../../utils/request'

export function getConstData() {
  return request({
    url: '/api/getConstData',
    method: 'POST',
    data: { a: 1 }
  })
}

