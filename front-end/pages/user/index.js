/* 他人详情页面,传入options中的targetOpenid字段 */
const app = getApp()
Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlPrefix: app.globalData.baseUrl.substr(0, app.globalData.baseUrl.length - 1),
    viewUserUrl: app.globalData.baseUrl + 'view_other_by_openid',
    activeNames: ['1'],
    avatarUrl: '',
    name: 'test',
    email: 'abc',
    department: '',
    city: '',
    field: '',
    telephone: 123,
    content: '123',
    showResouceList: [],
    tarOpenid: '',
    stuNum: [],
    advNum: []
  },
  onLoad: function (options) {
    let that = this
    let tarOpenid = options.targetOpenid
    that.setData({
      tarOpenid: tarOpenid
    })
  },
  onShow: function () {
    let that = this
    let promiseRes = new Promise((resolve, reject) => {
      that.query_res(resolve, reject)
    })

    let promiseUser = new Promise((resolve, reject) => {
      that.query_user(resolve, reject)
    })

    promiseUser.then((res) => {
      console.log('promise user' + res)
      let resData = res.data
      resData['avatar_url'] = that.data.baseUrlPrefix + resData['avatar_url']
      let resList = res.data.resArr.filter(d => d).map(item => {
        let x = item
        x['coverImg'] = that.data.baseUrlPrefix + item['coverImg']
        return x
      })
      that.setData({
        name: resData.name,
        stuNum: resData.studentNum,
        advNum: resData.advisorNum,
        department: resData.department,
        email: resData.email,
        field: resData.field,
        telephone: resData.tel,
        content: resData.selfDiscription,
        avatarUrl: resData['avatar_url'],
        showResouceList: resList
      })
    }).catch(res => { console.log(res) })
  },

  query_user: function (resolve, reject) {
    let that = this
    let sessionCode = wx.getStorageSync('sessionCode')
    let tOpenid = that.data.tarOpenid
    let url = that.data.viewUserUrl
    console.log('tOpenid' + tOpenid)
    wx.request({
      url: url,
      method: 'POST',
      data: {
        sessionCode: sessionCode,
        openid: tOpenid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('view user返回值', res)
        if (res.statusCode === 200) {
          resolve(res)
        } else {
          reject(new Error('server rejects'))
        }
      // allList
      },
      fail: (res) => {
        reject(new Error('server rejects'))
      }
    })
  },

  onShareAppMessage: function () {
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/page/user?id=123'
    }
  },

  onChange (event) {
    this.setData({
      activeNames: event.detail
    })
  }
})
