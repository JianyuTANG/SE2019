import { formatTime } from '../../utils/util.js'
import { activityTypes } from '../../data/activityTypes.js'
import { tags } from '../../data/tags.js'
var sourceType = ['album']
var sizeType = ['compressed']
const app = getApp()
Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlPrefix: app.globalData.baseUrl.substr(0, app.globalData.baseUrl.length - 1),
    addResUrl: app.globalData.baseUrl + 'add_res',
    uploadImgUrl: app.globalData.baseUrl + 'upload_img',
    deleteImgUrl: app.globalData.baseUrl + 'delete_img',
    viewResUrl: app.globalData.baseUrl + 'view_res',
    modifyResUrl: app.globalData.baseUrl + 'modify_res',
    sessionCode: '',
    openid: '',
    showTopTips: false,
    isModify: false, // 是否是修改页面,默认不是
    resID: null,
    date: {
      minDate: new Date().getTime()
    },
    formData: {
      title: '',
      contact: '',
      qualification: '',
      content: '',
      endDate: '',
      activityTypes: activityTypes, // 必须在这里定义,而不能setData
      type: 0,
      tagList: tags, // 显示的预置tag
      tags: [],
      coverFile: [], // 封面图片
      appendixFiles: [] // 附件图片文件
    },
    rules: [{
      name: 'title',
      rules: { required: true, message: '标题必须填写' }
    }, {
      name: 'content',
      rules: { required: true, message: '请填写内容' }
    },
    {
      name: 'contact',
      rules: { required: true, message: '联系方式是必选项' }
    }, {
      name: 'endDate',
      rules: { required: true, message: '请设置截至日期' }
    }],

    tapButtonDate: false,
    tapButtonTag: false
  },
  loadResource: function(resID){
    let that = this
    let data = {
      resID: resID,
      sessionCode: this.data.sessionCode,
      openid: this.data.openid
    }
    wx.request({
      url: that.data.viewResUrl,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res)
        console.log(res.data)
        data = JSON.parse(res.data)
        let match = activityTypes.filter(option => option.value === data.category)
        let category = match[0].text
        this.setData({
          'formData.title': data.title,
          'formData.content': data.content,
          'formData.contact': data.contact,
          'formData.endDate': data.due,
          'formData.tags': data.tagArr,
          'formData.coverFile': data.coverImg,
          'formData.appendixFiles': data.imgArr,
          'formData.type': category
        })
      },
  onLoad (options) {

    console.log(activityTypes)
    let sessionCode = wx.getStorageSync('sessionCode')
    let openid = wx.getStorageSync('openid')
    console.log(sessionCode)
    this.setData({
      sessionCode: sessionCode,
      openid: openid
    })

    let resID = options.resID
    if (type(resID) !== 'undefined') {
      this.setData({
        resID: resID,
        isModify: false
      })

      this.loadResource(resID)
    }
  },
  formInputChange: function (e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  formTextareaInput (e) {
    this.setData({
      'formData.content': e.detail.value
    })
  },
  submitForm: function (e) {
    let that = this
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
        //根据类别决定是否是修改
        let url = that.data.addResUrl
        if(that.data.isModify)
          url = that.data.modifyResUrl
        console.log('submit ')
        //  生成用于提交的img格式串, 以 / 绝对路径开头
        let imgArr = []
        let cover = that.data.formData.coverFile[0].suffix
        console.log('submit 1')
        console.log(cover)
        for (let i of that.data.formData.appendixFiles) {
          console.log('submit img')
          imgArr.push(i.suffix)
        }
        console.log('submit img')
        // 生成提交的类别的str
        let match = activityTypes.filter(option => option.value === that.data.formData.type)
        console.log(match)
        let category = match[0].text
        console.log('submit category')
        
        let data = {
          sessionCode: that.data.sessionCode,
          resID: that.data.resID,
          openid: that.data.openid,
          coverImg: cover,
          title: that.data.formData.title,
          content: that.data.formData.content,
          due: that.data.formData.endDate,
          contact: that.data.formData.contact,
          imgArr: imgArr,
          tagArr: that.data.formData.tags,
          category: category
        }
        console.log(data)
        wx.request({
          url: url,
          method: 'POST',
          data: data,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success (res) {
            console.log(res)
            console.log(res.data)
            wx.showToast({
              title: '提交成功'
            })

            wx.navigateBack()
          }
        })
      }
    })
  },
  submitCancel: function () {
    wx.navigateBack()
  },
  uploadError: function (e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess: function (e) {
    console.log('upload success', e.detail)
  },
  tapButtonDate: function (e) {
    this.setData({
      'tapButtonDate': false
    })
  },
  tapButtonTag: function (e) {
    this.setData({
      'tapButtonTag': false
    })
  },
  setTag: function (e) {
    this.setData({
      'tapButtonTag': true
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
      'formData.endDate': date
    })
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
  },
  afterReadImg: function (e) {
    let that = this
    const { field } = e.currentTarget.dataset
    const { file } = e.detail
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: that.data.uploadImgUrl,
      filePath: file.path,
      name: 'file',
      header: {
        sessionCode: that.data.sessionCode
      },
      method: 'POST',
      success (res) {
        console.log(res)
        let resData = JSON.parse(res.data)
        console.log(resData)
        if (resData.url) {
        // 上传完成需要更新 fileList
          let files = that.data.formData[field]
          console.log(files)
          files.push({ ...file, url: that.data.baseUrlPrefix + resData.url, suffix: resData.url })
          that.setData({
            [`formData.${field}`]: files
          })
        } else {
          // 添加错误提示
          wx.showToast({
            // 提示内容
            title: '上传失败',
            // 提示图标样式：success/loading
            icon: 'loading',
            // 提示显示时间
            duration: 2000
          })
        }
      }
    })
  },
  deleteImg: function (e) {
    let that = this
    const { field } = e.currentTarget.dataset
    let { index } = e.detail
    let files = that.data.formData[field]
    files.splice(index, 1)
    that.setData({
      [`formData.${field}`]: files
    })
  }
})
