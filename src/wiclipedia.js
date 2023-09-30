'use strict'

const qoa = require('qoa')
const boxen = require('boxen')
const {italic, yellow, red, bold} = require('kleur')

const header = require('./header')
const fetch = require('./fetch-data')
const prompt = require('./prompt')
const config = require('./config')
const options = require('./boxen-options')

/**
 * Clears the console and logs the app name.
 */
async function clearConsoleAndLogHeader() {
  process.stdout.write('\u001Bc') // Clear the console
  await header.logAppName()
}

/**
 * Wrapper function for handling user picked choices.
 * @param {Object} input - The input object containing user's choice.
 * @param {string} lang - The current language setting.
 */
async function handleUserChoices(input, lang) {
  const choice = input.userPick
  if (choice.includes('(Try another search)')) {
    await clearConsoleAndLogHeader()
    return initiateSearch()
  }

  if (choice.includes('(Try another random)')) {
    await clearConsoleAndLogHeader()
    return displayRandomArticlesList()
  }

  if (choice.includes('(Quit)')) {
    process.exit(1)
  }

  const response = await fetch.getArticle(choice, lang)
  config.storeSearches(choice, lang)
  displayArticle(response)
}

/**
 * Fills an interactive menu with topic names.
 * @param {Array} topics - Array of topics from Wikipedia API.
 * @param {string} promptName - The name of the prompt to fill.
 */
function fillInteractiveTopicsName(topics, promptName) {
  topics.forEach(item => {
    prompt[promptName].menu.push(item.title || item.article)
  })

  // Additional menu items based on prompt type
  if (promptName === 'randomInteractive') {
    prompt[promptName].menu.push(yellow('(Try another random)'))
  }

  prompt[promptName].menu.push(yellow('(Try another search)'))
  prompt[promptName].menu.push(red('(Quit)'))
}

/**
 * Displays an article.
 * @param {Object} result - The result object from the API call.
 */
function displayArticle(result) {
  const articleName = bold(result.title)
  const link = yellow(result.url)
  const boxContent = `${articleName} - ${link}`
  console.log(boxen(boxContent, options.boxenOptions('blue')))
  console.log(result.text)
}

/**
 * Initiates a new search.
 */
async function initiateSearch() {
  await askForATopic()
  await refineTopics()
}

/**
 * Asks the user for a topic.
 */
async function askForATopic() {
  const input = await qoa.prompt(prompt.topicQuestion)
  const lang = await config.checkLang()
  const suggestedTopics = await fetch.getSuggestedTopic(input.userSearch, lang)
  fillInteractiveTopicsName(suggestedTopics, 'topicInteractive')
}

/**
 * Refines the topic based on user input.
 */
async function refineTopics() {
  const input = await qoa.interactive(prompt.topicInteractive)
  const lang = await config.checkLang()
  await handleUserChoices(input, lang)
}

/**
 * Asks the user if they want to perform another search.
 */
async function searchAgain() {
  const input = await qoa.confirm(prompt.topicRedo)
  if (input.redo) {
    await clearConsoleAndLogHeader()
    await initiateSearch()
    await searchAgain()
  } else {
    process.exit(1)
  }
}

// Main functions

/**
 * Launches the program by initiating a new search and handles subsequent search requests.
 * @returns {Promise<void>}
 */
exports.launchProgram = async () => {
  await config.model
  await clearConsoleAndLogHeader()
  await initiateSearch()
  await searchAgain()
}

/**
* Allows the user to set a preferred language for displayed articles.
* @returns {Promise<void>}
*/
exports.setLang = async () => {
  console.log(italic('full ISO codes list here -> https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes'))
  const input = await qoa.prompt(prompt.langQuestion)
  const response = await config.storeLanguage(input.lang)
  const {name, nativeName} = response
  console.log(`you chose: ${name} (${nativeName})`)
}

/**
* Allows the user to clear all previous searches.
*/
exports.clearHistory = () => {
  config.clearHistory()
  console.log('history is clear now')
}

/**
 * Allows the user to display all previous searches.
 * @returns {Promise<void>}
 */
exports.displayPreviousSearches = async () => {
  const history = await config.retrieveHistory()

  if (history.length === 0) {
    console.log('No previous searches found.')
    return
  }

  history.forEach((search, index) => {
    console.log(`${index + 1}. ${search.topic} (${search.lang})`)
  })
}

/**
 * Displays the most viewed articles from the previous day.
 * @returns {Promise<void>}
 */
exports.mostViewedYesterday = async () => {
  const lang = await config.checkLang()
  const articles = await fetch.getMostViewed(lang)
  fillInteractiveTopicsName(articles, 'mostViewedInteractive')
  const input = await qoa.interactive(prompt.mostViewedInteractive)
  await handleUserChoices(input, lang)
}

/**
 * Displays a list of random articles.
 * @returns {Promise<void>}
 */
async function displayRandomArticlesList() {
  const lang = await config.checkLang()
  const randomArticles = await fetch.getRandomArticles(lang)
  fillInteractiveTopicsName(randomArticles, 'randomInteractive')
  const input = await qoa.interactive(prompt.randomInteractive)
  await handleUserChoices(input, lang)
}

exports.displayRandomArticlesList = displayRandomArticlesList
