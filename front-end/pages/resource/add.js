import { formatTime } from '../../utils/util.js'
import { activityTypes } from '../../data/activityTypes.js'
import { tags } from '../../data/tags.js'
Page({
  data: {
    showTopTips: false,
    date: {
      minDate: new Date().getTime(),
      maxDate: new Date(2019, 10, 1).getTime(),
      currentDate: new Date().getTime(),
      endDay: '请设置',
      endTimeStamp: new Date()
    },
    formData: {
      title: '',
      contact: '',
      telephone: '',
      email: '',
      qualification: '',
      content: '',
      activityTypes: activityTypes, // 必须在这里定义,而不能setData
      type: 0,
      tagList: tags,
      tags: ['计算机', '还是计算机']
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
    files: [],
    tapButtonDate: false
  },
  onLoad () {
    console.log(activityTypes)
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)

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
    let time = new Date(timeStamp)
    let date = formatTime(time, 'yyyy/MM/dd')
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
  },

  fakeHandle: function (e) {

  },
  changeType: function (e) {
    console.log(e)
    let curValue = e.detail
    let match = activityTypes.filter(option => option.value === curValue)
    console.log(match)
    this.setData({
      'formData.type': curValue
    })
  },
  onAddTag: function (e) {
    console.log(e)
    let name = e.detail.name
    let curTags = this.data.formData.tags
    let match = curTags.filter(item => item === name)
    console.log(match)
    if (match.length === 0) {
      curTags.push(name)
    }
    console.log(curTags)
    this.setData({
      'formData.tags': curTags
    })
  },
  closeTag: function (index) {
    let tags = this.data.formData.tags
    tags.splice(index, 1)
    this.setData({
      'formData.tags': tags
    })
  },
  onTapClosTag: function (e) {
    let index = e.currentTarget.dataset
    this.closeTag(index)
  },
  onCloseTag: function (e) {
    console.log(e)
    let index = e.detail.index
    this.closeTag(index)
  }

})
