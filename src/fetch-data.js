'use strict'

const fetch = require('node-fetch')
const ora = require('ora')
const wtf = require('wtf_wikipedia')

const BASE_PATH = '/w/api.php'
const JSON_FORMAT = 'json'

/**
 * Generates the endpoint URL from the given domain and parameters.
 *
 * @param {string} domain - The domain for the Wikipedia API.
 * @param {Object} params - The parameters for the API request.
 * @returns {string} - The endpoint URL.
 */
const getEndpoint = (domain, parameters) => {
  const queryString = new URLSearchParams(parameters).toString()
  return `${domain}${BASE_PATH}?${queryString}`
}

/**
 * Fetches data from the given endpoint URL.
 *
 * @param {string} endpoint - The endpoint URL.
 * @returns {Promise<Object>} - The JSON data.
 */
const fetchData = async endpoint => {
  const spinner = ora('Waiting for the response...').start()

  try {
    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText)
    }

    const data = await response.json()
    spinner.stop()
    return data
  } catch (error) {
    spinner.stop()
    console.error('Sorry, there is a problem with that request:', error)
    process.exit(1)
  }
}

/**
 * Gets suggested topics based on user input.
 *
 * @param {string} userInput - The user's input.
 * @param {string} lang - The language for the Wikipedia API.
 * @returns {Promise<Array>} - The suggested topics.
 */
const getSuggestedTopic = async (userInput, lang) => {
  const domain = `https://${lang}.wikipedia.org`
  const parameters = {
    action: 'query',
    format: JSON_FORMAT,
    generator: 'search',
    gsrnamespace: 0,
    gsrsearch: userInput
  }
  const endpoint = getEndpoint(domain, parameters)

  const data = await fetchData(endpoint)
  return Object.values(data.query.pages)
}

/**
 * Gets random suggestions from Wikipedia.
 *
 * @param {string} lang - The language for the Wikipedia API.
 * @returns {Promise<Array>} - The random suggestions.
 */
const getRandomSuggestions = async lang => {
  const domain = `https://${lang}.wikipedia.org`
  const parameters = {
    action: 'query',
    format: JSON_FORMAT,
    list: 'random',
    rnlimit: 10,
    rnnamespace: 0
  }
  const endpoint = getEndpoint(domain, parameters)

  const data = await fetchData(endpoint)
  return Object.values(data.query.random)
}

/**
 * Gets the article based on user pick.
 *
 * @param {string} userPick - The user's pick.
 * @param {string} lang - The language for the Wikipedia API.
 * @returns {Promise<Object>} - The article data.
 */
const getArticle = async (userPick, lang) => {
  const spinner = ora('Waiting for the article...').start()

  try {
    const doc = await wtf.fetch(userPick, lang)
    const result = {
      url: doc.url(),
      title: doc.title(),
      text: `${doc.sections(0).text()}\n`
    }

    spinner.stop()
    return result
  } catch (error) {
    spinner.stop()
    console.error('Sorry, there is a problem with that request:', error)
    process.exit(1)
  }
}

/**
 * Gets the most viewed articles from yesterday.
 *
 * @returns {Promise<Array>} - The most viewed articles.
 */
const mostViewedYesterday = async () => {
  const date = new Date()
  date.setDate(date.getDate() - 1) // Set to yesterday's date
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Pad single digit months with a 0
  const day = String(date.getDate()).padStart(2, '0') // Pad single digit days with a 0
  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${year}/${month}/${day}`

  const data = await fetchData(url)
  return data.items[0].articles.slice(0, 17).filter(
    object => object.article !== 'Main_Page' && object.article !== 'Special:Search'
  )
}

module.exports = {
  getSuggestedTopic,
  getRandomSuggestions,
  getArticle,
  mostViewedYesterday
}
