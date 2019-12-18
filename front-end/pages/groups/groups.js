// pages/groups/groups.js
const app = getApp()
const baseUrl = 'http://154.8.172.132/'
Page({

  data: {

    baseUrlwithoutTailLine: 'http://154.8.172.132',
    // deleteUrl: 'http://154.8.172.132/delete_res',
    // searchCategoryUrl: baseUrl + 'query_res_by_category',
    // searchTagsUrl: baseUrl + 'query_res_by_tags',
    // queryAllUrl: baseUrl + 'query_res_all',
    // searchUrl: baseUrl + 'search_res',

    active: 0,
    currentTab: 0,
    activeKey: 0,
    num: 0,

    inputShowed: false,
    inputVal: '',

    list: [{
      text: '我加入的'
    }, {
      text: '各期归属'
    }, {
      text: '常居地区'
    }, {
      text: '其他归属'
    }],

    groupList: [],
    myList: [],
    numList: [],
    fieldList: [],
    otherList: []
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    })
  },
  hideInput: function () {
    this.setData({
      inputVal: '',
      inputShowed: false
    })
  },
  clearInput: function () {
    this.setData({
      inputVal: ''
    })
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
  },

  onShow: function () {
    let that = this
    that.query_all_num()
    that.query_group_field()
    that.query_group_mine()
    // that.query_res_all(resolve, reject)
    // console.log(promise)
    // promise.then(function() {
    //     console.log('promise success')
    //     that.loadCurList()
    //     return promiseAllNum
    // }).then(function() {
    //     that.loadCurList()
    // }).catch((reason) => {
    //     console.log('promise fail')
    //     console.log(reason)
    // })
    this.setData({
      groupList: this.data.myList
    })
  },

  query_all_num: function (e) {
    let that = this
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    wx.request({
      url: 'http://154.8.172.132/query_all_num',
      method: 'POST',

      data: {
        sessionCode: sessionCode
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('query_all_num返回', res)
        that.setData({
          'numList': res.data.arr
        })
        console.log('numList', that.data.numList)
        // if (resolve) { resolve() }
      },
      fail (res) {
        // if (reject) { reject('no ') }
      }
    })
  },

  query_group_field: function (e) {
    let that = this
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    wx.request({
      url: 'http://154.8.172.132/query_group_field',
      method: 'POST',

      data: {
        sessionCode: sessionCode
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('query_group_field返回', res)
        that.setData({
          'fieldList': res.data.arr
        })
        console.log('fieldList', that.data.fieldList)
        // if (resolve) { resolve() }
      },
      fail (res) {
        // if (reject) { reject('no ') }
      }
    })
  },

  query_group_mine: function (e) {
    let that = this
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    wx.request({
      url: 'http://154.8.172.132/query_group_mine',
      method: 'POST',

      data: {
        sessionCode: sessionCode
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('query_group_mine返回', res)
        that.setData({
          'myList': res.data.arr
        })
        console.log('myList', that.data.myList)
        // if (resolve) { resolve() }
      },
      fail (res) {
        // if (reject) { reject('no ') }
      }
    })
  },

  switchNav: function (e) {
    var page = this
    var id = e.target.id
    if (this.data.currentTab == id) {
      return false
    } else {
      page.setData({
        currentTab: id
      })
    }
    page.setData({
      active: id
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
      groupList: curList
    })
    that.loadGroupList()
  },

  loadGroupList: function () {
    console.log('load group')
    console.log(this.data.resourceList)
    this.setData({
      showResouceList: this.data.resourceList
    })
  },

  readmore: function (e) {
    console.log('e.currentTarget:', e.currentTarget)

    let num = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/groups/group_info?num=' + num
    })
  },

  upper (e) {
    console.log(e)
  },

  lower (e) {
    console.log(e)
  },

  scroll (e) {
    console.log(e)
  }
})
