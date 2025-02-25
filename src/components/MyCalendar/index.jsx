import './index.less'
import { View } from '@tarojs/components'
import moment from 'moment'
import { ArrowLeft, ArrowRight } from '@nutui/icons-react-taro'
import { Space, DatePicker, Image } from '@nutui/nutui-react-taro'
import { useState, useEffect, useMemo } from 'react'

const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
export default function MyCalendar({ date, onChange, selectDay, onSelectDayChange, leftExtraNode, RightExtraNode, images }) {
  // console.log(images)
  const renderExtraNode = (type) => {
    if (leftExtraNode && type == 'left')
      return leftExtraNode()
    if (RightExtraNode && type == 'right')
      return RightExtraNode()
    return <View style={{ width: '66px' }}></View>
  }

  const daysInMonth = useMemo(() => {
    return moment(date).daysInMonth()  // 获取当前月份的天数
  }, [date])
  const firstDayOfWeek = useMemo(() => {
    return moment(date).startOf('month').day()  // 获取当前月份第一天是星期几
  }, [date])

  // const currentDayOfMonth = moment().date(); // 获取当前是本月的第几天
  const renderDayNow = (index) => {
    const now = moment()
    const item = images.find((i) => i.key == index)
    const text = moment(date).format('YYYY-MM') == now.format('YYYY-MM') && moment().date() == index ? '今' : index
    return <View className={'item-url-content'}>
      <View className={'item-url-num'}>{text}</View>
      {item && <Image src={item.url} width={'100%'} height={'100%'} mode={'aspectFill'} style={{ borderRadius: '10px' }} />}
    </View>

  }
  const renderSelect = (index) => selectDay == index ? 'day-select' : ''

  const onDayItemClick = (index) => onSelectDayChange(index)

  useEffect(() => {
    if (date) {
      setDesc(`${date.getFullYear()}.${date.getMonth() + 1}`)
    }
  }, [date])

  const [desc, setDesc] = useState('')
  const [show, setShow] = useState(false)

  const onDateConfirm = (options, values) => {
    const v = values.join('/')
    onChange(new Date(v))
  }

  const onAClick = (type) => {
    if (type == 'left') {
      onChange(new Date(moment(date).subtract(1, 'month').format('YYYY-MM')));
    }
    if (type == 'right') {
      onChange(new Date(moment(date).add(1, 'month').format('YYYY-MM')));
    }
  }

  return (<View className="calendar">
    <View className={'calendar-header'}>
      {renderExtraNode('left')}
      <Space align={'center'} justify={'center'}>
        <ArrowLeft size={16} onClick={() => onAClick('left')} />
        <View onClick={() => setShow(true)}>{desc}</View>
        <DatePicker
          type="year-month"
          title="日期选择"
          visible={show}
          defaultValue={new Date(`${moment().format('YYYY-MM')}`)}
          value={date}
          showChinese
          onClose={() => setShow(false)}
          threeDimensional={false}
          onConfirm={(options, values) => onDateConfirm(options, values)}
        />

        <ArrowRight size={16} onClick={() => onAClick('right')} />
      </Space>
      {renderExtraNode('right')}

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
          <View className={`day-item `} onClick={() => onDayItemClick(index + 1)}>
            <View key={index} className={`day-num ${renderSelect(index + 1)}`}>
              {renderDayNow(index + 1)}
            </View>
          </View>

        ))}
      </View>
    </View>

  </View>)
} 