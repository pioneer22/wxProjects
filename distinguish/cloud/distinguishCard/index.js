// 云函数入口文件,识别银行卡
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.ocr.bankcard({
      type: 'photo',
      imgUrl: event.imgUrl
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}