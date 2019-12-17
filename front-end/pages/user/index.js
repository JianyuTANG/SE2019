var app = getApp()

Page({
  data: {
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
    showResourceList: []
  },
  onChange (event) {
    this.setData({
      activeNames: event.detail
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
