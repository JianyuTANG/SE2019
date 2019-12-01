import { activityTypes } from '../../data/activityTypes'

Component({
  properties: {
    tagList: {
      type: Array,
      value: []
    },
    curTags: {
      type: Array,
      value: []
    }
  },

  data: {
    activeNames: []
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      let tagList = this.properties.tagList
      console.log('--------------------attached ')
      console.log(this.properties.tagList)
      let len = tagList.length
      let activeNames = Array.from({ length: len }).map((v, k) => k)
      console.log(activeNames)
      this.setData({
        activeNames: activeNames
      })
    }
  },
  methods: {
    fakeHandle: function (e) {

    },
    closeTag: function (e) {
      console.log(e)
      let index = e.currentTarget.dataset.index
      console.log(index)
      this.triggerEvent('closeTag', {
        index: index
      })
    },
    onChange: function (e) {
      console.log(e)
      this.setData({
        activeNames: e.detail
      })
    },
    addTag: function (e) {
      console.log(e)
      let name = e.currentTarget.dataset.name
      this.triggerEvent('addTag', {
        name: name
      })
    }
  }
})
