// pages/resource/detail.js
Page({
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: '../../miniprogram_npm/weui-miniprogram/swiper/swiper'
    }
  },
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
    imgArr: '',

    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,

    iconName: 'like-o',
    iconUnlike: 'like-o',
    iconLike: 'like',
    avatarSrc: '/assets/member.jpg',
    enrollment: 0,

    tapEnrollment: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let resID = options.resID
    // 以下通过从本地读取模拟从服务器获得信息
    console.log(resID)
    let that = this
    let promise = new Promise((resolve, reject) => {
      that.view_res(resID, resolve, reject)
    })
    // let item = wx.getStorageSync(resID)
    // this.setData({
    //   title: item.title,
    //   content: item.content,
    //   contact: item.contact,
    //   telephone: item.telephone,
    //   email: item.email,
    //   qualification: item.qualification,
    //   startDate: item.startDate,
    //   endDate: item.endDate,
    //   imageSrc: item.imageSrc,
    //   resID: item.resID,
    //   interested: item.interested
    // })
    // let res = wx.getStorageSync('res')

    promise.then(function (res) {
      // let imgArr = res.data.imgArr.map(x => {
      //   return { url: 'http://154.8.172.132' + x, isImage: true, suffix: data.coverImg }
      // })
      for (var x in res.data.imgArr) {
        res.data.imgArr[x] = 'http://154.8.172.132' + res.data.imgArr[x]
      }
      console.log('用于渲染详情页的res in onLoad func(从本地获得的):',
        res)
      that.setData({
        title: res.data.title,
        content: res.data.content,
        contact: res.data.contact,
        category: res.data.category,
        coverImg: 'http://154.8.172.132' + res.data.coverImg,
        due: res.data.due,
        imgArr: res.data.imgArr,
        name: res.data.name,
        resID: res.data.resID,
        tagArr: res.data.tagArr,
        openid: res.data.openid
      // interested: res.data.interested
      // startDate: res.data.startDate,
      })
    }).catch(function () {
      console.log('reject')
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

  },

  enroll: function (e) {
    this.setData({
      tapEnrollment: true,
      enrollment: this.data.enrollment + 1
    })
  },

  tapDialogButton: function (e) {
    this.setData({
      tapEnrollment: false
    })
  },

  view_res: function (resID, resolve, reject) {
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    var openid
    openid = wx.getStorageSync('openid')
    wx.request({
      url: 'http://154.8.172.132/view_res',
      method: 'POST',
      data: {
        sessionCode: sessionCode,
        openid: openid,
        resID: resID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        if (resolve) { resolve(res) }
      },
      fail (res) {
        if (reject) { reject() }
      }
    })
  }
})
