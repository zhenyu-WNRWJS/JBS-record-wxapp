import React, { useEffect, useState, useRef } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, ConfigProvider, TextArea, Dialog, CalendarCard, VirtualList } from '@nutui/nutui-react-taro'
import { getMockList } from './api'
import MyCalendar from '../../components/MyCalendar'
import './index.less'

const pbStatus = ['🆘', '🈵']

function Add() {
  const [list, setList] = useState([])
  const fetchListData = async () => {
    const res = await getMockList()
    console.log(res)
    setList(res.data)
  };
  useEffect(() => {
    fetchListData()
  }, [])
  return (
    <View className='home'>
      <View className="home-top">
        <MyCalendar />
      </View>
      <View className={'home-main'}>
        <View className={'jb-list'}>
          {
            list.map((l) => (
              <View id={`list-${l.id}`} className={'jb-list-item'}>
                <View className={'list-item-header'}>
                  <View className={'icon'}>{pbStatus[l.id - 1]}</View>
                  <View className={'title'}>{l.name}</View>
                </View>
                <View className={'list-item-content'}>
                  {l.comment}
                </View>
              </View>
            ))
          }
        </View>
      </View>

    </View>
  )
}

export default Add

