// // 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// // 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()

//   return {
//     event,
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//   }
// }
// 云函数入口文件
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
    fieldReq,
    date,
    limit = 100 // 设置每次查询返回的记录数为100
  } = event
  const wxContext = cloud.getWXContext()
  console.log(context, wxContext.OPENID)

  const startOfMonth = moment(date).startOf('month').toDate();
  const endOfMonth = moment(date).endOf('month').toDate();
  const params = {
    date: _.gte(startOfMonth).and(_.lte(endOfMonth)),
    // _openid: wxContext.OPENID,
  }
  try {
    const res = await db.collection('sessionInfo').where(params).field(fieldReq).limit(limit).orderBy('date', 'asc').get()
    const data = res.data
    const dramaList = data.reduce((pre, cur) => !pre.includes(cur.drama) ? [...pre, cur.drama] : pre, [])
    if (dramaList.length > 0) {
      const dramaRes = await db.collection('dramaInfo').where({
        name: _.in(dramaList)
      }).limit(100).get();
      const dramaData = dramaRes.data;
      data.map((item) => {
        dramaData.map((item2) => {
          if (item.drama == item2.name) {
            item.url = item2.url
          }
        })
      })
    }
    return {
      data
    }

  } catch (err) {
    console.error('查询失败', err)
    return {
      error: err
    }
  }
}
