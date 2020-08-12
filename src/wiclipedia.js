'use strict'

/// //////////////////////
/// WICLIPEDIA          //
/// //////////////////////

const qoa = require('qoa')
const boxen = require('boxen')
const {italic, yellow, red, bold} = require('kleur')

const header = require('./header')
const fetch = require('./fetch-data')
const prompt = require('./prompt')
const config = require('./config')
const options = require('./boxen-options')

/**
 * Check the user's answer picked from the prompt.
 * Check specifically if the user decided to quit the program or wanted to make another search
 * @param  {String} input The picked choice after prompt
 */
function _checkUserAnswers(input, lang) {
  if (input.userPick.includes('(Try another search)')) {
    process.stdout.write('\u001Bc') // Clear the console
    header.logAppName()
    prompt.topicInteractive.menu = []
    return _search()
  }

  if (input.userPick.includes('(Try another random)')) {
    process.stdout.write('\u001Bc') // Clear the console
    prompt.randomInteractive.menu = []
    return displayRandomArticlesList()
  }

  if (input.userPick.includes('(Quit)')) {
    process.exit(1)
  }

  config.storeSearches(input.userPick, lang)
}

/**
 * Fill an array with all possibles values for interactive menu based prompt
 * @param  {Array} topics set of values coming from wikipedia API
 * @param  {String} promptName Allow to pick the right prompt
 */
function _fillInteractiveTopicsName(topics, promptName) {
  topics.forEach(item => {
    prompt[promptName].menu.push(item.title || item.article)
  })

  if (promptName === 'randomInteractive') {
    prompt[promptName].menu.push(yellow('(Try another random)')) 
  }
  prompt[promptName].menu.push(yellow('(Try another search)'))
  prompt[promptName].menu.push(red('(Quit)'))
}

/**
 * Log / display the article summaries choosen by the user
 * @param  {Object} result the response object received from the API call
 */
function _displayArticle(result) {
  const articleName = bold(result.title)
  const link = yellow(result.url)
  const lineLength = process.stdout.columns

  console.log(boxen(`${articleName} - ${link}`, options.boxenOptions('blue')))
  console.log(lineLength < 85 ? result.text : _lineWrapper(result.text))
}

/**
 * Format the logged article summary to avoid long line of text and offer better reading experience
 * @param  {String} text the summary received from the API call
 */
function _lineWrapper(text) {
  let index = 0
  return text
    .split('')
    .map(char => {
      if (char === '\n') {
        index = 0
      }

      if (char === ' ' && index > 80) {
        char = '\n'
        index = 0
      }

      index++
      return char
    }).join('')
}

/**
 * Display a prompt that helps user to set a language
 * Save the answer to a json file
 * Display a confirmation to the user
 */
async function _askForlanguage() {
  const isLangAlreadySet = await config.checkLang()
  if (!isLangAlreadySet) {
    console.log(italic('Full ISO codes list here -> https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes'))
    const input = await qoa.prompt(prompt.langQuestion)
    const response = await config.storeLanguage(input.lang)
    const {name, nativeName} = response
    console.log(`you chose: ${name} (${nativeName})`)
  }
}

/**
 * Display a prompt that ask the user to choose a topic
 * check the stored language config
 * call the wikipedia API for a set of topics
 */
async function _askForATopic() {
  const input = await qoa.prompt(prompt.topicQuestion)
  const lang = await config.checkLang()
  const suggestedTopics = await fetch.getSuggestedTopic(input.userSearch, lang)
  _fillInteractiveTopicsName(suggestedTopics, 'topicInteractive')
}

/**
 * Display a prompt that ask the user to choose between a list of topics
 * check the stored language config
 * call the wikipedia API to request the choosen article
 * save the search
 */
async function _refineTopics() {
  const input = await qoa.interactive(prompt.topicInteractive)
  const lang = await config.checkLang()
  await _checkUserAnswers(input, lang)
  const response = await fetch.getArticle(input.userPick, lang)

  _displayArticle(response)
  prompt.topicInteractive.menu = []
}

/**
 * Just calling other functions ¯\_(ツ)_/¯
 */
async function _search() {
  await _askForATopic()
  await _refineTopics()
}

/**
 * Check if the user wants to make another research
 */
async function _searchAgain() {
  const input = await qoa.confirm(prompt.topicRedo)
  if (input.redo) {
    process.stdout.write('\u001Bc') // Clear the console
    await header.logAppName()
    await _search()
    await _searchAgain()
  }

  if (!input.redo) {
    process.exit(1)
  }
}

/**
 * Check if the user wants to make another research
 */
async function _randomAgain() {
  const input = await qoa.confirm(prompt.randomAgain)
  if (input.redo) {
    process.stdout.write('\u001Bc') // Clear the console
    displayRandomArticlesList()
  }

  if (!input.redo) {
    process.exit(1)
  }
}

/**
 * Bootstrap the app
 */
exports.launchProgram = async () => {
  await config.model
  await header.logAppName()
  await _askForlanguage()
  await _search()
  await _searchAgain()
}

/**
 * Allow the user to specify a language for the displayed articles
 */
exports.setLang = async () => {
  console.log(italic('full ISO codes list here -> https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes'))
  const input = await qoa.prompt(prompt.langQuestion)
  const response = await config.storeLanguage(input.lang)
  const {name, nativeName} = response

  console.log(`you chose: ${name} (${nativeName})`)
}

/**
 * Allow the user to delete all previous searches
 */
exports.clearHistory = () => {
  config.clearHistory()

  console.log('history is clear now')
}

/**
 * Allow the user to display all previous searches
 */
exports.displayPreviousSearches = async () => {
  await header.logAppName()
  const history = await config.getHistory()
  await _fillInteractiveTopicsName(history, 'historyInteractive')
  const input = await qoa.interactive(prompt.historyInteractive)
  await _checkUserAnswers(input)

  const lang = input.userPick.slice(0, input.userPick.indexOf(' ')).replace(/[[\]']+/g, '')
  const title = input.userPick.slice(input.userPick.indexOf(' ') + 1)
  const response = await fetch.getArticle(title, lang)
  _displayArticle(response)
  prompt.historyInteractive.menu = []
}

/**
 * show the user the 15 most viewed articles the day before the current day
 * Pick one of them, trigger an api call and display the response
 */
exports.mostViewedYesterday = async () => {
  await header.logAppName()
  const topArticles = await fetch.mostViewedYesterday()
  _fillInteractiveTopicsName(topArticles, 'topInteractive')
  const input = await qoa.interactive(prompt.topInteractive)
  await _checkUserAnswers(input, 'en')
  const response = await fetch.getArticle(input.userPick, 'en')
  _displayArticle(response)
  prompt.topInteractive.menu = []
}

/**
 * Allow the user to display a list of random articles
 * Pick one of them, trigger an api call and display the response
 */
const displayRandomArticlesList = async () => {
  await header.logAppName()
  const lang = await config.checkLang()
  const suggestedTopics = await fetch.getRandomSuggestions(lang)
  _fillInteractiveTopicsName(suggestedTopics, 'randomInteractive')
  const input = await qoa.interactive(prompt.randomInteractive)
  await _checkUserAnswers(input, lang)
  const response = await fetch.getArticle(input.userPick, lang)
  _displayArticle(response)
  prompt.randomInteractive.menu = []
  _randomAgain()
}

exports.displayRandomArticlesList = displayRandomArticlesList
