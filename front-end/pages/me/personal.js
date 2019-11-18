// eslint-disable-next-line camelcase
import { areaList } from '../../data/area.js'// 城市的表
import { fieldList } from '../../data/field.js'// 工作领域的表
const app = getApp()
const sessionCode = '123456' // 假如我们有一个sessionCode
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
    basicData: { // 读取的用户的基本数据
      name: '',
      num: '',
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
    formText: {
      city: '请选择', // 默认显示文本
      field: '请选择'
    },
    // 规则中暂时只有手机号码,email, 城市, 和 行业领域必填
    rules: [
      {
        name: 'telephone',
        rules: [{ required: true, message: '电话必填' }, { mobile: true, message: '电话应该有正确格式' }]
      },
      {
        name: 'email',
        rules: [{ required: true, message: '邮箱必填' }, { email: true, message: '邮箱应该有正确格式' }]
      },
      {
        name: 'cityCode',
        rules: { required: true, message: '城市是必填项' }
      }, {
        name: 'fieldCode',
        rules: { required: true, message: '行业领域是必填项' }
      }]
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
    let city = areaList['city_list'][formData.cityCode] || '请选择'
    let field = fieldList['city_list'][formData.fieldCode] || '请选择'
    this.setData({
      'formText.city': city,
      'formText.field': field
    })
  },
  // ---------------------------------------以下是和后端联系的函数--------------------------
  getInfo () {
    // 获取用户的个人信息,填写表格
    let that = this
    wx.request({
      url: that.data.getInfoUrl,
      data: {
        sessionCode: sessionCode
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res)
        console.log(res.data)
        this.setData({
          'basicData.name': res.data.name,
          'basicData.num': res.data.num,
          'basicData.identity': res.data.identity,
          'basicData.department': res.data.department,
          'formData.cityCode': res.data.city,
          'formData.fieldCode': res.data.field,
          'formData.telephone': res.data.tel,
          'formData.email': res.data.email
        })
        that.setInfo()
      }
    })
  },
  changeInfo () {
    // 根据用户填些信息,更新用户个人信息
    let that = this
    let formData = that.data.formData
    let basicData = that.data.basicData
    wx.request({
      url: that.data.changeInfoUrl, // 仅为示例，并非真实的接口地址
      data: {
        sessionCode: sessionCode,
        tel: formData.telephone,
        email: formData.email,
        selfDiscription: formData.content,
        city: formData.cityCode,
        field: formData.fieldCode,
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
  formTextareaBlur (e) {
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
  }
})
