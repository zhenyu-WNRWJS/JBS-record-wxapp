import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { Avatar } from '@nutui/nutui-react-taro'
import MyCalendar from '../../components/MyCalendar'
import MyHomeCardList from '../../components/MyHomeCardList'
import { fieldReq } from '../../common/index'
import Taro, { useDidShow } from '@tarojs/taro';
import moment from 'moment'
import { useUpdateEffect } from 'ahooks';
import './index.less'

function Add() {

  const [dataSource, setDataSource] = useState([])
  const [filterDataSource, setFilterDataSource] = useState([])
  const [date, setDate] = useState(new Date())
  const [selectDay, setSelectDay] = useState(new Date().getDate())
  const DD = (selectDay + '').length == 1 ? `0${selectDay}` : selectDay
  const onJinClick = () => {
    onDateChange(new Date())
    onSelectDayChange(moment().date())
  }
  const onDateChange = (date) => setDate(date)
  const onSelectDayChange = (day) => setSelectDay(day)

  const RightExtraNode = () => <View className={'right-extra-node'}>
    <View class="iconfont iconjin" onClick={onJinClick}></View>
    {/* <View className={"avatar"}><Avatar size={'small'}>N</Avatar></View> */}
  </View>

  const fetchListData = async () => {
    const limit = 100 // 设置每次查询返回的记录数为100

    try {
      const result = await Taro.cloud.callFunction({
        name: 'fetchHomeData',
        data: {
          date: date,
          fieldReq: fieldReq,
          limit: limit
        }
      })
      if (result.result.error) {
        console.error('云函数调用失败', result.result.error)
      } else {
        const data = result.result.data
        setDataSource(data)
        setFilterDataSource(data.filter((d) => moment(d.date).format('YYYY-MM-DD') == `${moment(date).format('YYYY-MM')}-${DD}`))
      }
    } catch (err) {
      console.error('云函数调用失败', err)
    }
  }

  useDidShow(() => {
    fetchListData()
  })

  useUpdateEffect(() => {
    fetchListData()
  }, [moment(date).format('YYYY-MM')])

  useUpdateEffect(() => {
    if (selectDay) {
      setFilterDataSource(dataSource.filter((d) => moment(d.date).format('YYYY-MM-DD') == `${moment(date).format('YYYY-MM')}-${DD}`))
    }
  }, [selectDay])

  return (
    <View className='home'>
      <View className="home-top">
        <MyCalendar
          date={date}
          onChange={onDateChange}
          selectDay={selectDay}
          onSelectDayChange={onSelectDayChange}
          RightExtraNode={RightExtraNode}
          images={dataSource.filter((d) => d.url).map((d) => ({
            url: d.url,
            key: moment(d.date).date()
          }))}
        />
      </View>
      <View className={'home-main'}>
        <View className={'jb-list'}>
          <MyHomeCardList dataSource={filterDataSource} />
        </View>
      </View>

    </View>
  )
}

export default Add

