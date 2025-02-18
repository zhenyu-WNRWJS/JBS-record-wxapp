
import request from '../../utils/request'

export function getMockList() {
  return request({
    url: '/api/list'
  })
}
