// pages/groups/groups.js
Page({

  data: {
    inputShowed: false,
    inputVal: "",
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
    myGroupList: 
    [{
      title: '思源17期',
      intro: '思源17期',
      master: '高一凡',
      num: '37'
    }, {
      title: '信息技术导师学员团12期',
      intro: '信息技术导师学员团12期',
        master: '李竹',
        num: '22'
    }],
    regularList: 
    [{
      title: '思源17期',
      intro: '思源17期',
      master: '高一凡',
      num: '37'
    }, {
          title: '思源16期',
          intro: '思源16期',
        master: '成宸海',
        num: '22'
    }],
    areaList: 
      [{
        title: '思源北京分会',
        intro: '（不含雄安）',
        master: '方方',
        num: '102'
      }, {
          title: '思源雄安分会',
          intro: '思源雄安分会',
          master: '毛捷',
          num: '12'
        }, {
          title: '思源美东分会',
          intro: '思源美东分会',
          master: '陈磊',
          num: '103'
        }],
    otherList: [{
      title: '思源足球爱好者组织',
      intro: '爱好足球的伙伴请加入我们',
      master: '高一凡',
      num: '99'
    }, {
        title: '信息技术导师学员团12期',
        intro: '信息技术导师学员团12期',
        master: '李竹',
        num: '22'
      }]
  },


  groupDetail: function (e) {
    wx.navigateTo({
      url: '/pages/group_info/group_info'
    })
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });  
  },


  onShow: function () {
    this.setData({
      groupList: this.data.myGroupList
    })
  },

  tabChange: function (e) {
    console.log(e)
    let index = e.detail.index
    switch (index) {
      case 0:
        this.setData({
          groupList: this.data.myGroupList
        })
        break
      case 1:
        this.setData({
          groupList: this.data.regularList
        })
        break
      case 2:
        this.setData({
          groupList: this.data.areaList
        })
        break
      case 3:
        this.setData({
          groupList: this.data.otherList
        })
        break
    }
  }
})