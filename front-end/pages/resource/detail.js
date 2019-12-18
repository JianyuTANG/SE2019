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
    startDate: '2019/12/09',
    due: 'x',
    imgArr: '',
    resID:'x',
    interested:'',
    currentIndex: 0,
    openid: '',

    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 500,
    leftMargin: '50rpx',
    rightMargin: '50rpx',

    iconName: 'like-o',
    iconUnlike: 'like-o',
    iconLike: 'like',
    avatarSrc: '/assets/member.jpg',
    enrollment: 0,

    tapEnrollment: false
  },

  properties: {
    canChange: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      resID: options.resID
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
    
    let that = this
    let resID = that.data.resID
    console.log('resID = ',resID)
    let promise = new Promise((resolve, reject) => {
      that.view_res(resID, resolve, reject)
    })
    // let promiseAvatar = new Promise((resolve, reject) => {
    //   let openid = that.data.openid
    //   console.log('要发给后端拿头像的openid', openid)
    //   that.get_other_avatar(openid, resolve, reject)
    // })
    promise.then(function (res) {
      // let imgArr = res.data.imgArr.map(x => {
      //   return { url: 'http://154.8.172.132' + x, isImage: true, suffix: data.coverImg }
      // })
      for (var x in res.data.imgArr) {
        res.data.imgArr[x] = 'http://154.8.172.132' + res.data.imgArr[x]
      }
      console.log('用于渲染详情页的res', res)
      var openidStore
      openidStore = wx.getStorageSync('openid')
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
        openid: res.data.openid,
        interested: res.data.isInterested,
        canChange: res.data.openid == openidStore
      })
      return new Promise((resolve, reject) => {
        let openid = that.data.openid
        console.log('要发给后端拿头像的openid', openid)
        that.get_other_avatar(openid, resolve, reject)
      })
    }).then(function (res) {
      console.log('最后一个then里面', res)
      that.setData({
        avatarSrc: 'http://154.8.172.132' + res.data.avatar_url
      })
    }).catch(function () {
      console.log('reject')
    })
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
  },

  get_other_avatar: function (openid, resolve, reject) {
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    console.log('函数中的', openid)
    wx.request({
      url: 'http://154.8.172.132/get_other_avatar',
      method: 'POST',
      data: {
        sessionCode: sessionCode,
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (resolve) { resolve(res) }
      },
      fail(res) {
        if (reject) { reject() }
      }
    })
  },

  switch_interest: function (e) {
    let that = this
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    var openid
    openid = wx.getStorageSync('openid')
    let resID = that.data.resID
    let promiseInterest = new Promise((resolve, reject) => {
      wx.request({
        url: 'http://154.8.172.132/switch_interest',
        method: 'POST',

        data: {
          sessionCode: sessionCode,
          openid: openid,
          resID: resID
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log('switch_interest返回值', res)
          if (res.statusCode === 200) {
            resolve()
          } else {
            reject(new Error('server rejects'))
          }
          // allList
        }
      })
    })

    promiseInterest.then(
      this.onShow).catch(function (e) {
        console.log(e)
      })
  },

  handleChange: function (e) {
    this.setData({
      currentIndex: e.detail.current
    })
  }
})
