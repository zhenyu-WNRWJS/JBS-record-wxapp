const cloud = require('wx-server-sdk')
const moment = require('moment');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    tab2value,
    fieldReq,
    limit = 100 // 设置每次查询返回的记录数为100
  } = event

  try {
    const res = await db.collection('sessionInfo').where({
      date: _.gte(moment().startOf('day').toDate())
    }).field(fieldReq).limit(limit).get()
    const res2 = await db.collection('sessionInfo').where({
      date: _.lt(moment().startOf('day').toDate())
    }).field(fieldReq).limit(limit).get()
    const data = res.data
    const data2 = res2.data
    let dataSource = []
    if (tab2value === 0) {
      dataSource = [...data]
    } else if (tab2value === 1) {
      dataSource = data.filter((d) => d.missingRoles.length > 0)
    } else if (tab2value === 2) {
      dataSource = data.filter((d) => d.missingRoles.length == 0)
    } else {
      dataSource = [...data]
    }
    return {
      dataSource: dataSource,
      staleDataSource: data2
    }

  } catch (err) {
    console.error('查询失败', err)
    return {
      error: err
    }
  }
}
