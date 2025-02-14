export default defineAppConfig({
  pages: [
    'pages/Home/index',
    'pages/Add/index',
    'pages/List/index',
    'pages/My/index',
    'pages/History/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    // custom: true,
    color: '#000000',
    selectedColor: '#ff0000',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/Home/index',
        text: '',
        iconPath: 'images/calendar.png',
        selectedIconPath: "images/calendar-select.png"
      },
      {
        pagePath: 'pages/Add/index',
        text: '',
        iconPath: 'images/add.png',
        selectedIconPath: "images/add-select.png"
      },
      {
        pagePath: 'pages/List/index',
        text: '',
        iconPath: 'images/list.png',
        selectedIconPath: "images/list-select.png"
      },

      // {
      //   pagePath: 'pages/History/index',
      //   text: '记录',
      //   iconPath: 'images/history.png',
      //   selectedIconPath: "images/history-select.png"
      // },
      // {
      //   pagePath: 'pages/My/index',
      //   text: '我的',
      //   iconPath: 'images/my.png',
      //   selectedIconPath: "images/my-select.png"
      // },
    ],
  },
})
