import React, { useEffect } from 'react'
import { useDidShow, useDidHide } from '@tarojs/taro'
import { ConfigProvider } from '@nutui/nutui-react-taro'
// 全局样式
import './app.less';
// import './assets/iconfont.css';/
// import '../../assets/font/iconfont.css'
// if (process.env.NODE_ENV === 'development') {
//   import('./mock/index').then(mock => {
//     // 使用 Mock
//     console.log(mock)
//   });
// }
import './mock/index'

// 如果是下载 SDK 的方式，改成 const { init } = require('./wxCloudClientSDK.umd.js')
const { init } = require("@cloudbase/wx-cloud-client-sdk");

// 指定云开发环境 ID
wx.cloud.init({
  env: "jubenxiaoji-cloud-2el1jd41012861", // 当前的云开发环境 ID
});

const client = init(wx.cloud);
const models = client.models; // 或者也可以直接从 wx.cloud.models 上获取，这种方式的类型提示会弱一些

function App(props) {
  // 可以使用所有的 React Hooks
  useEffect(() => { })

  // 对应 onShow
  useDidShow(() => { })

  // 对应 onHide
  useDidHide(() => { })

  return props.children
}

export default App
