import React, { useState, useRef } from 'react'
import { View } from '@tarojs/components'
import { Button, Form, Menu, Input, Switch } from '@nutui/nutui-react-taro'
import moment from 'moment'
import { formateDayOfWeek } from '../../utils/index'
import MyMatchList from '../../components/MyMatchList'
import Taro, { useDidShow } from '@tarojs/taro';
import { fieldReq } from '../../common/index'
import './index.less'
import { useUpdateEffect } from 'ahooks';

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
          limit: limit,
          ...searchParams
        }
      })
      if (result.result.error) {
        console.error('云函数调用失败', result.result.error)
      } else {
        const data = result.result.dataSource
        setOldDataSource(data)
        onDataSourceChange(data, tab2value, searchParams)
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
  }

  useDidShow(() => {
    fetchListData(tab2value)
  })

  const onBtnClick = () => {
    let data = ``
    dataSource.map((d, i) => {
      data += `🆘 ${moment(d.date).format('MM.DD HH:ss')} ${formateDayOfWeek(moment(d.date).day())} ${d.shopName} = ${d.missingRoles.join('+')} ${d.comment ? `(${d.comment})` : ''}`
      if (i + 1 < dataSource.length) {
        data += `\n`
      }
    })

    Taro.setClipboardData({
      data: data
    })
  }

  const [searchParams, setSearchParams] = useState({
    shopName: '',
    drama: '',
    isOverTime: false
  })

  const [options] = useState([
    { text: '全部场次', value: '0' },
    { text: '在拼场次', value: '1' },
    { text: '已满场次', value: '2' },
  ])
  const itemRef = useRef(null)
  const [form] = Form.useForm()

  const onFinish = (values) => {
    // console.log(values);
    const { shopName: shopName = '', drama: drama = '', isOverTime: isOverTime = false } = values
    // console.log('shopName', shopName, 'drama', drama, 'isOverTime', isOverTime);
    setSearchParams({
      ...searchParams,
      shopName,
      drama,
      isOverTime
    });
    onDataSourceChange(oldDataSource, tab2value, {
      ...searchParams,
      shopName,
      drama,
      isOverTime
    });
    (itemRef.current)?.toggle(false);
  }

  function fuzzySearch(data, query) {
    const { shopName, drama } = query;

    // 创建正则表达式，用于模糊匹配
    const shopNameRegex = new RegExp(shopName, 'i'); // 'i' 表示忽略大小写
    const dramaRegex = new RegExp(drama, 'i'); // 'i' 表示忽略大小写

    return data.filter(item => {
      const shopNameMatch = shopNameRegex.test(item.shopName);
      const dramaMatch = dramaRegex.test(item.drama);
      return shopNameMatch && dramaMatch;
    });
  }

  const onDataSourceChange = (list, status, extra) => {
    // const { shopName: shopName = '', drama: drama = '' } = extra
    let dataSource = []
    if (status === '0') {
      dataSource = fuzzySearch([...list], extra)
    } else if (status === '1') {
      dataSource = fuzzySearch(list.filter((l) => l.missingRoles.length > 0), extra)
    } else if (status === '2') {
      dataSource = fuzzySearch(list.filter((l) => l.missingRoles.length == 0), extra)
    } else {
      dataSource = fuzzySearch([...list], extra)
    }
    setDataSource(dataSource)
  }

  // useUpdateEffect(() => {
  //   fetchListData(tab2value)
  // }, [searchParams])

  return (
    <View className={'match-list'}>
      <Menu
        style={{
          position: 'sticky', top: '0px', zIndex: 11,
          '--nutui-menu-content-max-height': 'none',
          // '--nutui-menu-content-padding':'0px'
        }}
      >
        <Menu.Item
          options={options}
          defaultValue={'0'}
          value={tab2value}
          onChange={(item) => {
            console.log(item)
            onDataSourceChange(oldDataSource, item.value, searchParams)
            setTab2value(item.value)
          }} />
        <Menu.Item title="筛选" ref={itemRef}>
          <Form
            form={form}
            onFinish={(values) => onFinish(values)}
            style={{ '--nutui-form-item-label-width': '120px' }}
            footer={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Button nativeType="submit" type="primary">
                  确定
                </Button>
                <Button nativeType="reset" style={{ marginLeft: '20px' }}>
                  重置
                </Button>
              </div>
            }>
            <Form.Item label="店铺" name="shopName" >
              <Input placeholder="请输入店铺名称" type="text" />
            </Form.Item>
            <Form.Item label="剧本名" name="drama" >
              <Input placeholder="请输入剧本名" type="text" />
            </Form.Item>
            {/* <Form.Item label="是否过期" name="isOverTime" valuePropName="checked">
              <Switch />
            </Form.Item> */}
          </Form>
        </Menu.Item>
      </Menu>
      <MyMatchList dataSource={dataSource} actionDel={delListData} onRefresh={() => fetchListData(tab2value)} />
      {tab2value === '1' && <View className={'btn'}>
        <Button type="primary" onClick={onBtnClick} onRefresh={() => fetchListData(tab2value)}>
          复制拼本信息
        </Button>
      </View>}
    </View>
  )
}

export default List
