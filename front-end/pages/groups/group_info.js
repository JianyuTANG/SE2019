// pages/groups/groups.js
import { departList } from '../../data/department.js'

Page({

  data: {
    inputShowed: false,
    inputVal: "",
    title: "",
    description: "",
    userArr: "",

    num: 0,
  },
  
  visitUser: function (e) {
    console.log('上刺刀:', e.currentTarget)
    let openid = e.currentTarget.dataset.id
    console.log('戳:', openid)
    wx.navigateTo({
      url: '/pages/groups/group_member_info?openid=' + openid
    })
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    
  },

  // memberDetail: function (e) {
  //   wx.navigateTo({
  //     url: '/pages/groups/group_member_info'
  //   })
  // },

  onLoad: function (options) {
    let that = this
    console.log('options.num',options.num)
    that.setData({
      'num': options.num
    })
  },

  onShow: function () {
    let that = this
    let num = that.data.num
    console.log('num = ', num)
    let promise = new Promise((resolve, reject) => {
      that.query_user_by_num(num, resolve, reject)
    })
    promise.then(function (res) {
      for (var x in res.data.userArr) {
        res.data.userArr[x].avatarUrl = 'http://154.8.172.132' + res.data.userArr[x].avatarUrl
        res.data.userArr[x].department = departList[res.data.userArr[x].department]
      }
      console.log('群组详情最终res', res)
      var openidStore
      openidStore = wx.getStorageSync('openid')
      that.setData({
        title: res.data.title,
        description: res.data.description,
        userArr: res.data.userArr,
      })
      // return new Promise((resolve, reject) => {
      //   let openid = that.data.openid
      //   console.log('要发给后端拿头像的openid', openid)
      //   that.get_other_avatar(openid, resolve, reject)
      // })
    }).catch(function () {
      console.log('reject')
    })
  },

  query_user_by_num: function (num, resolve, reject) {
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    // console.log('怪物', sessionCode)
    // console.log('函数中的num', num)
    wx.request({
      url: 'http://154.8.172.132/query_user_by_num',
      method: 'POST',
      data: {
        sessionCode: sessionCode,
        num: num
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

  onChange(event) {
    this.setData({
      activeNames: event.detail
    })
  },

  tabChange: function (e) {
    console.log(e)
    let index = e.detail.index
    switch (index) {
      case 0:
        this.setData({
          resourceList: this.data.facultyList
        })
        break
      case 1:
        this.setData({
          resourceList: this.data.domesticList
        })
        break
      case 2:
        this.setData({
          resourceList: this.data.overseasList
        })
        break
      case 3:
        this.setData({
          resourceList: this.data.interestList
        })
        break
    }
  }
})