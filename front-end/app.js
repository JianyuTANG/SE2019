// app.js
const app = getApp()
App({
  // 全局变量请在这里定义
  globalData: {
    baseUrl: 'http://127.0.0.1:8000/',
    userInfo: null
  },
  data: {
    facultyList: [{
      id: '1',
      title: '清华校友总会生命科学...',
      content: '急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23',
      imageSrc: '/assets/activity.png'
    }, {
      id: '2',
      title: '清华校友总会生命科学...',
      content: '急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23',
      imageSrc: '/assets/activity.png'
    }],
    domesticList: [{
      id: '3',
      title: '国内校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23',
      imageSrc: '/assets/activity.png'
    }, {
      id: '4',
      title: '国内校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23',
      imageSrc: '/assets/activity.png'
    }],
    overseasList: [{
      id: '5',
      title: '海外校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23',
      imageSrc: '/assets/activity.png'
    }, {
      id: '6',
      title: '海外校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23',
      imageSrc: '/assets/activity.png'
    }],
    interestList: [{
      id: '7',
      title: '兴趣校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23',
      imageSrc: '/assets/activity.png'
    }, {
      id: '8',
      title: '兴趣校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23',
      imageSrc: '/assets/activity.png'
    }, {
      id: '9',
      title: '兴趣校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23',
      imageSrc: '/assets/activity.png'
    }, {
      id: '10',
      title: '兴趣校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23',
      imageSrc: '/assets/activity.png'
    }]
  },
  onLaunch: function () {
    // 展示本地存储能力

    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log("login success res", res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

        wx.request({
          url: 'http://127.0.0.1:8000/login',
          data: { code: res.code },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'content-type': 'application/json'
          },// 设置请求的 header
          success: function (res) {
            console.log('获取用户unionId', res);
            // 存储sessionCode：
            wx.setStorage({
              key: 'sessionCode',
              data: res.data.sessionCode,
            })
            if(res.data.identity == -1){
              that.getUserOut();
            }

            wx.getStorage({
              key: 'identity',  // 和存储的key值一致；
              success: function (res) {
                console.log(res.data)  // 在这里打印出存储的值；
              }
            })
          },
          fail: function () {
            console.log("index.js wx.request CheckCallUser fail");
          },
          complete: function () {

            // complete
          }
        })

      }
    })
    // 获取用户信息
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
      }
    })

    wx.setStorage({
      key: 'facultyList',
      data: this.data.facultyList
    })
    wx.setStorage({
      key: 'domesticList',
      data: this.data.domesticList
    })
    wx.setStorage({
      key: 'overseasList',
      data: this.data.overseasList
    })
    wx.setStorage({
      key: 'interestList',
      data: this.data.interestList
    })
    let lists = []
    lists.push(wx.getStorageSync('facultyList'))
    lists.push(wx.getStorageSync('domesticList'))
    lists.push(wx.getStorageSync('overseasList'))
    lists.push(wx.getStorageSync('interestList'))
    for (let list of lists) {
      for (let item of list) {
        let resourceId = 'resource' + item.id
        wx.setStorageSync(resourceId, item)
      }
    }
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
  //链接到未验证提醒与要求验证界面
  getUserOut: function (){
    console.log('用户未验证，需要验证');
    wx.switchTab({
      url: '/pages/groups/groups'
    })
  }
})
