// pages/me/me.js
// 微信自带的几种type
var sourceType = [
  ['camera'],
  ['album'],
  ['camera', 'album']
]
var sizeType = [
  ['compressed'],
  ['original'],
  ['compressed', 'original']
]
const app = getApp()
Page({

  data: {
    uploadUrl: app.globalData.baseUrl + 'upload_user_avatar',
    showPlaceholder: true, // 用于头像
    showLoading: false, // 用于头像是否显示加载样式
    avatar: '',
    name: '',
    activities: []
  },

  onShow: function () {
    this.setData({ // TODO 从服务器得到头像
      avatar: wx.getStorageSync('avatar') || 'https://yunlaiwu0.cn-bj.ufileos.com/teacher_avatar.png',
      name: wx.getStorageSync('name') || ''
    })
    // this.testActivities()
  },

  // 用于处理点击头像事件
  chooseImage: function () {
    let that = this
    wx.chooseImage({
      sourceType: sourceType[1],
      sizeType: sizeType[0],
      count: 1,
      success: function (res) {
        console.log(res)
        that.showLoadingView()
        that.uploadImage(res.tempFilePaths[0])
      }
    })
  },

  // 用于在上传头像时切换头像样式为加载中
  showLoadingView: function () {
    let that = this

    this.setData({
      showLoading: true
    })
  },

  // 用于上传头像
  uploadImage: function (filePath) {
    let that = this
    console.log(that.data.uploadUrl)
    if (filePath === undefined || filePath === '') {

    } else {
      console.log('filename--->' + 'avarter')
      wx.uploadFile({
        url: that.data.uploadUrl,
        filePath: filePath,
        name: filePath,
        success: function (res) {
          console.log(res)
          // 坑
          // let resData = JSON.parse(res.data)
          if (res.statusCode === 200) {
            that.loadImageSrc(filePath)
          } else {
            that.uploadError()
          }
        },
        fail: function (res) {
          that.uploadError()
        }
      })
    }
  },

  uploadError: function () {
    let that = this
    that.loadImageSrc(that.data.loadImageSrc)
    wx.showToast({
      // 提示内容
      title: '上传失败',
      // 提示图标样式：success/loading
      icon: 'loading',
      // 提示显示时间
      duration: 2000
    })
  },

  // 用于重新根据url加载头像
  loadImageSrc: function (filePath) {
    let that = this
    that.setData({
      avatar: filePath,
      showPlaceholder: false,
      showLoading: false
    })
  },

  navToDetailPage: function (e) {
    let name = e.currentTarget.dataset.field
    switch (name) {
      case 'personal': // 代表是用户个人信息
        wx.navigateTo({
          url: '/pages/me/personal'
        })
        break
      default:
        console.log(name)
    }
  }

})
