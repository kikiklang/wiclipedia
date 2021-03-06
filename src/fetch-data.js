'use strict'

/// ///////////////////////////
/// GET DATA                 //
/// ///////////////////////////
const fetch = require('node-fetch')
const ora = require('ora')
const wtf = require('wtf_wikipedia')

exports.getSuggestedTopic = async (userInput, lang) => {
  const domain = `https://${lang}.wikipedia.org`
  const path = '/w/api.php'
  const action = 'query'
  const format = 'json'
  const generator = 'search'
  const namespace = 0
  const search = userInput
  const endpoint = `${domain}${path}?action=${action}&format=${format}&generator=${generator}&gsrnamespace=${namespace}&gsrsearch=${search}`

  try {
    const spinner = ora('waiting for the response...').start()
    const response = await fetch(endpoint)
    const data = await response.json()
    const result = Object.values(data.query.pages)

    spinner.stop()

    return result
  } catch (error) {
    console.log('sorry, there is a problem with that request', error)
    process.exit(1)
  }
}

exports.getRandomSuggestions = async lang => {
  const domain = `https://${lang}.wikipedia.org`
  const path = '/w/api.php'
  const action = 'query'
  const format = 'json'
  const list = 'random'
  const rnlimit = 10
  const rnnamespace = 0
  const endpoint = `${domain}${path}?action=${action}&format=${format}&list=${list}&rnlimit=${rnlimit}&rnnamespace=${rnnamespace}`

  try {
    const spinner = ora('waiting for the response...').start()
    const response = await fetch(endpoint)
    const data = await response.json()
    const result = Object.values(data.query.random)

    spinner.stop()

    return result
  } catch (error) {
    console.log('sorry, there is a problem with that request', error)
    process.exit(1)
  }
}

exports.getArticle = async (userPick, lang) => {
  try {
    const spinner = ora('waiting for the article...').start()
    const doc = await wtf.fetch(userPick, lang)
    const result = {
      url: doc.url(),
      title: doc.title(),
      text: `${doc.sections(0).text()}\n`
    }

    spinner.stop()

    return result
  } catch (error) {
    console.log('sorry, there is a problem with that request', error)
    process.exit(1)
  }
}

exports.mostViewedYesterday = async () => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1
  const day = new Date().getDate() - 1
  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${year}/${month}/${day}`

  try {
    const spinner = ora('waiting for the response...').start()
    const response = await fetch(url)
    const data = await response.json()
    const result = data.items[0].articles.slice(0, 17).filter(object => object.article !== 'Main_Page' && object.article !== 'Special:Search')

    spinner.stop()

    return result
  } catch (error) {
    console.log('sorry, there is a problem with that request', error)
    process.exit(1)
  }
}
