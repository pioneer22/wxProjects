//index.js
Page({

  // 识别银行卡
  distinguishCard(e) {
    this.setData({
      type: e.currentTarget.dataset.type
    })
    // 判断识别的类型
    let type = this.data.type
    if (type == 1) {
      this.setData({
        name: "distinguishCard"
      })
    } else if (type == 2) {
      this.setData({
        name: "distinguishId"
      })
    } else if (type == 3) {
      this.setData({
        name: "distinguishDriver"
      })
    } else if (type == 4) {
      this.setData({
        name: "distinguishBusiness"
      })
    }
    this.openImg()
  },

  // 打开图片
  openImg() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.uploadFile(tempFilePaths[0])
        that.setData({
          imgUrl: tempFilePaths[0]
        })
      }
    })
  },

  // 上传图片到云存储
  uploadFile(tempFile) {
    let that = this
    let filename = new Date().getTime() // 命名文件名
    wx.cloud.uploadFile({
      cloudPath: filename+'.png',
      filePath: tempFile, // 文件路径
      success(res) {
        console.log("上传成功:", res.fileID)
        that.getImgUrl(res.fileID)
      },
      fail(err) {
        console.log("上传失败！", err)
      }
    })
  },

  // 获取图片Url
  getImgUrl(fileID) {
    let that = this
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success(res) {
        let tempUrl = res.fileList[0].tempFileURL
        console.log("获取图片Url成功：", tempUrl)
        that.distinguishImg(tempUrl)
      },
      fail(err) {
        console.log("获取图片Url失败：", err)
      }
    })
  },

  // 识别图片
  distinguishImg(tempUrl) {
    let that = this
    wx.cloud.callFunction({
      name: that.data.name,
      data: {
        imgUrl: tempUrl
      },
      success(res) {
        console.log("识别成功：", res)
        let type = that.data.type
        if (type == 1) {
          that.setData({
            card: res.result.number
          })
        } else if (type == 2) {
          that.setData({
            pname: res.result.name,
            addr: res.result.addr,
            gender: res.result.gender,
            id: res.result.id
          })
        } else if (type == 3) {
          that.setData({
            dname: res.result.name,
            daddress: res.result.address,
            birthDate: res.result.birthDate,
            carClass: res.result.carClass,
            sex: res.result.sex,
            idNum: res.result.idNum,
            validFrom: res.result.validFrom,
            validTo: res.result.validTo
          })
        } else if (type == 4) {
          that.setData({
            address: res.result.address,
            businessScope: res.result.businessScope,
            enterpriseName: res.result.enterpriseName,
            legalRepresentative: res.result.legalRepresentative,
            regNum: res.result.regNum,
            registeredCapital: res.result.registeredCapital,
            registeredDate: res.result.registeredDate
          })
        }
      },
      fail(err) {
        console.log("识别失败：", err)
      }
    })
  }
})