// pages/me/me.js
const app = getApp()
Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlPrefix: app.globalData.baseUrl.substr(0, app.globalData.baseUrl.length - 1)

  },

  onShow: function () {
    // 以下从服务器获取信息
    this.query_res_all()
    this.query_res_issued()
    this.query_res_interested()
    // 本地储存方法，已废弃
    // let lists = [0, 0, 0, 0]
    // lists[0] = wx.getStorageSync('allList')
    // lists[1] = wx.getStorageSync('allList')
    // lists[2] = wx.getStorageSync('likeList')
    // lists[3] = wx.getStorageSync('issueList')
    // console.log("全部资源：",lists[0])
    // this.view_res()
    this.setData({
      // resourceList: lists[0],
      // allList: lists[0],
      // recommendList: lists[1],
      // likeList: lists[2],
      // issueList: lists[3]
      resourceList: allList,
      recommendList: allList
    })
    this.loadResouceList()
    // let lists = [this.data.facultyList, this.data.domesticList, this.data.overseasList, this.data.interestList]
  }
})
