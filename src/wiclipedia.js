'use strict'

/// //////////////////////
/// WICLIPEDIA          //
/// //////////////////////

const qoa = require('qoa')
const chalk = require('chalk')
const boxen = require('boxen')
const clear = require('clear')

const header = require('./header')
const fetch = require('./fetch-data')
const prompt = require('./prompt')
const config = require('./config')
const options = require('./boxen-options')

function _checkUserAnswers(input) {
  if (input.userPick.includes('(Try another search)')) {
    clear()
    header.logAppName()
    prompt.topicInteractive.menu = []
    return _search()
  }

  if (input.userPick.includes('(Quit)')) {
    process.exit(1)
  }
}

function _fillInteractiveTopicsName(topics, promptName) {
  topics.forEach(item => {
    prompt[promptName].menu.push(item.title)
  })
  prompt[promptName].menu.push(chalk.blue.yellow('(Try another search)'))
  prompt[promptName].menu.push(chalk.blue.red('(Quit)'))
}

function _displayArticle(result) {
  const articleName = chalk.white.bold(result.title)
  const link = chalk.yellow(result.url)

  console.log(boxen(`${articleName} - ${link}`, options.boxenOptions('blue')))
  console.log(result.text)
}

async function _askForlanguage() {
  const isLangAlreadySet = await config.checkLang()
  if (!isLangAlreadySet) {
    const input = await qoa.prompt(prompt.langQuestion)
    const response = await config.storeLanguage(input.lang)
    const {name, nativeName} = response
    console.log(`you chose: ${name} (${nativeName})`)
  }
}

async function _askForATopic() {
  try {
    const input = await qoa.prompt(prompt.topicQuestion)
    const lang = await config.checkLang()
    const suggestedTopics = await fetch.getSuggestedTopic(input.userSearch, lang)
    _fillInteractiveTopicsName(suggestedTopics, 'topicInteractive')
  } catch (error) {
    console.log(error)
  }
}

async function _refineTopics() {
  const input = await qoa.interactive(prompt.topicInteractive)
  await _checkUserAnswers(input)
  const lang = await config.checkLang()
  const response = await fetch.getArticle(input.userPick, lang)

  _displayArticle(response)
  prompt.topicInteractive.menu = []
}

async function _search() {
  await _askForATopic()
  await _refineTopics()
}

async function _searchAgain() {
  const input = await qoa.confirm(prompt.topicRedo)
  if (input.redo) {
    clear()
    await header.logAppName()
    await _search()
    await _searchAgain()
  }

  if (!input.redo) {
    process.exit(1)
  }
}

exports.launchProgram = async () => {
  await header.logAppName()
  await _askForlanguage()
  await _search()
  await _searchAgain()
}

exports.setLang = async () => {
  const input = await qoa.prompt(prompt.langQuestion)
  const response = await config.storeLanguage(input.lang)
  const {name, nativeName} = response

  console.log(`you chose: ${name} (${nativeName})`)
}

