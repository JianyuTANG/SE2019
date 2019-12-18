// pages/me/me.js
const app = getApp()
Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlPrefix: app.globalData.baseUrl.substr(0, app.globalData.baseUrl.length - 1),
    switchInterestUrl: app.globalData.baseUrl + 'switch_interest',
    officialUrl: app.globalData.baseUrl + 'query_res_official',
    currentIndex: 0,
    showResourceList: []
  },

  onLoad: function () {

  },

  onShow: function () {
    // 以下从服务器获取信息
    let that = this
    let sessionCode = wx.getStorageSync('sessionCode')
    let openid = wx.getStorageSync('openid')
    wx.request({
      url: that.data.officialUrl,
      method: 'POST',

      data: {
        sessionCode: sessionCode,
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('switch_interest返回值', res)
        let imgArr = []
        if (res.statusCode === 200) {
          let resList = res.data.res_list.filter(d => d).map(item => {
            let x = item
            x['coverImg'] = that.data.baseUrlPrefix + item['coverImg']
            if (imgArr.length <= 4) {
              imgArr.push(x['coverImg'])
            }
            return x
          })
          console.log(resList)
          that.setData({
            showResourceList: resList,
            imgArr: imgArr
          })
        } else {
          console.log('error')
        }
        // allList
      },
      fail: (res) => {
        console.log('error')
      }
    })
  },
  handleChange: function (e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },

  readmore: function (e) {
    console.log('e.currentTarget:', e.currentTarget)
    let resID = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/resource/detail?resID=' + resID
    })
  },

  switch_interest: function (e) {
    let that = this
    let sessionCode = wx.getStorageSync('sessionCode')
    let openid = wx.getStorageSync('openid')
    let resID = e.currentTarget.dataset.id
    let promise = new Promise((resolve, reject) => {
      wx.request({
        url: that.data.switchInterestUrl,
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

    promise.then(
      this.onShow).catch(function (e) {
      console.log(e)
    })
  }
})
