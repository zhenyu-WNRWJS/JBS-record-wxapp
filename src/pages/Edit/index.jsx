import React, { useState, useEffect } from 'react'
import { View } from '@tarojs/components'
import { Form, Input, DatePicker, Dialog, Checkbox, Picker, Button, Switch, TextArea } from '@nutui/nutui-react-taro'
import { Checklist, ArrowRight } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro';
import MySearchBar from '../../components/MySearchBar'
import { fieldReq } from '../../common/index'
import moment from 'moment'
import './index.less'

const defaultValue = new Date()
const defaultDescription = `${defaultValue.getFullYear()}-${defaultValue.getMonth() + 1
  }-${defaultValue.getDate()}`

function Edit() {
  const [router] = useState(Taro.getCurrentInstance().router.params)
  const id = router.id
  const [db] = useState(wx.cloud.database())
  const [form] = Form.useForm()
  const [checked] = useState(false)
  const [show, setShow] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [missingRoles, setMissingRoles] = useState([])

  useEffect(() => {
    fetchSessionInfo()
  }, [])

  const fetchSessionInfo = () => {
    db.collection('sessionInfo').doc(id).field({ ...fieldReq, isFull: true, _id: false }).get({
      success: function (res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        console.log(res.data)
        form.setFieldsValue({
          ...res.data,
          isFull: res.data.missingRoles.length == 0,
          date: moment(res.data.date).format('YYYY-MM-DD HH:mm')
        })
        fetchDramaInfo(res.data.drama)
      },
    })
  }

  const fetchDramaInfo = async (term) => {
    db.collection('dramaInfo').where({
      name: new RegExp(term, 'i') // 模糊匹配 name 字段
    }).get({
      success: function (res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        console.log(res.data)
        const item = res.data[0]
        setRoleList(item.roles.map((o) => ({ text: o, value: o })))
        setMissingRoles(item.roles)
      }
    });
  };

  const submitSucceed = async (values) => {
    try {
      const result = await Taro.cloud.callFunction({
        name: 'updateSession',
        data: {
          params: {
            ...values,
            date: new Date(values.date),
            isFull: values.missingRoles.length == 0
          },
          id,
        },
      })
      if (result.result.error) {
        console.error('云函数调用失败', result.result.error)
      } else {
        const data = result.result.data
        // console.log(res.data)
        Taro.showToast({
          title: '编辑拼场成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            Taro.navigateBack()
          }
        })
      }
    } catch (err) {
      console.error('云函数调用失败', err)
    }


    // db.collection('sessionInfo').doc(id).update({
    //   // data 传入需要局部更新的数据
    //   data: {
    //     // 表示将 done 字段置为 true
    //     ...values,
    //     date: new Date(values.date),
    //     isFull: values.missingRoles.length == 0
    //   },
    //   success: function (res) {

    //   }
    // })
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
        Dialog.close('deleteId')
        Taro.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            Taro.navigateBack()
            // fetchListData(tab2value)
          }
        })
      }
    } catch (err) {
      console.error('云函数调用失败', err)
    }
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
              <Button type="danger" onClick={() => {
                Dialog.open('deleteId', {
                  title: '确认删除该拼场信息？',
                  // content: '可通过 Dialog.open 打开对话框',
                  onConfirm: () => {
                    delListData(id)
                  },
                  onCancel: () => {
                    Dialog.close('deleteId')
                  },
                })
              }} style={{ marginLeft: '20px' }}>
                删除
              </Button>
              <Dialog id="deleteId" />
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

export default Edit
