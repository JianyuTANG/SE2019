// pages/groups/groups.js
Page({

  data: {
    
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