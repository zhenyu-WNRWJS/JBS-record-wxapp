// src/utils/request.js
import Taro from '@tarojs/taro';

export const API_BASE_URL = 'http://localhost:3000';
// export const API_BASE_URL = 'http://192.168.11.136';
//http://192.168.11.136/

const request = (options) => {
  console.log(options)
  const { url, method, data } = options;
  return Taro.request({
    url: `${API_BASE_URL}${url}`, // 确保 URL 正确
    // url: url,
    method,
    data,
    header: {
      'Content-Type': 'application/json',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // mode: ''
    }
  }).then(res => {
    return res.data;
  }).catch(err => {
    console.error(err);
    throw err;
  });
};

export default request;