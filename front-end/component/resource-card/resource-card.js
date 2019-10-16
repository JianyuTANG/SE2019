Component({

  properties: {
    imageSrc: {
      type: String,
      value: ''
    },
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
    qualification: {
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
    },
    startDate: {
      type: String,
      value: ''
    },
    endDate: {
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
      // console.log(this.data.imageSrc)
      this.triggerEvent('readmore')
    }
  }
})
