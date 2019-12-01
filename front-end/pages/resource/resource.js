// pages/me/me.js
Page({

  data: {
    list: [{
      text: '院系'
    }, {
      text: '国内'
    }, {
      text: '海外'
    }, {
      text: '行业兴趣'
    }],
    resourceList: [],
    showResouceList: [],
    facultyList: [],
    domesticList: [],
    overseasList: [],
    interestList: [],
    listIndex: 0
  },

  onShow: function () {
    // 以下用本地存储模拟从服务器获取信息
    let lists = [0, 0, 0, 0]
    lists[0] = wx.getStorageSync('facultyList')
    lists[1] = wx.getStorageSync('domesticList')
    lists[2] = wx.getStorageSync('overseasList')
    lists[3] = wx.getStorageSync('interestList')
    this.setData({
      resourceList: lists[this.data.listIndex],
      facultyList: lists[0],
      domesticList: lists[1],
      overseasList: lists[2],
      interestList: lists[3]
    })
    this.loadResouceList()

    // let lists = [this.data.facultyList, this.data.domesticList, this.data.overseasList, this.data.interestList]
  },

  readmore: function (e) {
    let detailId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/resource/detail?detailId=' + detailId
    })
  },

  addResource: function (e) {
    wx.navigateTo({
      url: '/pages/resource/add'
    })
  },

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
