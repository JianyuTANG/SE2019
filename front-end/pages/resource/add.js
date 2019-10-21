Page({
  data: {
    showTopTips: false,
    date: {
      minHour: 10,
      maxHour: 20,
      minDate: new Date().getTime(),
      maxDate: new Date(2019, 10, 1).getTime(),
      currentDate: new Date().getTime()
    },
    radioItems: [
      { name: 'cell standard', value: '0', checked: true },
      { name: 'cell standard', value: '1' }
    ],
    checkboxItems: [
      { name: 'standard is dealt for u.', value: '0', checked: true },
      { name: 'standard is dealicient for u.', value: '1' }
    ],
    formData: {
      title: '',
      contact: '',
      telephone: '',
      email: '',
      qualification: ''
    },
    rules: [{
      name: 'radio',
      rules: { required: true, message: '单选列表是必选项' }
    }, {
      name: 'checkbox',
      rules: { required: true, message: '多选列表是必选项' }
    }, {
      name: 'qq',
      rules: { required: true, message: 'qq必填' }
    }, { // 多个规则
      name: 'mobile',
      rules: [{ required: true, message: 'mobile必填' }, { mobile: true, message: 'mobile格式不对' }]
    }, {
      name: 'vcode',
      rules: { required: true, message: '验证码必填' }
    }, {
      name: 'idcard',
      rules: { required: true, message: 'idcard必填' }
    }],
    files: [{
      url: 'http://mmbiz.qpic.cn/mmbiz_png/VUIF3v9blLsicfV8ysC76e9fZzWgy8YJ2bQO58p43Lib8ncGXmuyibLY7O3hia8sWv25KCibQb7MbJW3Q7xibNzfRN7A/0'
    }, {
      loading: true
    }, {
      error: true
    }]
  },
  onLoad () {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    var radioItems = this.data.radioItems
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value
    }

    this.setData({
      radioItems: radioItems,
      [`formData.radio`]: e.detail.value
    })
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    var checkboxItems = this.data.checkboxItems; var values = e.detail.value
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true
          break
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems,
      [`formData.checkbox`]: e.detail.value
    })
  },
  formInputChange: function (e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  submitForm: function (e) {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        }
      } else {
        wx.showToast({
          title: '校验通过'
        })
      }
    })
  },
  chooseImage: function (e) {
    var that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        })
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectFile: function (files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },
  uplaodFile: function (files) {
    console.log('upload files', files)
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('some error')
      }, 1000)
    })
  },
  uploadError: function (e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess: function (e) {
    console.log('upload success', e.detail)
  },
  formatter: function (type, value) {
    if (type === 'year') {
      return `${value}年`
    } else if (type === 'month') {
      return `${value}月`
    }
    return value
  }
})
