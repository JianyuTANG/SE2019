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
      title: '国内清华校友总会生命科学...',
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
      title: '国内清华校友总会生命科学...',
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
      title: '海外清华校友总会生命科学...',
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
      title: '海外清华校友总会生命科学...',
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
      title: '兴趣清华校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23'
    }, {
      id: '8',
      title: '兴趣清华校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23'
    }, {
      id: '9',
      title: '兴趣清华校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23'
    }, {
      id: '10',
      title: '兴趣清华校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23'
    }]
  },

  onShow: function () {
    this.setData({
      resourceList: this.data.facultyList
    })
    // 以下用本地存储模拟从服务器获取信息
    let lists = [this.data.facultyList, this.data.domesticList, this.data.overseasList, this.data.interestList]

    for (let list of lists) {
      for (let item of list) {
        let resourceId = 'resource' + item.id
        wx.setStorageSync(resourceId, item)
      }
    }
  },

  readmore: function (e) {
    let detailId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/resource/detail?detailId=' + detailId
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
  }
})
