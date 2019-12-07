// app.js
const app = getApp()
App({
  // 全局变量请在这里定义
  globalData: {
    baseUrl: 'http://154.8.172.132/',
    userInfo: null,
    code: ''
  },
  onLaunch: function () {
    // 展示本地存储能力
    let that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log('login success res', res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.globalData.code = res.code
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo

                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            }
            wx.request({
              url: 'http://154.8.172.132/login',
              data: { code: that.globalData.code },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'content-type': 'application/json'
              }, // 设置请求的 header
              success: function (res) {
                console.log(res)
                // 存储openid与sessionCode：
                wx.setStorageSync('openid', res.data.openid)
                // var testopenid
                // testopenid = wx.getStorageSync('openid')
                // console.log('啦啦啦', testopenid)
                wx.setStorageSync('sessionCode', res.data.sessionCode)
                // wx.setStorageSync('openId', res.data.openId)
                
                if (res.data.identity !== -1) {
                  wx.switchTab({
                    url: '/pages/me/me'
                  })
                }

                wx.getStorage({
                  key: 'identity', // 和存储的key值一致；
                  success: function (res) {
                    console.log(res.data) // 在这里打印出存储的值；
                  }
                })
              },
              fail: function () {
                console.log('index.js wx.request CheckCallUser fail')
              },
              complete: function () {
                // complete
              }
            })
          }
        })
      }
    })
    // 获取用户信息

    var name = wx.getStorageSync('name')
    var avatar = wx.getStorageSync('avatar')

    if (!name || !avatar) {
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo
          wx.setStorageSync('name', userInfo.nickName)
          wx.setStorageSync('avatar', userInfo.avatarUrl)
        }
      })
    }
  },
  // 链接到未验证提醒与要求验证界面
  getUserOut: function () {
    console.log('用户未验证，需要验证')
    wx.switchTab({
      url: '/pages/groups/groups'
    })
  }
})
