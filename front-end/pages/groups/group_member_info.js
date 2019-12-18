/* 他人详情页面,传入options中的targetOpenid字段 */
import { areaList } from '../../data/area.js'// 城市的表
import { fieldList } from '../../data/field.js'// 工作领域的表
import { departList } from '../../data/department.js'
const app = getApp()
Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlPrefix: app.globalData.baseUrl.substr(0, app.globalData.baseUrl.length - 1),
    queryUrl: app.globalData.baseUrl + 'query_res_by_openid',
    viewUserUrl: app.globalData.baseUrl + 'view_other',
    activeNames: ['1'],
    avatarUrl: '',
    name: '',
    email: '',
    department: '',
    city: '',
    field: '',
    telephone: '',
    content: '',
    showResouceList: [],
    tarOpenid: '',
    stuNum: [],
    advNum: []
  },
  onLoad: function (options) {
    let that = this
    let tarOpenid = options.openid
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

    promiseRes.then((res) => {
      console.log(res)
      let resList = res.data.res_list.filter(d => d).map(item => {
        let x = item
        x['coverImg'] = that.data.baseUrlPrefix + item['coverImg']
        return x
      })
      console.log(resList)
      that.setData({
        showResouceList: resList
      })
    }).catch(res => { console.log(res) })

    promiseUser.then((res) => {
      console.log('promise user' + res)
      let resData = res.data
      resData['avatar_url'] = that.data.baseUrlPrefix + resData['avatar_url']
      let city = areaList['city_list'][resData.city] || ''
      let field = fieldList['city_list'][resData.field] || ''
      let depart = departList[resData.department]
      that.setData({
        city: city,
        name: resData.name,
        stuNum: resData.studentArr,
        advNum: resData.advisorArr,
        department: depart,
        email: resData.email,
        field: field,
        telephone: resData.tel,
        content: resData.selfDiscription,
        avatarUrl: resData['avatar_url']
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
      success(res) {
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

  query_res: function (resolve, reject) {
    let that = this
    let sessionCode = wx.getStorageSync('sessionCode')
    let openid = wx.getStorageSync('openid')
    let tOpenid = that.data.tarOpenid
    let url = that.data.queryUrl
    wx.request({
      url: url,
      method: 'POST',

      data: {
        sessionCode: sessionCode,
        openid: openid,
        targetOpenid: tOpenid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('query res返回值', res)
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

  onChange(event) {
    this.setData({
      activeNames: event.detail
    })
  },

  onReadmore: function (e) {
    console.log('e.currentTarget:', e.currentTarget)
    let resID = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/resource/detail?resID=' + resID
    })
  }
})


// // pages/groups/groups.js
// Page({

//   data: {
    
//   },


//   onShow: function () {
//     this.setData({
//       resourceList: this.data.facultyList
//     })
//   },

//   tabChange: function (e) {
//     console.log(e)
//     let index = e.detail.index
//     switch (index) {
//       case 0:
//         this.setData({
//           resourceList: this.data.facultyList
//         })
//         break
//       case 1:
//         this.setData({
//           resourceList: this.data.domesticList
//         })
//         break
//       case 2:
//         this.setData({
//           resourceList: this.data.overseasList
//         })
//         break
//       case 3:
//         this.setData({
//           resourceList: this.data.interestList
//         })
//         break
//     }
//   }
// })