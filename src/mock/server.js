const express = require('express');
const app = express();
const port = 3000;

app.get('/api/user', (req, res) => {
  res.json({
    code: 200,
    data: {
      name: '张三',
      age: 25,
      email: 'zhangsan@example.com'
    }
  });
});

app.get('/api/list', (req, res) => {
  res.json({
    code: 200,
    data: [
      { id: 1, name: '乱春', comment: 'Content 1', man: 3, women: 3, role: '颜无依' },
      { id: 2, name: '流氓叙事', comment: 'Content 2', man: 3, women: 3, role: '程聿怀' }
    ]
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});