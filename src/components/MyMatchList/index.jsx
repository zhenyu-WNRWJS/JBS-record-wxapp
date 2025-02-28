import './index.less'
import { View, Text } from '@tarojs/components'
import moment from 'moment'
import { Space, Tag, Swipe } from '@nutui/nutui-react-taro'
import { formateDayOfWeek } from '../../utils/index'
import { Alarm, Order, Shop, Del } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro';

export default function MyMatchList({ dataSource, actionDel }) {

  const onDivNodeClick = (text, item) => {
    if (text == '编辑') {
      Taro.navigateTo({
        url: `/pages/Edit/index?id=${item._id}`
      })
    }
    if (text == '删除') {
      actionDel(item._id)
    }
  }

  const divNode = (text, style, item) => {
    return (
      <div
        style={{
          width: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          ...style,
        }}
        onClick={() => onDivNodeClick(text, item)}
      >
        {/* <Del style={{ marginBottom: '6px' }} /> */}
        <>{text}</>
      </div>
    )
  }
  // return <></>
  return (<View className={'jb-list'}>
    {
      dataSource.map((d) => (
        <Swipe
          key={d._id}
          className={'jb-list-item'}
          // style={{ height: '104px' }}
          rightAction={
            <div
              style={{
                height: 'inherit',
                width: '120px',
                display: 'flex',
                fontSize: '12px',
              }}
            >
              <>
                {divNode('编辑', {
                  background: '#F8F8F8',
                  color: '#1A1A1A',
                }, d)}
                {divNode('删除', {
                  background: '#FA2C19',
                  color: '#FFF',
                }, d)}
              </>
            </div>
          }
        >
          <View
          // className={'jb-list-item'}

          >
            <View className={'list-item-header'}>
              {/* <View className={'icon'}>{renderIcon(d)}</View> */}
              <View className={'title'}>
                <View className={'date'}>
                  <View className={'time'}>
                    <Alarm size={16} style={{ marginRight: 2 }} />
                    {moment(d.date).format('MM-DD HH:ss')}
                  </View>
                  <View className={'weekday'}>{formateDayOfWeek(moment(d.date).day())}</View>
                </View>
                <View className={"drama"}>
                  <Order size={16} style={{ marginRight: 2 }} />
                  {d.drama}
                </View>
              </View>
            </View>
            <View className={"list-item-middle-content"}>
              <View className={'shop-name'}>
                <Shop size={12} style={{ marginRight: 2 }} />
                {d.shopName}
              </View>
              <Space>
                {d.missingRoles.map((m) =>
                  <Tag type="info">{m}</Tag>)}
              </Space>

            </View>
            <View className={'list-item-content'}>
              {
                d.comment && <View className={'comment'}>{d.comment}</View>
              }
            </View>
          </View>
        </Swipe>
      ))
    }
  </View>)
} 