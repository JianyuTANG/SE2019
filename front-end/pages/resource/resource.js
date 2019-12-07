// pages/me/me.js
Page({

  data: {
    list: [{
      text: '全部资源'
    }, {
      text: '精选推荐'
    }, {
      text: '我中意的'
    }, {
      text: '我发布的'
    }],
    resourceList: [],
    showResouceList: [],
    allList: [],
    recommendList: [],
    likeList: [],
    issueList: [],
    listIndex: 0
  },

  onShow: function () {
    // 以下从服务器获取信息
    this.query_res_all()
    let lists = [0, 0, 0, 0]
    lists[0] = wx.getStorageSync('allList')
    lists[1] = wx.getStorageSync('domesticList')
    lists[2] = wx.getStorageSync('overseasList')
    lists[3] = wx.getStorageSync('interestList')
    console.log("全部资源：",lists[0])
    //this.view_res()
    this.setData({
      resourceList: lists[this.data.listIndex],
      allList: lists[0],
      recommendList: lists[1],
      likeList: lists[2],
      issueList: lists[3]
    })
    this.loadResouceList()

    // let lists = [this.data.facultyList, this.data.domesticList, this.data.overseasList, this.data.interestList]
  },

  readmore: function (e) {
    console.log('e.currentTarget:',e.currentTarget)
    let resID = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/resource/detail?resID=' + resID
    })
  },

  addResource: function (e) {
    wx.navigateTo({
      url: '/pages/resource/add'
    })
  },

  query_res_all: function (e) {
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    var openid
    openid = wx.getStorageSync('openid')
    wx.request({
      url: 'http://127.0.0.1:8000/query_res_all',
      method: 'POST',

      data: {
        sessionCode: sessionCode,
        openid: "asdfqwer",
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("query_res_all返回值",res)
        //allList
        wx.setStorageSync('allList', res.data.res_list)
      }
    })
  },

  // view_res: function (e) {
  //   var sessionCode
  //   sessionCode = wx.getStorageSync('sessionCode')
  //   var openid
  //   openid = wx.getStorageSync('openid')
  //   wx.request({
  //     url: 'http://127.0.0.1:8000/view_res',
  //     method: 'POST',

  //     data: {
  //       sessionCode: sessionCode,
  //       openid: openid,
  //       resID: "25",
  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success(res) {
  //       console.log(res)
  //     }
  //   })
  // },

  loadResouceList: function () {
    this.setData({
      showResouceList: this.data.resourceList
    })
  },

  tabChange: function (e) {
    let index = e.detail.index
    switch (index) {
      case 0:
        this.setData({
          resourceList: this.data.allList
        })
        break
      case 1:
        this.setData({
          resourceList: this.data.recommendList
        })
        break
      case 2:
        this.setData({
          resourceList: this.data.likeList
        })
        break
      case 3:
        this.setData({
          resourceList: this.data.issueList
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
  search: function (e) {
    console.log(e)
    let value = e.detail.value

    let items = []
    for (let item of this.data.resourceList) {
      if (this.searchItem(item, value)) {
        items.push(item)
      }
    }

    this.setData({
      showResouceList: items
    })
  }
})
