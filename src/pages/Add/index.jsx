import React, { useState, useEffect } from 'react'
import { View } from '@tarojs/components'
import { Form, Input, Radio, DatePicker, Cell, Checkbox, Picker, Button, Switch, TextArea } from '@nutui/nutui-react-taro'
import { Checklist, ArrowRight } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro';
import './index.less'

const defaultValue = new Date()
const defaultDescription = `${defaultValue.getFullYear()}-${defaultValue.getMonth() + 1
  }-${defaultValue.getDate()}`

function Add() {

  const [db] = useState(wx.cloud.database())
  const [form] = Form.useForm()
  const [checked] = useState(false)
  const [show, setShow] = useState(false)
  const [dramaList, setDramaList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [missingRoles, setMissingRoles] = useState([])

  useEffect(() => {
    fetchDramaInfo()
  }, [])

  const fetchDramaInfo = async () => {
    db.collection('dramaInfo').get({
      success: function (res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        // console.log(res.data)
        const list = res.data.map((r) => ({ text: r.name, value: r.name, roles: r.roles }))
        setDramaList(list)
      }
    })
  };

  const submitSucceed = (values) => {
    // console.log(values)
    db.collection('sessionInfo').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        ...values,
        date: new Date(values.date),
        isFull: values.missingRoles.length == 0
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        // console.log(res)
        Taro.showToast({
          title: '添加拼场成功',
          icon: 'success',
          duration: 2000
        })
        form.resetFields()
        setRoleList([])
        setMissingRoles([])
      }
    })
  }

  const onDateConfirm = (values, options) => {
    const date = values.slice(0, 3).join('-')
    const time = values.slice(3).join(':')
    form.setFieldValue('date', `${date} ${time}`)
  }

  const onDramaConfirm = (options, value) => {
    // console.log(options, value, options[0].roles)
    form.setFieldsValue({
      missingRoles: []
    })
    setRoleList(options[0].roles.map((o) => ({ text: o, value: o })))
    setMissingRoles(options[0].roles)
  }

  const onRoleConfirm = (options, value) => {
    // console.log(options, value)
    const newMissingRoles = (form.getFieldValue('missingRoles') ?? []).filter((i) => i != value)
    form.setFieldsValue({
      missingRoles: newMissingRoles
    })
  }

  const onSwitchChange = (value) => {
    form.setFieldsValue({
      missingRoles: []
    })
  }

  return (
    <View className={'add'}>
      <View className={'form'}>
        <Form
          form={form}
          onFinish={(values) => submitSucceed(values)}
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
                提交
              </Button>
              <Button nativeType="reset" style={{ marginLeft: '20px' }}>
                重置
              </Button>
            </div>
          }
        >
          <Form.Item label="日期" name="date" onClick={() => setShow(true)} rules={[
            { required: true, message: '请选择日期' },
          ]}>
            <Input placeholder="请选择日期" type="text" readOnly />
          </Form.Item>
          <DatePicker
            title="日期时间选择"
            // startDate={startDate}
            // endDate={endDate}
            defaultValue={new Date(`${defaultDescription} 12:00`)}
            visible={show}
            type="datetime"
            onClose={() => setShow(false)}
            onConfirm={(options, values) => onDateConfirm(values, options)}
          />
          <Form.Item label="店铺" name="shopName" rules={[
            { required: true, message: '请输入店铺名称' },
          ]}>
            <Input placeholder="请输入店铺名称" type="text" />
          </Form.Item>
          <Form.Item
            label="剧本名"
            name="drama"
            trigger="onConfirm"
            onClick={(event, ref) => {
              ref.open()
            }}
            getValueFromEvent={(...args) => args[1]}
            rules={[
              { required: true, message: '请选择剧本' },
            ]}
            validateTrigger={['onChange', 'onConfirm']}
          >
            <Picker
              title="请选择剧本"
              options={dramaList}
              onConfirm={onDramaConfirm}
            >
              {(values) => <Input value={values.length
                ? dramaList.filter((po) => po.value === values[0])[0]
                  ?.text
                : ''} placeholder="请选择剧本" type="text" readOnly />}
            </Picker>
          </Form.Item>
          <Form.Item
            label="所玩角色"
            name="role"
            trigger="onConfirm"
            onClick={(event, ref) => {
              ref.open()
            }}
            getValueFromEvent={(...args) => args[1]}
            rules={[
              { required: true, message: '请选择所玩角色' },
            ]}
            validateTrigger={['onChange', 'onConfirm']}
          >
            <Picker
              title="请选择所玩角色"
              options={roleList}
              onConfirm={onRoleConfirm}
            >
              {(values) => <Input value={values.length
                ? roleList.filter((po) => po.value === values[0])[0]
                  ?.text
                : ''} placeholder="请选择角色" type="text" readOnly />}
            </Picker>
          </Form.Item>
          <Form.Item label="是否满车" name="isFull" valuePropName="checked">
            <Switch onChange={onSwitchChange} />
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => {
              const isFull = getFieldValue('isFull')
              if (isFull) return null
              return (
                <Form.Item label="缺少角色" name="missingRoles">
                  <Checkbox.Group direction={'horizontal'}>
                    {
                      missingRoles.map((l) => <Checkbox
                        disabled={form.getFieldValue('role') == l}
                        value={l}
                        style={{ marginInlineEnd: '8px', minWidth: '74px' }}
                        shape="button"
                        activeIcon={
                          <Checklist className="nut-checkbox-button-icon-checked" />
                        }
                        className="test"
                        label={
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                          >
                            <div>{l}</div>
                          </div>
                        }
                        defaultChecked={checked} >{l}</Checkbox>)
                    }
                  </Checkbox.Group>
                </Form.Item>
              )
            }}
          </Form.Item>

          <Form.Item label="备注" name="comment">
            <TextArea
              placeholder="请输入备注"
              style={{ fontSize: '12px' }}
              autoSize
            />
          </Form.Item>
        </Form>
      </View>
    </View>
  )
}

export default Add
