import React, { useEffect } from 'react'
import { useDidShow, useDidHide } from '@tarojs/taro'
import { ConfigProvider } from '@nutui/nutui-react-taro'
// 全局样式
import './app.less'
// import '../../assets/font/iconfont.css'
// if (process.env.NODE_ENV === 'development') {
//   import('./mock/index').then(mock => {
//     // 使用 Mock
//     console.log(mock)
//   });
// }
import './mock/index'


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
