'use strict'

/// ///////////////////////////
/// GET DATA                 //
/// ///////////////////////////
const fetch = require('node-fetch')
const ora = require('ora')
const wtf = require('wtf_wikipedia')

const getSuggestedTopic = async (userInput, lang) => {
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
    console.log('sorry, there is a problem with that request')
    process.exit(1)
  }
}

const getArticle = async (userPick, lang) => {
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
    console.log('sorry, there is a problem with that request')
    process.exit(1)
  }
}

exports.getSuggestedTopic = getSuggestedTopic
exports.getArticle = getArticle

