Component({

  properties: {
    imgUrl: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    name: {
      type: String,
      value: ''
    },
    contact: {
      type: String,
      value: ''
    },
    due: {
      type: String,
      value: ''
    },
    interested: {
      type: String,
      value: ''
    },
    resID: {
      type: Number,
      value: 0
    }
  },
  data: {
    contactIcon: '/assets/activity.png',
    telephoneIcon: '/assets/activity.png',
    emailIcon: '/assets/activity.png',
    likeIcon: '/assets/like.png',
    unlikeIcon: '/assets/unlike.png'
  },

  methods: {
    readmore: function () {
      // console.log('readmore')
      // console.log(this.data.imageSrc)
      this.triggerEvent('readmore')
    }
  }
})
