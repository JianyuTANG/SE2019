// pages/me/me.js
import { tags } from '../../data/tags.js'
import { showActivityTypes } from '../../data/activityTypes.js'
const app = getApp()
const baseUrl = 'http://154.8.172.132/'
Page({

  data: {
    baseUrlwithoutTailLine: 'http://154.8.172.132',
    deleteUrl: 'http://154.8.172.132/delete_res',
    searchCategoryUrl: baseUrl + 'query_res_by_category',
    searchTagsUrl: baseUrl + 'query_res_by_tags',
    queryAllUrl: baseUrl + 'query_res_all',
    searchUrl: baseUrl + 'search_res',
    nameList: [{
      text: '全部资源'
    }, {
      text: '精选推荐'
    }, {
      text: '我中意的'
    }, {
      text: '我发布的'
    }],
    searchList: [{
      text: '设置类别'
    }, {
      text: '设置tag'
    }],
    searchTags: [],
    resourceList: [],
    showResouceList: [],
    tagList: tags, // 显示已有的tag
    tapButtonTag: false,
    showActivityTypes: showActivityTypes,
    searchValue: '',
    activityType: -1,
    allList: [],
    recommendList: [],
    likeList: [],
    issueList: [],
    listIndex: 0,
    canChange: false
  },
  index2list: function (index) {
    switch (index) {
      case 0:
        return this.data.allList
      case 1:
        return this.data.recommendList
      case 2:
        return this.data.likeList
      case 3:
        return this.data.issueList
    }
  },
  loadCurList: function () {
    let that = this
    let curList = that.index2list(that.data.listIndex)
    that.setData({
      resourceList: curList
    })
    that.loadResouceList()
  },
  listAddImagePrefix: function (list) {
    // 用于为图片添加前缀
    for (let i in list) {
      // 从这里继续
      if (list[i].coverImg === '') {
        list[i].coverImg = '/assets/bluelogo.png'
      } else { list[i].coverImg = this.data.baseUrlwithoutTailLine + list[i].coverImg }
    }
    return list
  },
  onLoad: function () {
    console.log('load resource' + showActivityTypes)
  },
  onShow: function () {
    let that = this
    let promiseIssued = new Promise((resolve, reject) => {
      this.query_res_issued(resolve, reject)
    })
    let promiseInterest = new Promise((resolve, reject) => {
      this.query_res_interested(resolve, reject)
    })
    let promise = new Promise((resolve, reject) => {
      that.query_res_all(resolve, reject)
      // that.searchType(that.data.activityType, resolve, reject)
    })
    console.log(promise)
    promise.then(function () {
      console.log('promise success')
      return promiseIssued
    }).then(function () {
      return promiseInterest
    }).then(function () {
      that.loadCurList()
    }).catch((reason) => {
      console.log('promise fail')
      console.log(reason)
    })

    console.log('当前类别为', app.globalData.curResourceType)
    if (that.data.listIndex === 0 && app.globalData.curResourceType !== -1) {
      that.searchType(app.globalData.curResourceType)
    }

    if (app.globalData.curResourceTags.length) {
      console.log(app.globalData.curResourceTags)
      that.setData({
        searchTags: app.globalData.curResourceTags
      })
      that.queryTag()
    }

    that.setData({
      searchValue: ''
    })
    // let lists = [this.data.facultyList, this.data.domesticList, this.data.overseasList, this.data.interestList]
  },

  readmore: function (e) {
    console.log('e.currentTarget:', e.currentTarget)
    let resID = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/resource/detail?resID=' + resID
    })
  },

  switch_interest: function (e) {
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    var openid
    openid = wx.getStorageSync('openid')
    let resID = e.currentTarget.dataset.id
    let promise = new Promise((resolve, reject) => {
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
  },

  addResource: function (e) {
    wx.navigateTo({
      url: '/pages/resource/add'
    })
  },

  changeResource: function (e) {
    console.log(e)
    let resID = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/resource/add?resID=' + resID
    })
  },

  deleteResource: function (e) {
    let sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    let openid
    openid = wx.getStorageSync('openid')
    let resID = e.currentTarget.dataset.id
    let that = this
    let promise = new Promise((resolve, reject) => {
      wx.request({
        url: that.data.deleteUrl,
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

    promise.then(that.onShow).catch(function (e) { console.log(e) })
  },

  query_res_all: function (resolve, reject) {
    let that = this
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    var openid
    openid = wx.getStorageSync('openid')
    wx.request({
      url: 'http://154.8.172.132/query_res_all',
      method: 'POST',

      data: {
        sessionCode: sessionCode,
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('query_res_all返回值', res)
        for (let i in res.data.res_list) {
          // 从这里继续
          if (res.data.res_list[i].coverImg === '') {
            res.data.res_list[i].coverImg = '/assets/bluelogo.png'
          } else { res.data.res_list[i].coverImg = that.data.baseUrlwithoutTailLine + res.data.res_list[i].coverImg }
        }
        console.log('加前缀的链接', res.data)
        that.setData({
          'allList': res.data.res_list
        })
        if (resolve) { resolve() }
        // wx.setStorageSync('allList', res.data.res_list)
      },
      fail (res) {
        console.log('query fail all')
        if (reject) { reject('query fail all') }
      }
    })
  },

  query_res_interested: function (resolve, reject) {
    let that = this
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    var openid
    openid = wx.getStorageSync('openid')
    wx.request({
      url: 'http://154.8.172.132/query_res_interested',
      method: 'POST',

      data: {
        sessionCode: sessionCode,
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('query_res_interested返回值', res)
        for (let i in res.data.res_list) {
          // 从这里继续
          if (res.data.res_list[i].coverImg === '') {
            res.data.res_list[i].coverImg = '/assets/bluelogo.png'
          } else { res.data.res_list[i].coverImg = that.data.baseUrlwithoutTailLine + res.data.res_list[i].coverImg }
        }
        that.setData({
          'likeList': res.data.res_list
        })
        if (resolve) { resolve() }
      },
      fail (res) {
        if (reject) { reject('query fail interested') }
      }
    })
  },

  query_res_issued: function (resolve, reject) {
    let that = this
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    var openid
    openid = wx.getStorageSync('openid')
    wx.request({
      url: 'http://154.8.172.132/query_res_issued',
      method: 'POST',

      data: {
        sessionCode: sessionCode,
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('query_res_issued返回值', res)
        for (let i in res.data.res_list) {
          // 从这里继续
          if (res.data.res_list[i].coverImg === '') {
            res.data.res_list[i].coverImg = '/assets/bluelogo.png'
          } else { res.data.res_list[i].coverImg = that.data.baseUrlwithoutTailLine + res.data.res_list[i].coverImg }
        }
        that.setData({
          'issueList': res.data.res_list
        })
        if (resolve) { resolve() }
      },
      fail (res) {
        if (reject) { reject('no ') }
      }
    })
  },

  loadResouceList: function () {
    console.log('load resource')
    console.log(this.data.resourceList)
    this.setData({
      showResouceList: this.data.resourceList
    })
  },

  tabChange: function (e) {
    let index = e.detail.index
    switch (index) {
      case 0:
        this.setData({
          resourceList: this.data.allList,
          canChange: false
        })
        break
      case 1:
        this.setData({
          resourceList: this.data.recommendList,
          canChange: false
        })
        break
      case 2:
        this.setData({
          resourceList: this.data.likeList,
          canChange: false
        })
        break
      case 3:
        this.setData({
          resourceList: this.data.issueList,
          canChange: true
        })
        break
    }
    this.setData({
      listIndex: index
    })
    this.loadResouceList()
  },

  searchItem: function (item, value) {
    if (item.title.indexOf(value) !== -1) { return true }
    if (item.content.indexOf(value) !== -1) { return true }
    if (item.contact.indexOf(value) !== -1) { return true }
    if (item.startDate.indexOf(value) !== -1) { return true }
    if (item.endDate.indexOf(value) !== -1) { return true }
    if (item.email.indexOf(value) !== -1) { return true }
    if (item.qualification.indexOf(value) !== -1) { return true }
    if (item.telephone.indexOf(value) !== -1) { return true }
    return false
  },
  onSearchChange: function (e) {
    console.log(e)
    this.setData({
      searchValue: e.detail
    })
  },
  onSearch: function (e) {
    console.log(e)
    let that = this
    let val = this.data.searchValue
    console.log(val)
    let sessionCode = wx.getStorageSync('sessionCode')
    let openid = wx.getStorageSync('openid')
    let url = that.data.searchUrl
    sessionCode = wx.getStorageSync('sess')
    that.setData({
      searchTags: [],
      activityType: -1
    })
    app.globalData.curResourceTags = []
    app.globalData.curResourceType = -1

    wx.request({
      url: url,
      method: 'POST',
      data: {
        sessionCode: sessionCode,
        openid: openid,
        content: val
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('search返回值', res)
        if (res.statusCode === 200) {
          let arr = res.data.res_list
          that.setData({
            showResouceList: that.listAddImagePrefix(arr)
          })
        } else {
          // fail

        }
      // allList
      }
    })
    // let items = []
    // for (let item of this.data.resourceList) {
    //   if (this.searchItem(item, value)) {
    //     items.push(item)
    //   }
    // }

    // this.setData({
    //   showResouceList: items
    // })
  },
  queryTag: function () {
    // 后端通讯
    let that = this

    that.setData({
      searchValue: '',
      activityType: -1
    })
    app.globalData.curResourceType = -1

    let url = that.data.searchTagsUrl
    console.log(url)
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    var openid
    openid = wx.getStorageSync('openid')
    wx.request({
      url: url,
      method: 'POST',
      data: {
        sessionCode: sessionCode,
        openid: openid,
        tagArr: that.data.searchTags
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('changeType返回值', res)
        if (res.statusCode === 200) {
          let arr = res.data.res_list
          that.setData({
            showResouceList: that.listAddImagePrefix(arr)
          })
        } else {
        }
      // allList
      }
    })
  },

  onButtonTag: function (e) {
    this.setData({
      'tapButtonTag': false
    })
    app.globalData.curResourceTags = this.data.searchTags
    this.queryTag()
  },
  setTag: function (e) {
    this.setData({
      'tapButtonTag': true
    })
  },
  onAddTag: function (e) {
    console.log(e)
    let name = e.detail.name
    let curTags = this.data.searchTags
    let match = curTags.filter(item => item === name)
    console.log(match)
    if (match.length === 0) {
      curTags.push(name)
    }
    console.log(curTags)
    this.setData({
      'searchTags': curTags
    })
  },
  closeTag: function (index) {
    let tags = this.data.searchTags
    tags.splice(index, 1)
    this.setData({
      'searchTags': tags
    })
  },
  onCloseTag: function (e) {
    console.log(e)
    let index = e.detail.index
    this.closeTag(index)
  },
  onTapCloseTag: function (e) {
    let index = e.currentTarget.dataset
    this.closeTag(index)
  },
  clearTags: function (e) {
    app.globalData.curResourceTags = []
    this.setData({
      'searchTags': []
    })
    this.queryTag()
  },
  fakeHandle: function (e) {
    // no use so fake
  },

  onSearchType: function (e) {
    console.log(e)
    let curValue = e.detail
    this.searchType(curValue)
  },

  searchType: function (curValue, resolve, reject) {
    app.globalData.curResourceType = curValue
    let that = this
    that.setData({
      searchValue: '',
      searchTags: []
    })
    app.globalData.curResourceTags = []

    let match = showActivityTypes.filter(option => option.value === curValue)
    let category = match[0].text
    console.log(category)
    let url = that.data.searchCategoryUrl
    console.log(url)
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    var openid
    openid = wx.getStorageSync('openid')

    if (curValue === -1) {
      // -1 是all
      url = this.data.queryAllUrl
    }

    wx.request({
      url: url,
      method: 'POST',

      data: {
        sessionCode: sessionCode,
        openid: openid,
        category: category
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('changeType返回值', res)
        if (res.statusCode === 200) {
          let arr = res.data.res_list
          that.setData({
            showResouceList: that.listAddImagePrefix(arr)
          })
          if (resolve) { resolve() }
        } else {
          // fail
          if (reject) { reject() }
        }
      // allList
      }
    })
  }
})
