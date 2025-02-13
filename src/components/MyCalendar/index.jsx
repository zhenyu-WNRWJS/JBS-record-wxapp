import './index.less'
import { View } from '@tarojs/components'
import moment from 'moment'
import { ArrowLeft, ArrowRight } from '@nutui/icons-react-taro'
import { Space, Button } from '@nutui/nutui-react-taro'
import { useState } from 'react'

const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
export default function MyCalendar() {

  const [dateObj, setDateObj] = useState({
    currentDate: moment(),
    currentDayofMonth: moment().date(),
    daysInMonth: moment().daysInMonth(),
    firstDayOfWeek: moment().startOf('month').day(),
    YearAndMonth: moment().format('YYYY年MM月')
  })

  // const currentDate = moment();
  // const daysInMonth = currentDate.daysInMonth(); // 获取当前月份的天数
  // const firstDayOfWeek = currentDate.startOf('month').day(); // 获取当前月份第一天是星期几
  // const currentDayofMonth = moment().date()

  const onAClick = (type) => {
    if (type == 'left') {
      
    }
    if (type == 'right') {

    }
  }

  return (<View className="calendar">
    <View className={'calendar-header'}>
      <Space align={'center'} justify={'center'}>
        <ArrowLeft size={14} onClick={() => onAClick('left')} />
        <View>{dateObj.YearAndMonth}</View>
        <ArrowRight size={14} onClick={() => onAClick('right')} />
      </Space>

    </View>
    <View className={'calendar-main'}>
      <View className="header">
        {daysOfWeek.map((day, index) => (
          <View key={index} className="day-of-week">
            {day}
          </View>
        ))}
      </View>
      <View className="days">
        {[...Array(dateObj.firstDayOfWeek)].map((_, index) => (
          <View key={index} className="empty-day"></View>
        ))}
        {[...Array(dateObj.daysInMonth)].map((_, index) => (
          <View className={`day-item `}>
            <View key={index} className={`day-num ${dateObj.currentDayofMonth == index + 1 ? 'day-now' : ''}`}>
              {index + 1}
            </View>
          </View>

        ))}
      </View>
    </View>

  </View>)
} 