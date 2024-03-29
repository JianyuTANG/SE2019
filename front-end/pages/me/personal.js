// eslint-disable-next-line camelcase
import { areaList } from '../../data/area.js'// 城市的表
import { fieldList } from '../../data/field.js'// 工作领域的表
import { departList } from '../../data/department.js'
import { interestTags } from '../../data/tags.js'
const app = getApp()
// const sessionCode = wx.getStorageSync('sessionCode') // 假如我们有一个sessionCode
Page({
  data: {
    showLoading: false,
    baseUrl: app.globalData.baseUrl,
    getInfoUrl: app.globalData.baseUrl + 'view_user',
    changeInfoUrl: app.globalData.baseUrl + 'modify_user_info',
    showTopTips: false,
    areaList: areaList,
    areaPlaceholder: ['请选择', '请选择', '请选择'],
    fieldList: fieldList,
    interestTags: [],
    prefabTagList: interestTags,
    tapButtonTag: false,
    basicData: { // 读取的用户的基本数据
      name: '',
      stuNum: [],
      advNum: [],
      identity: '',
      department: ''
    }, // 可以被修改的提交表单的数据
    formData: {
      telephone: '',
      email: '',
      cityCode: '',
      fieldCode: '',
      content: ''
    },
    // 根据formData生成的文字
    basicText: {
      department: '',
      num: ''
    },
    formText: {
      city: '请选择', // 默认显示文本
      field: '请选择'
    },
    // 规则中暂时只有手机号码,email, 城市, 和 行业领域必填
    rules: []
    // rules: [
    //   {
    //     name: 'telephone',
    //     rules: [{ required: true, message: '电话必填' }, { mobile: true, message: '电话应该有正确格式' }]
    //   },
    //   {
    //     name: 'email',
    //     rules: [{ required: true, message: '邮箱必填' }, { email: true, message: '邮箱应该有正确格式' }]
    //   },
    //   {
    //     name: 'cityCode',
    //     rules: { required: true, message: '城市是必填项' }
    //   }, {
    //     name: 'fieldCode',
    //     rules: { required: true, message: '行业领域是必填项' }
    //   }]
  },
  onLoad () {
    console.log(this.data.areaList)
    this.getInfo()
  },
  // ----------------------------------设置显示文本的函数
  setInfo () {
    let formData = this.data.formData
    let city = this.selectComponent('#city')
    city.reset(formData.cityCode)
    let field = this.selectComponent('#field')
    field.reset(formData.fieldCode)
    this.setFormText()
  },
  // 设置表单中显示的文字
  setFormText () {
    let formData = this.data.formData
    let basicData = this.data.basicData
    // let numbers = basicData.num.split(',')
    // let number = numbers[basicData.identity]
    let city = areaList['city_list'][formData.cityCode] || '请选择'
    let field = fieldList['city_list'][formData.fieldCode] || '请选择'
    let depart = departList[basicData.department]
    this.setData({
      'formText.city': city,
      'formText.field': field,
      'basicText.department': depart
      // 'basicText.num': number
    })
  },
  // ---------------------------------------以下是和后端联系的函数--------------------------
  getInfo () {
    // 获取用户的个人信息,填写表格
    let that = this
    let sessionCode = wx.getStorageSync('sessionCode') // 假如我们有一个sessionCode
    console.log(sessionCode)
    wx.request({
      url: that.data.getInfoUrl,
      method: 'POST',
      data: {
        sessionCode: sessionCode
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res)
        console.log(res.data)
        let arr = []
        if (res.data.interestArr.length) {
          arr = res.data.interestArr.filter(p => p)
        }
        that.setData({
          'basicData.name': res.data.name,
          'basicData.stuNum': res.data.studentArr,
          'basicData.advNum': res.data.advisorArr,
          'basicData.identity': res.data.identity,
          'basicData.department': res.data.department,
          'formData.cityCode': res.data.city,
          'formData.fieldCode': res.data.field,
          'formData.telephone': res.data.tel,
          'formData.email': res.data.email,
          'formData.content': res.data.selfDiscription,
          'interestTags': arr
        })
        that.setInfo()
      }
    })
  },
  changeInfo () {
    // 根据用户填些信息,更新用户个人信息
    let that = this
    let formData = that.data.formData
    let sessionCode = wx.getStorageSync('sessionCode') // 假如我们有一个sessionCode
    console.log(sessionCode)
    console.log(formData.content)
    let basicData = that.data.basicData
    wx.request({
      url: that.data.changeInfoUrl, // 仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        sessionCode: sessionCode,
        tel: formData.telephone,
        email: formData.email,
        selfDiscription: formData.content,
        city: formData.cityCode,
        field: formData.fieldCode,
        interestArr: that.data.interestTags,
        wechatId: '',
        company: '',
        hobby: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        that.successSubmit()
      },
      fail (res) {
        that.failSubmit()
      },
      complete (res) {
        that.setData({ showLoading: false })
      }
    })
  },
  // ----------------------------------------------------------------------------------------
  formAreaChange (e) {
    const { field } = e.currentTarget.dataset // es6 语法糖, const {a} = b === const a = b.a
    let tar = e.detail.values[1]
    let value = ''
    console.log(value)
    if (typeof (tar) !== 'undefined' && tar.code !== '') {
      value = tar.code
    }
    console.log(value)
    this.setData({
      [`formData.${field}`]: value
    })
    this.setFormText()
  },
  formInputChange (e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  formTextareaInput (e) {
    console.log('input')
    this.setData({
      'formData.content': e.detail.value
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
        this.changeInfo()
        this.setData({ showLoading: true })
      }
    })
  },
  successSubmit: function () {
    wx.showToast({
      title: '修改成功',
      duration: 1000
    })
    setTimeout(wx.navigateBack, 1000)
  },
  failSubmit: function () {
    wx.showToast({
      icon: 'none',
      title: '连接服务器失败!',
      duration: 1000
    })
  },
  // closeLoading: function () {
  //   this.setData({
  //     showLoading: true
  //   })
  // },
  submitCancel: function () {
    wx.navigateBack()
  },
  setTag: function (e) {
    this.setData({
      'tapButtonTag': true
    })
  },
  onAddTag: function (e) {
    console.log(e)
    let name = e.detail.name
    let curTags = this.data.interestTags
    let match = curTags.filter(item => item === name)
    console.log(match)
    if (match.length === 0) {
      curTags.push(name)
    }
    console.log(curTags)
    this.setData({
      'interestTags': curTags
    })
  },
  closeTag: function (index) {
    let tags = this.data.interestTags
    tags.splice(index, 1)
    this.setData({
      'interestTags': tags
    })
  },
  onCloseTag: function (e) {
    console.log(e)
    let index = e.detail.index
    this.closeTag(index)
  },
  onButtonTag: function (e) {
    this.setData({
      'tapButtonTag': false
    })
  }
})
