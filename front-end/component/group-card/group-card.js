Component({

  properties: {
    title: {
      type: String,
      value: '一号中队'
    },
    intro: {
      type: String,
      value: '一个神秘的组织'
    },
    master: {
      type: String,
      value: 'You Know Who'
    },
    num: {
      type: String,
      value: '1'
    }
  },

  data: {
    masterIcon: '/assets/square.png',
    memberIcon: '/assets/me.png'
  },

  methods: {
    readmore: function () {
      console.log('readmore')
      this.triggerEvent('readmore')
    }
  }
})
