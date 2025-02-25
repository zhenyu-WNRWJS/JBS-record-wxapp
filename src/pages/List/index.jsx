import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { Button, Tabs, } from '@nutui/nutui-react-taro'
import moment from 'moment'
import { formateDayOfWeek } from '../../utils/index'
import MyMatchList from '../../components/MyMatchList'
import Taro, { useDidShow } from '@tarojs/taro';
import { fieldReq } from '../../common/index'
import './index.less'

const marginStyle = { margin: '0 auto' }
function List() {

  const [db] = useState(wx.cloud.database())
  const _ = db.command;

  const [dataSource, setDataSource] = useState([])
  const [oldDataSource, setOldDataSource] = useState([])
  const [tab2value, setTab2value] = useState('0')

  const fetchListData = async (tab2value) => {
    db.collection('sessionInfo').where({
      date: _.gte(moment().startOf('day').toDate())
      // _openid: 'user-open-id',
      // 'style.color': 'yellow'
    }).field(fieldReq).get({
      success: function (res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        // console.log('res.data', res.data)

        if (tab2value === 0) {
          setDataSource(oldDataSource)
        } else if (tab2value === 1) {
          setDataSource(oldDataSource.filter((d) => d.missingRoles.length > 0))
        } else if (tab2value === 2) {
          setDataSource(oldDataSource.filter((d) => d.missingRoles.length == 0))
        } else {
          setDataSource(res.data)
          setOldDataSource(res.data)
        }
      }
    })
  };

  const delListData = (id) => {
    db.collection('sessionInfo').doc(id).remove({
      success: function (res) {
        console.log(res.data)
        Taro.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            fetchListData(tab2value)
          }
        })
      }
    })
  }

  // useEffect(() => {
  //   fetchListData()
  // }, [])

  useDidShow(() => {
    fetchListData(tab2value)
  })

  const onBtnClick = () => {
    let data = ``
    dataSource.map((d, i) => {
      data += `🆘 ${moment(d.date).format('MM-DD hh:ss')} ${formateDayOfWeek(moment(d.date).day())} ${d.shopName} = ${d.missingRoles.join('+')} (${d.comment})`
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
          setDataSource(oldDataSource.filter((d) => d.missingRoles.length > 0))
        } else {
          setDataSource(oldDataSource.filter((d) => d.missingRoles.length == 0))
        }
        // console.log(value)
        setTab2value(value)
      }}
      activeType={'card'}
    >
      <Tabs.TabPane title="全部">
        <View className={'match-list'}>
          <MyMatchList dataSource={dataSource} actionDel={delListData}/>
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
