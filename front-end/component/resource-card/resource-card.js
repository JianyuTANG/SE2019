Component({

  properties: {

    coverImg: {
      type: String,
      value: 'baseUrlwithoutTailLine'
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
      type: Boolean,
      value: false
    },
    resID: {
      type: Number,
      value: 0
    },
    canChange: {
      type: Boolean,
      value: false
    }
  },
  data: {
    contactIcon: '/assets/activity.png',
    telephoneIcon: '/assets/activity.png',
    emailIcon: '/assets/activity.png',
    likeIcon: '/assets/like.png',
    unlikeIcon: '/assets/unlike.png'
  },
  toStr: function (value) {
    return value.subsubstring(8)
  },
  methods: {
    readmore: function () {
      // console.log('readmore')
      // console.log(this.data.imageSrc)
      this.triggerEvent('readmore')
    },
    switch_interest: function () {
      this.triggerEvent('switch_interest')
    },
    change: function () {
      this.triggerEvent('change')
    },
    delete: function () {
      this.triggerEvent('delete')
    }

  }
})
