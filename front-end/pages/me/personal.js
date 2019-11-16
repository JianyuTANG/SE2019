// eslint-disable-next-line camelcase
import { areaList } from '../../data/area.js'// 城市的表
import { fieldList } from '../../data/field.js'// 工作领域的表
Page({
  data: {
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
  },
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
    console.log(this.data.formData.content)
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
          title: '修改成功',
          duration: 500
        })
        setTimeout(wx.navigateBack, 500)
      }
    })
  },
  submitCancel: function () {
    wx.navigateBack()
  }
})
