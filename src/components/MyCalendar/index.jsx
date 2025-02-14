import './index.less'
import { View } from '@tarojs/components'
import moment from 'moment'
import { ArrowLeft, ArrowRight } from '@nutui/icons-react-taro'
import { Space, Button, Image } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import src from '../../images/JBPhoto/luanchun.jpg'

const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
export default function MyCalendar() {
  // const currentDate = moment();
  // const daysInMonth = currentDate.daysInMonth(); // 获取当前月份的天数
  // const firstDayOfWeek = currentDate.startOf('month').day(); // 获取当前月份第一天是星期几
  // const currentDayofMonth = moment().date()

  const [currentDate, setCurrentDate] = useState(moment());
  const daysInMonth = currentDate.daysInMonth(); // 获取当前月份的天数
  const firstDayOfWeek = currentDate.startOf('month').day(); // 获取当前月份第一天是星期几
  const currentDayOfMonth = moment().date(); // 获取当前是本月的第几天

  const onAClick = (type) => {
    if (type == 'left') {
      setCurrentDate(currentDate.clone().subtract(1, 'month'));
    }
    if (type == 'right') {
      setCurrentDate(currentDate.clone().add(1, 'month'));
    }
  }
  const renderDayNow = (index) => {
    const now = moment()
    if (currentDate.format('YYYY-MM') == now.format('YYYY-MM') && currentDayOfMonth == index + 1) {
      return 'day-now'
    }
    return ''
  }
  // const src = '../../images/JBPhoto/luanchun.jpg'
  return (<View className="calendar">
    <View className={'calendar-header'}>
      <Space align={'center'} justify={'center'}>
        <ArrowLeft size={14} onClick={() => onAClick('left')} />
        <View>{currentDate.format('YYYY年MM月')}</View>
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
        {[...Array(firstDayOfWeek)].map((_, index) => (
          <View key={index} className="empty-day"></View>
        ))}
        {[...Array(daysInMonth)].map((_, index) => (
          <View className={`day-item `}>
            {/* <View key={index} className={`day-num ${renderDayNow(index)}`}> */}
            {index + 1}

            {/* </View> */}
            {/* <Image src={src} height={80} /> */}
          </View>

        ))}
      </View>
    </View>

  </View>)
} 