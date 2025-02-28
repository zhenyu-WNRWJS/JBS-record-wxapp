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
    id
  } = event
  try {
    const res = await db.collection('sessionInfo').doc(id).remove()
    return {
      success: true,
      data: res
    }
  } catch (err) {
    console.error('删除失败', err)
    return {
      success: false,
      error: err
    }
  }
}
