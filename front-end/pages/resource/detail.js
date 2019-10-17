// pages/resource/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: 'x',
    content: 'x',
    contact: 'x',
    telephone: 'x',
    email: 'x',
    qualification: 'x',
    startDate: 'x',
    endDate: 'x',
    imageSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.detailId
    // 以下通过从本地读取模拟从服务器获得信息
    let resourceId = 'resource' + String(id)
    // console.log(resourceId)
    let item = wx.getStorageSync(resourceId)
    this.setData({
      title: item.title,
      content: item.content,
      contact: item.contact,
      telephone: item.telephone,
      email: item.email,
      qualification: item.qualification,
      startDate: item.startDate,
      endDate: item.endDate,
      imageSrc: item.imageSrc

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
