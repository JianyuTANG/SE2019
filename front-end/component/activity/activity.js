Component({

  properties: {
    type: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    starter: {
      type: String,
      value: ''
    },
    date: {
      type: String,
      value: ''
    },
    tarPeople: {
      type: Number,
      value: 0
    },
    curPeople: {
      type: Number,
      value: 0
    }
  },

  data: {
    collapsed: false
  },

  methods: {
    toggleExtra: function () {
      this.collapsed = !this.collapsed
      this.setData({
        collapsed: this.collapsed
      })
    },
    readmore: function () {
      console.log('readmore')
      this.triggerEvent('readmore')
    }
  }
})
