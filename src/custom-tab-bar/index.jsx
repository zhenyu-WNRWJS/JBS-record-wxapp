import styles from './index.less'
import { View, Text } from '@tarojs/components'
import { Tabbar } from '@nutui/nutui-react-taro'
import { Cart, Category, AddRectangle, Home, User } from '@nutui/icons-react-taro'
import { footerTabs } from './index.json'
import { useState } from 'react'
import Taro from '@tarojs/taro';

export default function MyFooter({ tab }) {

  // const [value, setValue] = useState('1')

  const onSwitch = (value) => {
    // setValue(value)
    console.log(value)
    const tab = footerTabs.find((t) => t.name == value)
    console.log(tab)
    Taro.switchTab({ url: tab.url })
  }

  return (<View>
    <Tabbar value={tab} fixed safeArea onSwitch={onSwitch} defaultValue={0}>
      {
        footerTabs.map((t) =>
          <Tabbar.Item icon={t.icon} />
        )
      }
    </Tabbar>
  </View>)
} 