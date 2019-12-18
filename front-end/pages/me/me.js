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
    viewUserUrl: app.globalData.baseUrl + 'view_user',
    getAvatarUrl: app.globalData.baseUrl + 'get_user_avatar',
    showPlaceholder: true, // 用于头像
    showLoading: false, // 用于头像是否显示加载样式
    avatar: '',
    name: '',
    selfDescription: '',
    identity: 0,
    stuNumber: 0,
    advNumber: 0,
    activities: [],
    t: 0 // 用于更新图片的一种办法,每次更新图片时,t++
  },
  onLoad: function () {
    let that = this
    let sessionCode = wx.getStorageSync('sessionCode')
    let openid = wx.getStorageSync('openid')
    let prefix = app.globalData.baseUrl.substr(0, app.globalData.baseUrl.length - 1)
    wx.request({
      url: that.data.getAvatarUrl,
      method: 'POST',
      data: {
        sessionCode: sessionCode
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res)
        console.log(res.data)
        that.setData({
          'avatar': prefix + res.data.url
        })
      }
    })

    wx.request({
      url: that.data.viewUserUrl,
      method: 'POST',
      data: {
        sessionCode: sessionCode,
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res)
        console.log(res.data)
        that.setData({
          'stuNumber': res.data.studentArr,
          'advNumber': res.data.advisorArr,
          'selfDiscription': res.data.selfDiscription,
          'name': res.data.name
        })
        console.log('冲压', that.data.selfDiscription)
      }
    })
  },

  onShow: function () {
    // this.setData({ // TODO 从服务器得到头像
    //   // avatar: wx.getStorageSync('avatar') || 'https://yunlaiwu0.cn-bj.ufileos.com/teacher_avatar.png',
    //   name: wx.getStorageSync('name') || ''
    // })
    // // this.testActivities()
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
    let sessionCode = wx.getStorageSync('sessionCode')
    if (filePath === undefined || filePath === '') {

    } else {
      console.log('filename--->' + 'avarter')
      wx.uploadFile({
        url: that.data.uploadUrl,
        filePath: filePath,

        name: filePath,
        header: {
          sessionCode: sessionCode
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          // 坑
          let resData = JSON.parse(res.data)
          if (res.statusCode === 200) {
            let prefix = app.globalData.baseUrl.substr(0, app.globalData.baseUrl.length - 1)
            let filePath = prefix + resData.url
            console.log(res.data)
            console.log(filePath)
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
      'avatar': ''
    })
    that.setData({
      'avatar': filePath + '?t=' + that.data.t, // 这里是为了让多次更新图片时微信能重新加载同一地址
      showPlaceholder: false,
      showLoading: false
    })
    that.data.t += 1
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
