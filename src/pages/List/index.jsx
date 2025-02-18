import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { Button, Tabs, } from '@nutui/nutui-react-taro'
import moment from 'moment'
import { formateDayOfWeek } from '../../utils/index'
import './index.less'
import MyMatchList from '../../components/MyMatchList'
import Taro from '@tarojs/taro';
import { getMockList } from './api'

// const old_dataSource = [
//   {
//     is_full: false,
//     comment: "各补贴100",
//     date: "2025-02-15 12:00",
//     drama: ["流氓叙事"],
//     missing_roles: ["缪宏谟", "以撒"],
//     role: ["程聿怀"],
//     shop_name: "momo",
//   },
//   {
//     is_full: false,
//     comment: "阮哲带人",
//     date: "2025-02-23 12:00",
//     drama: ["牧神午后"],
//     missing_roles: ["阮哲", "央拉", '达瓦', '炬'],
//     role: ["换青"],
//     shop_name: "有点猫腻",
//   },
//   {
//     is_full: true,
//     comment: "",
//     date: "2025-02-28 12:00",
//     drama: ["乱春"],
//     missing_roles: [],
//     role: ["颜无依"],
//     shop_name: "有点猫腻",
//   }
// ]
const marginStyle = { margin: '0 auto' }
function List() {

  const [dataSource, setDataSource] = useState([])
  const [oldDataSource, setOldDataSource] = useState([])
  const [tab2value, setTab2value] = useState('0')

  const fetchListData = async () => {
    const res = await getMockList()
    console.log(res)
    setDataSource(res.data)
    setOldDataSource(res.data)
  };
  useEffect(() => {
    fetchListData()
  }, [])

  const onBtnClick = () => {
    let data = ``
    dataSource.map((d, i) => {
      data += `🆘 ${moment(d.date).format('MM-DD hh:ss')} ${formateDayOfWeek(moment(d.date).day())} ${d.shop_name} = ${d.missing_roles.join('+')} (${d.comment})`
      if (i + 1 < dataSource.length) {
        data += `\n`
      }
    })

    Taro.setClipboardData({
      data: data
    })
  }

  return (
    <Tabs
      value={tab2value}
      tabStyle={{ position: 'sticky', top: '0px', zIndex: 11 }}
      autoHeight
      style={{ '--nutui-tabs-tabpane-padding': '0px' }}
      onChange={(value) => {
        if (value === 0) {
          setDataSource(oldDataSource)
        } else if (value === 1) {
          setDataSource(oldDataSource.filter((d) => d.is_full === false))
        } else {
          setDataSource(oldDataSource.filter((d) => d.is_full === true))
        }
        console.log(value)
        setTab2value(value)
      }}
      activeType={'card'}
    >
      <Tabs.TabPane title="全部">
        <View className={'match-list'}>
          <MyMatchList dataSource={dataSource} />
        </View>
      </Tabs.TabPane>
      <Tabs.TabPane title="在拼">
        <View className={'match-list'}>
          <MyMatchList dataSource={dataSource} />
          <View>
            <Button type="primary" style={marginStyle} onClick={onBtnClick}>
              复制拼本信息
            </Button>
          </View>

        </View>

      </Tabs.TabPane>
      <Tabs.TabPane title="已满">
        <View className={'match-list'}>
          <MyMatchList dataSource={dataSource} />
        </View>
      </Tabs.TabPane>
    </Tabs>

  )
}

export default List
