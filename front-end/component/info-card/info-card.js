Component({

  properties: {
    iconSrc: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    }
  },

  data: {

  },

  methods: {
    readmore: function () {
      console.log('readmore')
      this.triggerEvent('readmore')
    }
  }
})
