import {
  Date,
  Category,
  AddRectangle,
  Home,
  User
} from '@nutui/icons-react-taro'

export const footerTabs = [{
    name: '0',
    url: '/pages/Home/index',
    title: '首页',
    icon: < Home size = {
      20
    }
    />
  },
  {
    name: '1',
    url: '/pages/List/index',
    title: '拼场列表',
    icon: < Date size = {
      20
    }
    />
  },
  {
    name: '2',
    url: '/pages/Add/index',
    title: '添加信息',
    icon: < AddRectangle color = {
      'red'
    }
    size = {
      28
    }
    />
  },
  {
    name: '3',
    url: '/pages/History/index',
    title: '打本记录',
    icon: < Category size = {
      20
    }
    />
  },
  {
    name: '4',
    url: '/pages/My/index',
    title: '我的',
    icon: < User size = {
      20
    }
    />
  },
]

export const mdm0001 = [{
  name: '流氓叙事',
  mdm000102: ['程聿怀', '程走柳', '蒋伯驾', '以撒', '缪宏谟', '黛利拉']
}]

export const pbStatus = [{
  value: "0",
  text: '🆘'
}, {
  value: "1",
  text: '🈵'
}]

export const fieldReq = {
  _id: true,
  comment: true,
  date: true,
  drama: true,
  missingRoles: true,
  role: true,
  shopName: true,
  // isFull: true,
}
