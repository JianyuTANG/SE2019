Component({

  properties: {
    title: {
      type: String,
      value: '厚德载物小分队'
    },
    description: {
      type: String,
      value: '一个优秀的组织'
    },
    advisorArr: {
      type: String,
      value: '辅导员'
    },
    length: {
      type: String,
      value: 0
    }
  },

  data: {
    masterIcon: '/assets/square.png',
    memberIcon: '/assets/me.png'
  },

  methods: {
    readmore: function () {
      console.log('readGroup')
      this.triggerEvent('readmore')
    }
  }
})
