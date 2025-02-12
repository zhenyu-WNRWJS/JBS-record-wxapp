import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, ConfigProvider, TextArea, Dialog, CalendarCard } from '@nutui/nutui-react-taro'
import enUS from '@nutui/nutui-react-taro/dist/locales/en-US'
import zhCN from '@nutui/nutui-react-taro/dist/locales/zh-CN'
import './index.less'
import MyCalendar from '../../components/MyCalendar/index'
import MyFooter from '../../components/Myfooter'

function History() {
  // const [locale, setLocale] = useState(zhCN)
  // const localeKey = locale === zhCN ? 'zhCN' : 'enUS'
  // const [visible, setVisible] = useState(false)
  // const [translated] = useState({
  //   zhCN: {
  //     welcome: '欢迎使用 NutUI React 开发 Taro 多端项目。',
  //     button: '使用英文',
  //     open: '点击打开',
  //   },
  //   enUS: {
  //     welcome: 'Welcome to use NutUI React to develop Taro multi-terminal projects.',
  //     button: 'Use Chinese',
  //     open: 'Click Me',
  //   },
  // })
  // const handleSwitchLocale = () => {
  //   setLocale(locale === zhCN ? enUS : zhCN)
  // }
  // const date = new Date('2023-01-01')
  // const onChange = (val) => {
  //   console.log(val)
  // }

  return (
    // <ConfigProvider theme={darkTheme}>
    <View style={{ height: '100vh' }}>
      {/* <MyFooter tab={'1'}/> */}
    </View>
    // </ConfigProvider>
    // <ConfigProvider locale={locale}>
    //   <View className='nutui-react-demo'>
    //     <View>{translated[localeKey].welcome}</View>
    //     <View>
    //       <Button type='primary' onClick={handleSwitchLocale}>
    //         {translated[localeKey].button}
    //       </Button>
    //       <Button type='success' onClick={() => setVisible(true)}>
    //         {translated[localeKey].open}
    //       </Button>
    //       <Dialog
    //         visible={visible}
    //         onConfirm={() => setVisible(false)}
    //         onCancel={() => setVisible(false)}>
    //         {translated[localeKey].welcome}
    //       </Dialog>
    //       <TextArea disabled showCount maxLength={20} />
    //     </View>
    //     <MyCalendar />
    //   </View>
    // </ConfigProvider>
  )
}

export default History
