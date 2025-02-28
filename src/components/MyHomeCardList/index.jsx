import './index.less'
import { View } from '@tarojs/components'
import moment from 'moment'
import { Space, Tag, Image, Divider } from '@nutui/nutui-react-taro'
import { formateDayOfWeek } from '../../utils/index'
import { Alarm, Order, Shop, Del } from '@nutui/icons-react-taro'

export default function MyHomeCardList({ dataSource }) {

  const onHomeListItemLongClick = (item) => {
    console.log('item',item)
    Taro.navigateTo({
      url: `/pages/Edit/index?id=${item._id}`
    })
  }

  return (<View className={'jb-list'}>
    {
      dataSource.map((d) => (
        <View className={'jb-list-item'} on onLongClick={() => onHomeListItemLongClick(d)} >
          <Image src={d.url} width={74} mode={'widthFix'} />
          <Divider direction="vertical" style={{ height: '100%' }} />
          <View className={'list-item-box'}>
            <View className={'list-item-header'}>
              <View className={'title'}>
                <View className={'date'}>
                  <View className={'time'}>
                    {moment(d.date).format('MM-DD HH:ss')}
                  </View>
                  <View className={'weekday'}>{formateDayOfWeek(moment(d.date).day())}</View>
                </View>
              </View>
            </View>
            <View className={'shop-name'}>
              <Shop size={12} style={{ marginRight: 2 }} />
              {d.shopName}
            </View>
            <Space>
              {d.missingRoles.map((m) =>
                <Tag type="info">{m}</Tag>)}
            </Space>
            <View className={'list-item-content'}>
              {
                d.comment && <View className={'comment'}>{d.comment}</View>
              }
            </View>
          </View>
        </View>

      ))
    }
  </View>)
} 