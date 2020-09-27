//index.js
import QRCode from '../../utils/qrcode.js'
Page({
  data: {
    qrvalue: 'https://pioneer22.github.io/',
    cavs: 248,
  },

  bindKeyInput(e) {
    this.setData({
      qrvalue: e.detail.value
    })
  },

  generateQR() { // 生成二维码
    let url = this.data.qrvalue
    let size = this.data.cavs
    this.createQrCode(url, size)
  },

  createQrCode(url, size) {
    let canvasId = 'qrcode'
    // 调用插件中的draw方法来绘制二维码
    QRCode.api.draw(url, canvasId, size, size)
    this.canvasToTempImage(canvasId)
  },

  canvasToTempImage(canvasId) {
    let that = this
    wx.canvasToTempFilePath({
      canvasId, // canvas-id
      success(res) {
        that.setData({
          imgUrl: res.tempFilePath
        })
      },
      fail(error) {
        console.log('error:', error)
      }
    })
  },

  saveQR() { // 保存二维码图片
    let imgUrl = this.data.imgUrl
    let that = this

    if (imgUrl)
    {
      wx.saveImageToPhotosAlbum({
        filePath: that.data.imgUrl,
        success(res) {
          wx.showModal({
            content: '图片已保存到相册了~',
            showCancel: false,
            confirmText: '没毛病',
            success(res) {
              if (res.confirm) {
                log("点击确定,老铁没毛病")
              }
            }
          })
        }
      })
    } else {
      wx.showModal({
        content: '请先生成二维码哦~',
        showCancel: false,
        confirmText: '没问题',
        success(res) {
          if (res.confirm) {
            log("点击确定,老铁没毛病")
          }
        }
      })
    }  
  }
})