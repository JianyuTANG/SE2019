Component({

  properties: {
    title: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    },
    contact: {
      type: String,
      value: ''
    },
    telephone: {
      type: String,
      value: ''
    },
    email: {
      type: String,
      value: ''
    }
  },

  data: {
    contactIcon: '/assets/activity.png',
    telephoneIcon: '/assets/activity.png',
    emailIcon: '/assets/activity.png'

  },

  methods: {
    readmore: function () {
      console.log('readmore')
      this.triggerEvent('readmore')
    }
  }
})
