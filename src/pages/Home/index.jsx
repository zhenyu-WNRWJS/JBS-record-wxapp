import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { Avatar } from '@nutui/nutui-react-taro'
import MyCalendar from '../../components/MyCalendar'
import MyHomeCardList from '../../components/MyHomeCardList'
import { fieldReq } from '../../common/index'
import moment from 'moment'
import './index.less'

function Add() {

  const [dataSource, setDataSource] = useState([])
  const [filterDataSource, setFilterDataSource] = useState([])
  const [date, setDate] = useState(new Date())
  const [selectDay, setSelectDay] = useState(new Date().getDate())

  const onJinClick = () => {
    onDateChange(new Date())
    onSelectDayChange(moment().date())
  }
  const onDateChange = (date) => setDate(date)
  const onSelectDayChange = (day) => setSelectDay(day)

  const RightExtraNode = () => <View className={'right-extra-node'}>
    <View class="iconfont iconjin" onClick={onJinClick}></View>
    <View className={"avatar"}><Avatar size={'small'}>N</Avatar></View>
  </View>

  const [db] = useState(wx.cloud.database())
  const _ = db.command;

  const fetchListData = async () => {
    const startOfMonth = moment(date).startOf('month').toDate();
    const endOfMonth = moment(date).endOf('month').toDate();
    db.collection('sessionInfo').where({
      date: _.gte(startOfMonth).and(_.lte(endOfMonth))
      // _openid: 'user-open-id',
      // 'style.color': 'yellow'
    }).field(fieldReq).get({
      success: function (res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        // console.log('res.data', res.data)
        setDataSource(res.data)
        setFilterDataSource(res.data.filter((d) => moment(d.date).format('YYYY-MM-DD') == `${moment(date).format('YYYY-MM')}-${selectDay}`))
      }
    })
  };

  useEffect(() => {
    fetchListData()
  }, [moment(date).format('YYYY-MM')])

  useEffect(() => {
    if (selectDay) {
      setFilterDataSource(dataSource.filter((d) => moment(d.date).format('YYYY-MM-DD') == `${moment(date).format('YYYY-MM')}-${selectDay}`))
    }
  }, [selectDay])

  // console.log(`${moment(date).format('YYYY-MM')}-${selectDay}`)
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

