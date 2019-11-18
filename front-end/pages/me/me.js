// pages/me/me.js
Page({

  data: {
    avatar: '',
    name: '',
    activities: []
  },

  testActivities: function () {
    let tActivities = [
      {
        type: 'test_type',
        title: 'test_title',
        starter: 'test_starter',
        date: 'test_date',
        tarPeople: 255,
        curPeople: 0
      }
    ]
    let activities = this.data.activities
    for (let i = 0; i < 5; i++) {
      activities = activities.concat(tActivities)
    }
    this.setData({
      activities: activities
    })
  },

  navToActivity: function (e) {
    let index = e.currentTarget.dataset.index
    let activities = this.data.activities

    console.log(activities[index])
  },

  onShow: function () {
    this.setData({
      avatar: wx.getStorageSync('avatar') || 'https://yunlaiwu0.cn-bj.ufileos.com/teacher_avatar.png',
      name: wx.getStorageSync('name') || ''
    })
    this.testActivities()
  }

})
