// eslint-disable-next-line camelcase
import { areaList } from '../../data/area.js'
import { fieldList } from '../../data/field.js'
Page({
  data: {
    showTopTips: false,
    areaList: areaList,
    areaPlaceholder: ['请选择', '请选择', '请选择'],
    fieldList: fieldList,
    radioItems: [
      { name: 'cell standard', value: '0', checked: true },
      { name: 'cell standard', value: '1' }
    ],
    checkboxItems: [
      { name: 'standard is dealt for u.', value: '0', checked: true },
      { name: 'standard is dealicient for u.', value: '1' }
    ],
    basicData: {
      name: '',
      num: '',
      identity: '',
      department: ''
    },
    formData: {
      title: '',
      contact: '',
      telephone: '',
      email: '',
      qualification: '',
      content: ''
    },
    rules: [{
      name: 'title',
      rules: { required: true, message: '单选列表是必选项' }
    }, {
      name: 'contact',
      rules: { required: true, message: '多选列表是必选项' }
    }, {
      name: 'telephone',
      rules: { required: true, message: 'qq必填' }
    }, {
      name: 'email',
      rules: { required: true, message: '验证码必填' }
    }, {
      name: 'qualification',
      rules: { required: true, message: 'idcard必填' }
    }, {
      name: 'content',
      rules: { required: true, message: 'idcard必填' }
    }],
    files: [{
      url: 'http://mmbiz.qpic.cn/mmbiz_png/VUIF3v9blLsicfV8ysC76e9fZzWgy8YJ2bQO58p43Lib8ncGXmuyibLY7O3hia8sWv25KCibQb7MbJW3Q7xibNzfRN7A/0'
    }],
    tapButtonDate: false
  },
  onLoad () {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
    console.log(this.data.areaList)
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
        let id = 100
        let resourceId = 'resource' + String(id)
        let src = '/assets/activity.png'
        let info = {
          id: id,
          title: this.data.formData.title,
          content: this.data.formData.content,
          contact: this.data.formData.contact,
          telephone: this.data.formData.telephone,
          email: this.data.formData.email,
          qualification: this.data.formData.qualification,
          startDate: this.data.date.currentDate,
          endDate: this.data.date.endDate,
          imageSrc: src
        }
        let fList = wx.getStorageSync('facultyList')
        fList.push(info)
        wx.setStorageSync('facultyList', fList)
        wx.setStorageSync(resourceId, info)
        wx.navigateBack()
      }
    })
  },
  submitCancel: function () {
    wx.navigateBack()
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
        // reject('some error')
        resolve({ urls: ['127.0.0.1'] })
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
  },
  tapButtonDate: function (e) {
    this.setData({
      'tapButtonDate': false
    })
  },
  setDate: function (e) {
    this.setData({
      'tapButtonDate': true
    })
  },
  changeEndDate: function (e) {
    console.log(e)
    let timeStamp = e.detail
    let date = new Date(timeStamp).toDateString()
    this.setData({
      'date.endDay': date,
      'date.endTimeStamp': timeStamp
    })
  },
  onStatusChange: function (e) {
    console.log(e)
    const texts = e.detail.text
    this.setData({
      'formData.content': texts })
  },
  onEditorReady: function () {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  }
})
