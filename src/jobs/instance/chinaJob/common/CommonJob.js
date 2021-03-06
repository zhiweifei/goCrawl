'use strict'
const coHandler = require('src/common/co-handler')
const Common = require('src/classes/CommonJob')
const cheerio = require('cheerio')
const nightmare = require('src/common/nightmare')
// const logger = require('src/common/bunyanLogger')

class CommonJob extends Common {
  constructor (config) {
    super(config)
    this.config = config
  }

  getCount (url) {
    const self = this
    return coHandler(function * () {
      let res = {}
      const html = yield self.getHTML(url, 'postList')
      const $ = cheerio.load(html)

      res.totalPageCount = $('.pagerselect>option:last-child').attr('value').trim()
      res.postCount = $('tbody tr').text().match(/Total (\d+) Records/)[1].trim()
      console.log('res' + res.totalPageCount, res.postCount)
      return Promise.resolve(res)
    })
  }

  getHTML (url, which) {
    // const self = this
    let selector
    if (which === 'jobPost') {
      selector = '#__01'
    } else if (which === 'postList') {
      selector = 'form[name="common"]'
    }
    return coHandler(function * () {
      let html
      try {
        html = yield nightmare
                  .goto(url)
                  .exists(selector)
                  .evaluate(function () {
                    return document.getElementsByTagName('body')[0].innerHTML
                  })
      } catch (e) {
        console.error(`cannot get html:${e}`)
        return Promise.reject(e)
      }
      console.log('dne')
      return Promise.resolve(html)
    })
  }
  // next prototype methods
  replaceColon (value = '') {
    return value.replace(/^:/, '')
  }
}

module.exports = CommonJob
