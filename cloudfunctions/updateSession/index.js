// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    params,
    id
  } = event
  try {
    const res = await db.collection('sessionInfo').doc(id).update({
      data: {
        ...params,
        date: new Date(params.date),
        // _openid: wxContext.OPENID,
      }
    })
    return {
      success: true,
      data: res
    }
  } catch (err) {
    console.error('更新失败', err)
    return {
      success: false,
      error: err
    }
  }
}
