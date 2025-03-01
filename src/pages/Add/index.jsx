import React, { useState, useEffect } from 'react'
import { View } from '@tarojs/components'
import { Form, Input, Dialog, DatePicker, Cell, Checkbox, Picker, Button, Switch, TextArea } from '@nutui/nutui-react-taro'
import { Checklist, ArrowRight } from '@nutui/icons-react-taro'
import MySearchBar from '../../components/MySearchBar'
import Taro, { useDidShow } from '@tarojs/taro';
import useCallFunction from '../../hooks/useCallFunction'
import './index.less'

const defaultValue = new Date()
const defaultDescription = `${defaultValue.getFullYear()}-${defaultValue.getMonth() + 1
  }-${defaultValue.getDate()}`

function Add() {
  const [form] = Form.useForm()
  const [checked] = useState(false)
  const [show, setShow] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [missingRoles, setMissingRoles] = useState([])

  useDidShow(() => {
    form.resetFields()
  })

  const { loading, run } = useCallFunction('addSession', {
    success: (result) => {
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

  const submitSucceed = async (values) => {
    // console.log(values)
    run({
      ...values,
      date: new Date(values.date),
      isFull: values.missingRoles.length == 0
    })
  }

  const onDateConfirm = (values, options) => {
    const date = values.slice(0, 3).join('-')
    const time = values.slice(3).join(':')
    form.setFieldValue('date', `${date} ${time}`)
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
  const [visible, setVisible] = useState(false)
  const onSearchBarChange = (value, item) => {
    form.setFieldsValue({
      missingRoles: []
    })
    setRoleList(item.roles.map((o) => ({ text: o, value: o })))
    setMissingRoles(item.roles)
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
              <Button loading={loading} nativeType="submit" type="primary">
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
            rules={[
              { required: true, message: '请选择剧本' },
            ]}
            onClick={() => setVisible(true)}
          >
            <MySearchBar
              visible={visible}
              setVisible={setVisible}
              placeholder={"请选择剧本"}
              onChange={onSearchBarChange}
            />
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
