import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { Button, Tabs } from '@nutui/nutui-react-taro'
import moment from 'moment'
import { formateDayOfWeek } from '../../utils/index'
import MyMatchList from '../../components/MyMatchList'
import Taro, { useDidShow } from '@tarojs/taro';
import { fieldReq } from '../../common/index'
import './index.less'

const marginStyle = { margin: '0 auto' }
function List() {

  const [dataSource, setDataSource] = useState([])
  const [oldDataSource, setOldDataSource] = useState([])
  const [tab2value, setTab2value] = useState('0')

  const fetchListData = async (tab2value) => {
    const limit = 100 // 设置每次查询返回的记录数为100

    try {
      const result = await Taro.cloud.callFunction({
        name: 'fetchListData',
        data: {
          tab2value,
          fieldReq: fieldReq,
          limit: limit
        }
      })
      if (result.result.error) {
        console.error('云函数调用失败', result.result.error)
      } else {
        const data = result.result.dataSource
        setOldDataSource(data)
        setDataSource(data)
      }
    } catch (err) {
      console.error('云函数调用失败', err)
    }
  }

  const delListData = async (id) => {
    try {
      const result = await Taro.cloud.callFunction({
        name: 'deleteSession',
        data: {
          id,
        },
      })
      if (result.result.error) {
        console.error('云函数调用失败', result.result.error)
      } else {
        const data = result.result.data
        // console.log(res.data)
        Taro.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            fetchListData(tab2value)
          }
        })
      }
    } catch (err) {
      console.error('云函数调用失败', err)
    }


    // db.collection('sessionInfo').doc(id).remove({
    //   success: function (res) {
    //     console.log(res.data)
    //     Taro.showToast({
    //       title: '删除成功',
    //       icon: 'success',
    //       duration: 2000,
    //       success: () => {
    //         fetchListData(tab2value)
    //       }
    //     })
    //   }
    // })
  }

  // useEffect(() => {
  //   fetchListData()
  // }, [])

  useDidShow(() => {
    console.log('显示了')
    fetchListData(tab2value)
  })
  // F
  // useDidHide(() => {
  //   console.log('隐藏了')
  // })

  const onBtnClick = () => {
    let data = ``
    dataSource.map((d, i) => {
      data += `🆘 ${moment(d.date).format('MM-DD HH:ss')} ${formateDayOfWeek(moment(d.date).day())} ${d.shopName} = ${d.missingRoles.join('+')} ${d.comment ? `(${d.comment})` : ''}`
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
          <MyMatchList dataSource={dataSource} actionDel={delListData} />
        </View>
      </Tabs.TabPane>
      <Tabs.TabPane title="在拼">
        <View className={'match-list'}>
          <MyMatchList dataSource={dataSource} />
          <View className={'btn'}>
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
