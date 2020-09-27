// 云函数入口文件,识别营业执照
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.ocr.businessLicense({
      imgUrl: event.imgUrl
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}