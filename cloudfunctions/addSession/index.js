// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const res = await db.collection('sessionInfo').add({
      data: {
        ...event,
        date: new Date(event.date),
        _openid: wxContext.OPENID,
      }
    })
    return {
      success: true,
      data: res
    }
  } catch (err) {
    console.error('添加失败', err)
    return {
      success: false,
      error: err
    }
  }
}
