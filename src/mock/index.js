// src/mock/index.js
import Mock from 'mockjs';

Mock.mock('/api/user', 'get', {
  'code': 200,
  'data': {
    'name': '@cname',
    'age|18-60': 1,
    'email': '@email'
  }
});

Mock.mock('/api/list', 'get', {
  'code': 200,
  'data|10': [{
    'id|+1': 1,
    'title': '@ctitle(5, 20)',
    'content': '@cparagraph(1, 3)'
  }]
});

console.log('mock 加载成功')