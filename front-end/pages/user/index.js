const app = getApp()
Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    baseUrlPrefix: app.globalData.baseUrl.substr(0, app.globalData.baseUrl.length - 1),
    queryUrl: app.globalData.baseUrl + 'query_res_by_openid',
    user: {},
    repo: [],
    prs: [],
    language: [],
    activeNames: ['1'],
    avatarUrl: '',
    name: 'test',
    email: 'abc',
    telephone: 123,
    content: '123',
    showResouceList: []
  },
  onChange (event) {
    this.setData({
      activeNames: event.detail
    })
  },

  onShow: function () {
    let that = this
    let promise = new Promise((resolve, reject) => {
      that.query_res(resolve, reject)
    })
    promise.then((res) => {
      console.log(res)
      let resList = res.data.res_list.filter(d => d).map(item => {
        let x = item
        x['coverImg'] = that.data.baseUrlPrefix + item['coverImg']
        return x
      })
      console.log(resList)
      that.setData({
        showResouceList: resList
      })
    })
  },

  query_res: function (resolve, reject) {
    var sessionCode
    sessionCode = wx.getStorageSync('sessionCode')
    var openid
    openid = wx.getStorageSync('openid')
    let tOpenid = 'o06Ms5PUJeTEFrMLYnjNf-mM_CAc'
    let that = this
    let url = this.data.queryUrl
    wx.request({
      url: url,
      method: 'POST',

      data: {
        sessionCode: sessionCode,
        openid: openid,
        targetOpenid: tOpenid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log('switch_interest返回值', res)
        if (res.statusCode === 200) {
          resolve(res)
        } else {
          reject(new Error('server rejects'))
        }
      // allList
      },
      fail: (res) => {
        reject(new Error('server rejects'))
      }
    })
  },

  onShareAppMessage: function () {
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/page/user?id=123'
    }
  },

  getYear: function (date) {
    return new Date(date).getFullYear()
  },

  computePopularity: function (repo) {
    return repo.stargazers_count * 2 + parseInt(repo.forks_count)
  },

  collectPr: function (prs) {
    prs = prs.reduce(function (p, c) {
      if (!p[c.repository_url]) {
        p[c.repository_url] = {
          popularity: 1
        }
      } else {
        p[c.repository_url].popularity += 1
      }
      return p
    }, {})

    return Object.keys(prs).map(function (v) {
      return {
        name: v.replace('https://api.github.com/repos/', ''),
        popularity: prs[v].popularity
      }
    })
  },

  /**
	 * [{ language }] => [{ xxx: { popularity: xxx }}]
	 */
  collectLanguage: function (repo) {
    var language = {}
    var total = 0
    repo.forEach(function (r) {
      var lang = r.language
      if (!lang) {
        return false
      } else if (!language[lang]) {
        language[lang] = {
          popularity: 1
        }
      } else {
        language[lang].popularity += 1
      }
      total++
    })

    return Object.keys(language).map(function (l) {
      return {
        name: l,
        percent: Math.round(language[l].popularity / total * 100),
        popularity: language[l].popularity
      }
    })
  },

  onLoad: function () {
    // var detail = wx.getStorageSync(app.storageName) || {}
    // var repo = detail.repo.filter(function (r) {
    //   return !r.fork
    // })

    // var prs = this.collectPr(detail.pr.items)

    // detail.user.year = this.getYear(detail.user.created_at)

    // repo.sort(function (p, c) {
    //   return (this.computePopularity(p) > this.computePopularity(c))
    // }).reverse()

    // prs.sort(function (p, c) {
    //   return p.popularity > c.popularity
    // }).reverse()

    // this.setData({
    //   user: detail.user,
    //   repo: repo.slice(0, 5),
    //   prs: prs.slice(0, 5),
    //   language: this.collectLanguage(repo)
    // })
  }
})
