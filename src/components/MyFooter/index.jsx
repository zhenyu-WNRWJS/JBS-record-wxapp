import styles from './index.less'
import { View, Text } from '@tarojs/components'
import { Tabbar } from '@nutui/nutui-react-taro'
import { Date, Category, AddRectangle, Home, User } from '@nutui/icons-react-taro'
// import { footerTabs } from '../../common/index'
import { useState } from 'react'
import Taro from '@tarojs/taro';

const footerTabs = [
  {
    name: '0',
    url: '/pages/Home/index',
    title: '首页',
    // icon: <Home size={20} />
  },
  {
    name: '1',
    url: '/pages/List/index',
    title: '拼场列表',
    // icon: <Date size={20} />
  },
  {
    name: '2',
    url: '/pages/Add/index',
    title: '添加信息',
    // icon: <AddRectangle color={'red'} size={28} />
  },
  {
    name: '3',
    url: '/pages/History/index',
    title: '打本记录',
    // icon: <Category size={20} />
  },
  {
    name: '4',
    url: '/pages/My/index',
    title: '我的',
    // icon: <User size={20} />
  },
]

export default function MyFooter({ tab }) {

  // const [value, setValue] = useState('1')

  const onSwitch = (value) => {
    // setValue(value)
    console.log(value)
    const tab = footerTabs.find((t) => t.name == value)
    console.log(tab)
    Taro.switchTab({ url: tab.url })
  }

  const renderIcon = (name, tab) => {
    if (name == '0')
      return <Home size={20} color={tab == name ? 'red' : ''} />
    if (name == '1')
      return <Date size={20} color={tab == name ? 'red' : ''} />
    if (name == '2')
      return <AddRectangle color={'red'} size={28} />
    if (name == '3')
      return <Category size={20} color={tab == name ? 'red' : ''} />
    if (name == '4')
      return <User size={20} color={tab == name ? 'red' : ''} />
  }

  return (<View>
    <Tabbar value={tab} fixed safeArea onSwitch={onSwitch} defaultValue={0}>
      {
        footerTabs.map((t) =>
          <Tabbar.Item icon={renderIcon(t.name, tab)} />
        )
      }
    </Tabbar>
  </View>)
} 