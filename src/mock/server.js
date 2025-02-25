const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

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

app.get('/api/homeList', (req, res) => {
  res.json({
    code: 200,
    data: [
      {
        id: '1',
        is_full: false,
        comment: "各补贴100",
        date: "2025-02-15 12:00",
        drama: ["流氓叙事"],
        missing_roles: ["缪宏谟", "以撒"],
        role: ["程聿怀"],
        shop_name: "momo",
        url: 'https://storage.360buyimg.com/imgtools/e067cd5b69-07c864c0-dd02-11ed-8b2c-d7f58b17086a.png'
      },
      {
        id: '2',
        is_full: false,
        comment: "阮哲带人",
        date: "2025-02-23 12:00",
        drama: ["牧神午后"],
        missing_roles: ["阮哲", "央拉", '达瓦', '炬'],
        role: ["换青"],
        shop_name: "有点猫腻",
        url: 'https://storage.360buyimg.com/imgtools/e067cd5b69-07c864c0-dd02-11ed-8b2c-d7f58b17086a.png'
      },
      {
        id: '3',
        is_full: true,
        comment: "",
        date: "2025-02-28 12:00",
        drama: ["乱春"],
        missing_roles: [],
        role: ["颜无依"],
        shop_name: "有点猫腻",
      }
    ]
  });
});

app.get('/api/list', (req, res) => {
  res.json({
    code: 200,
    data: [
      {
        id: '1',
        is_full: false,
        comment: "各补贴100",
        date: "2025-02-15 12:00",
        drama: ["流氓叙事"],
        missing_roles: ["缪宏谟", "以撒"],
        role: ["程聿怀"],
        shop_name: "momo",
      },
      {
        id: '2',
        is_full: false,
        comment: "阮哲带人",
        date: "2025-02-23 12:00",
        drama: ["牧神午后"],
        missing_roles: ["阮哲", "央拉", '达瓦', '炬'],
        role: ["换青"],
        shop_name: "有点猫腻",
      },
      {
        id: '3',
        is_full: true,
        comment: "",
        date: "2025-02-28 12:00",
        drama: ["乱春"],
        missing_roles: [],
        role: ["颜无依"],
        shop_name: "有点猫腻",
      }
    ]
  });
});

app.post('/api/selectOne', (req, res) => {
  console.log(req, res)
  // res.json({
  //   code: 200,
  //   data: [
  //     { id: 1, name: '乱春', comment: 'Content 1', man: 3, women: 3, role: '颜无依' },
  //     { id: 2, name: '流氓叙事', comment: 'Content 2', man: 3, women: 3, role: '程聿怀' }
  //   ]
  // });
});

app.post('/api/getConstData', (req, res) => {
  console.log('Request Body:', req.body);

  // 示例响应数据
  const responseData = {
    code: 200,
    data: [
      { id: 1, name: '乱春', comment: 'Content 1', man: 3, women: 3, role: '颜无依' },
      { id: 2, name: '流氓叙事', comment: 'Content 2', man: 3, women: 3, role: '程聿怀' }
    ]
  };

  // 返回 JSON 响应
  res.json(responseData);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});