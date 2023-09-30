'use strict'

const {bold} = require('kleur')

/**
 * Generates an interactive prompt question.
 *
 * @param {string} query - The question to display to the user.
 * @param {string} handle - The handle for the question response.
 * @param {Array} menu - The menu options for the question.
 * @returns {Object} The interactive prompt question object.
 */
function generateInteractiveQuestion(query, handle, menu = []) {
  return {
    type: 'interactive',
    query: bold().blue(query),
    handle,
    symbol: '>',
    menu
  }
}

/**
 * Generates a confirm prompt question.
 *
 * @param {string} query - The question to display to the user.
 * @param {string} handle - The handle for the question response.
 * @returns {Object} The confirm prompt question object.
 */
function generateConfirmQuestion(query, handle) {
  return {
    type: 'confirm',
    query: bold().blue(query),
    handle,
    accept: 'y',
    deny: 'n'
  }
}

/**
 * Generates an input prompt question.
 *
 * @param {string} query - The question to display to the user.
 * @param {string} handle - The handle for the question response.
 * @returns {Object} The input prompt question object.
 */
function generateInputQuestion(query, handle) {
  return {
    type: 'input',
    query: bold().blue(query),
    handle
  }
}

exports.langQuestion = [generateInputQuestion('- In which language do you want the articles to be displayed ?', 'lang')]
exports.topicQuestion = [generateInputQuestion(' - What are your looking for ?', 'userSearch')]
exports.topicInteractive = generateInteractiveQuestion(' - Please refine your search...', 'userPick')
exports.topicRedo = generateConfirmQuestion(' - Would you like to do another search ?', 'redo')
exports.historyInteractive = generateInteractiveQuestion(' - You can pick one of your previous queries...', 'userPick')
exports.randomInteractive = generateInteractiveQuestion(' - Here is a list of 10 random topics...', 'userPick')
exports.randomAgain = generateConfirmQuestion(' - Would you like to try another random?', 'redo')
exports.topInteractive = generateInteractiveQuestion(' - Here is a list of the 15 most viewed articles yesterday... (english only)', 'userPick')
