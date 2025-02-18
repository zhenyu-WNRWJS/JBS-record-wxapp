import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { Form, Input, Radio, DatePicker, Cell, Checkbox, Picker, Button, Switch, TextArea } from '@nutui/nutui-react-taro'
import { mdm0001 } from '../../common/index'
import { Checklist, ArrowRight } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro';
import moment from 'moment'
import './index.less'
import { getConstData } from './api'

const list = mdm0001[0].mdm000102
const options = list.map((l, i) => ({ text: l, value: l }))
const optionsDramaList = [{ text: '流氓叙事', value: '流氓叙事' }]
console.log(options)

function Edit() {

  const fetchConstData = async () => {
    const { res } = await getConstData()
    console.log(res)
  }


  useEffect(() => {
    fetchConstData()
  }, [])


  const [form] = Form.useForm()

  const [checked] = useState(false)
  const [show, setShow] = useState(false)

  const defaultValue = new Date()
  const defaultDescription = `${defaultValue.getFullYear()}-${defaultValue.getMonth() + 1
    }-${defaultValue.getDate()}`

  const submitSucceed = (values) => {
    console.log(values)
  }

  const onDateConfirm = (values, options) => {
    const date = values.slice(0, 3).join('-')
    const time = values.slice(3).join(':')
    form.setFieldValue('date', `${date} ${time}`)
  }

  const onDramaConfirm = (options, value) => {
    console.log(options, value)
    form.setFieldsValue({
      missing_roles: []
    })
  }

  const onRoleConfirm = (options, value) => {
    console.log(options, value)
    // const flag = (form.getFieldValue('missing_roles') ?? []).findIndex((i)=>i == va)
    const new_missing_roles = (form.getFieldValue('missing_roles') ?? []).filter((i) => i != value)
    form.setFieldsValue({
      missing_roles: new_missing_roles
    })
  }

  const onSwitchChange = (value) => {
    form.setFieldsValue({
      missing_roles: []
    })
  }

  return (
    <View className={'add'}>
      <View className={'form'}>
        <Form
          form={form}
          onFinish={(values) => submitSucceed(values)}
          style={{ '--nutui-form-item-label-width': '80px' }}
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
          initialValues={{
            is_full: false
          }}
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
          <Form.Item label="店铺" name="shop_name" rules={[
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
              options={optionsDramaList}
              onConfirm={onDramaConfirm}
            >
              {(values) => <Input value={values.length
                ? optionsDramaList.filter((po) => po.value === values[0])[0]
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
              options={options}
              onConfirm={onRoleConfirm}
            >
              {(values) => <Input value={values.length
                ? options.filter((po) => po.value === values[0])[0]
                  ?.text
                : ''} placeholder="请选择角色" type="text" readOnly />}
            </Picker>
          </Form.Item>
          <Form.Item label="是否满车" name="is_full" valuePropName="checked">
            <Switch onChange={onSwitchChange} />
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => {
              const is_full = getFieldValue('is_full')
              if (is_full) return null
              return (
                <Form.Item label="缺少角色" name="missing_roles">
                  <Checkbox.Group direction={'horizontal'}>
                    {
                      list.map((l) => <Checkbox
                        disabled={form.getFieldValue('role') == l}
                        value={l}
                        style={{ marginInlineEnd: '8px' }}
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

export default Edit
