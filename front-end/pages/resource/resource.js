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
      title: '国内清华校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23',
      imageSrc: "/assets/activity.png"
    }, {
      title: '国内清华校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23',
      imageSrc: "/assets/activity.png"
    }],
    overseasList: [{
      title: '海外清华校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23',
      imageSrc: "/assets/activity.png"
    }, {
      title: '海外清华校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23',
      imageSrc: "/assets/activity.png"
    }],
    interestList: [{
      title: '兴趣清华校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23'
    }, {
      title: '兴趣清华校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23'
    }, {
      title: '兴趣清华校友总会生命科学...',
      content: '也急需两人过柱子...',
      contact: 'test',
      telephone: '110',
      email: 'nonexist@nonexist.com',
      qualification: 'qua',
      startDate: '10/1',
      endDate: '10/23'
    }, {
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
  },

  tabChange: function (e) {
    console.log(e)
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
