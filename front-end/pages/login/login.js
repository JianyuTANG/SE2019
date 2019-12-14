Page({
  data: {
    focus: false,
    inputValue: '',
    // 可以被修改的提交表单的数据
    formData: {
      name: '',
      num: '',
      classmate: '',
      advisor: '',
      identity: 0
    },
    items: [
      { name: '0', value: '本期学员', checked: 'true' },
      { name: '1', value: '本期导员' },
    ],

    // 规则中有一些必填
    rules: [
      {
        name: 'name',
        rules: [{ required: true, message: '个人姓名必填' }, { mobile: true, message: '个人姓名应该有正确格式' }]
      },
      {
        name: 'num',
        rules: [{ required: true, message: '期数必填' }, { email: true, message: '期数应该有正确格式' }]
      },
      {
        name: 'classmate',
        rules: { required: true, message: '同期成员是必填项' }
      }, {
        name: 'advisor',
        rules: { required: true, message: '辅导员姓名是必填项' }
      },
      {
        name: 'identity',
        rules: { required: true, message: '0 学生 1 辅导员是必填项' }
      }]

  },

  onLoad: function () {
  },

  radioChange: function (e) {
    let that = this
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
    console.log(that.data.formData)
  },

  submitForm: function (e) {
    let that = this
    this.verifySuccess
  },

  bindKeyInput: function (e) {
    let that = this
    this.setData({
      inputValue: e.detail.value
    })
  },

  bindReplaceInput: function (e) {
    let that = this
    var value = e.detail.value
    var pos = e.detail.cursor
    var left
    if (pos !== -1) {
      // 光标在中间
      left = e.detail.value.slice(0, pos)
      // 计算光标的位置
      pos = left.replace(/11/g, '2').length
    }
    // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/11/g, '2'),
      cursor: pos
    }
    // 或者直接返回字符串,光标在最后边
    // return value.replace(/11/g,'2'),
  },

  bindHideKeyboard: function (e) {
    let that = this
    if (e.detail.value === '123') {
      // 收起键盘
      wx.hideKeyboard()
    }
  },
  formInputChange (e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  // ---------------------------------------以下是和后端联系的函数--------------------------
  verifyInfo () {
    // 根据用户填写的信息进行验证
    let that = this
    let formData = that.data.formData
    let basicData = that.data.basicData
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    console.log(sessionCode)
    console.log(formData)
    wx.request({
      url: 'http://154.8.172.132/verify',
      method: 'POST',

      data: {
        sessionCode: sessionCode,
        name: formData.name,
        num: formData.num,
        classmate: formData.classmate,
        advisor: formData.advisor,
        identity: formData.identity
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        if (res.data.result === 0) {
          wx.showToast({
            title: '信息验证成功',
            duration: 1000
          })
          setTimeout(wx.navigateBack, 1000)
          wx.switchTab({
            url: '/pages/me/me'
          })
        }
        else{
          wx.showToast({
            icon: 'none',
            title: '验证失败，请重新核对信息',
            duration: 1000
          })
        }
        setTimeout(wx.navigateBack, 1000)
        console.log(res)
      }
    })
  },

  verifySuccess: function (e) {
    let that = this
    console.log('验证成功，即将跳转到个人界面')
    wx.switchTab({
      url: '/pages/me/me'
    })
  },

  correctInfo: function () {
    wx.showToast({
      title: '信息验证成功',
      duration: 1000
    })
    setTimeout(wx.navigateBack, 1000)
  },

})
