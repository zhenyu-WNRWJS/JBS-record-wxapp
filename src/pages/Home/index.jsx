import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { Avatar, Overlay, Loading } from '@nutui/nutui-react-taro'
import MyCalendar from '../../components/MyCalendar'
import MyHomeCardList from '../../components/MyHomeCardList'
import { fieldReq } from '../../common/index'
import Taro, { useDidShow } from '@tarojs/taro';
import moment from 'moment'
import { useUpdateEffect } from 'ahooks';
import useCallFunction from '../../hooks/useCallFunction'
import MyOverlay from '../../components/MyOverlay'
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

  const { loading, run: fetchListData } = useCallFunction('fetchHomeData', {
    data: {
      date: date,
      fieldReq: fieldReq,
      limit: 100
    },
    success: (result) => {
      const data = result.data
      setDataSource(data)
      setFilterDataSource(data.filter((d) => moment(d.date).format('YYYY-MM-DD') == `${moment(date).format('YYYY-MM')}-${DD}`))
    }
  })

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
      <MyOverlay loading={loading} />
    </View>
  )
}

export default Add

