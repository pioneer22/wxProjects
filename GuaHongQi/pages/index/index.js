//index.js
const ctx = wx.createCanvasContext('getImg')
let {
  log
} = console

Page({

  // 生成图片
  generateImg(e) {
    let index = e.currentTarget.dataset.index
    let headImg = e.detail.userInfo.avatarUrl

    log("headImg:", headImg)

    this.drawImg(headImg, index)
  },

  //绘图
  drawImg(headImg, index) {
    let that = this
    wx.showLoading({
      title: '图片生成中...',
    })

    let promiseHead = new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: headImg,
        success(res) {
          resolve(res)
        }
      })
    })

    let promiseFrame = new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: `/images/frame${index}.png`,
        success(res) {
          resolve(res)
        }
      })
    })

    Promise.all([promiseHead, promiseFrame]).then(res => {
      let num = 1024
      ctx.drawImage(res[0].path, 0, 0, num, num)
      ctx.drawImage('/' + res[1].path, 0, 0, num, num)
      // 第一个参数为false，表示先清空画布再绘制
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: num,
          height: num,
          destWidth: num,
          destHeight: num,
          canvasId: 'getImg',
          success(res) {
            that.setData({
              imgUrl: res.tempFilePath
            })
            wx.hideLoading()
          },
          fail(res) {
            wx.hideLoading()
          }
        })
      })
    })
  },

  // 上传图片绘制
  uploadImg(e) {
    let that = this
    let index = e.currentTarget.dataset.index

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let tempFilePath = res.tempFilePaths[0]
        if (index)
          that.drawImg(tempFilePath, index)
        else
          that.setData({
            imgUrl: tempFilePath
          })
      },
    })
  },

  // 保存图片
  saveImg() {
    if(!this.data.imgUrl){
      wx.showModal({
        content: '没有图片可保存~',
        showCancel: false,
        confirmText: '明白了',
      })
      return
    }

    let that = this
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
  }

})