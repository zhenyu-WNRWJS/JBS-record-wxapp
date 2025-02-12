import styles from './index.less'
import { View, Text } from '@tarojs/components'
import { Tabbar } from '@nutui/nutui-react-taro'
import { Cart, Category, AddRectangle, Home, User } from '@nutui/icons-react-taro'

export default function MyFooter() {

  return (<View>
    <Tabbar fixed>
      <Tabbar.Item icon={<Home />} />
      <Tabbar.Item icon={<Category />} />
      <Tabbar.Item icon={<AddRectangle />} />
      <Tabbar.Item icon={<User />} />
    </Tabbar>
  </View>)
} 