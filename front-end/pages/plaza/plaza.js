// pages/me/me.js
const app = getApp()
Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlPrefix: app.globalData.baseUrl.substr(0, app.globalData.baseUrl.length - 1),
    currentIndex: 0
  },

  onShow: function () {
    // 以下从服务器获取信息
  },
  handleChange: function (e) {
    this.setData({
      currentIndex: e.detail.current
    })
  }
})
