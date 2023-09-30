'use strict'

const Configstore = require('configstore')
const pkg = require('../package.json')
const ISO6391 = require('iso-639-1')

/**
 * Configuration model instance.
 */
const model = new Configstore(pkg.name, {
  appLanguage: '',
  wikiLanguage: 'en',
  history: []
})

/**
 * Checks the stored Wikipedia language.
 *
 * @returns {string} - The stored Wikipedia language code.
 */
const checkLang = () => {
  return model.get('wikiLanguage')
}

/**
 * Validates and stores a new Wikipedia language.
 *
 * @param {string} lang - The language code to store.
 * @returns {object|null} - An object with the language name and native name, or null if the language code is invalid.
 * @throws {Error} - Throws an error if the language code is invalid.
 */
const storeLanguage = lang => {
  const langName = ISO6391.getName(lang)
  if (langName) {
    model.set('wikiLanguage', lang)
    return {
      name: langName,
      nativeName: ISO6391.getNativeName(lang)
    }
  }

  throw new Error('Invalid language code. Please select another one.')
}

/**
 * Stores a new search in the history.
 *
 * @param {string} userInput - The user's search input.
 * @param {string} lang - The language code of the search.
 */
const storeSearches = (userInput, lang) => {
  const history = model.get('history')
  const data = {
    timestamp: Date.now(),
    title: userInput,
    lang
  }

  history.unshift(data)
  model.set('history', history)
}

/**
 * Clears the search history.
 */
const clearHistory = () => {
  model.set('history', [])
}

/**
 * Retrieves the formatted search history.
 *
 * @returns {Array} - The formatted search history.
 */
const getHistory = () => {
  const history = model.get('history')
  return history.map(search => {
    return {title: `[${search.lang}] ${search.title}`}
  })
}

module.exports = {
  model,
  checkLang,
  storeLanguage,
  storeSearches,
  clearHistory,
  getHistory
}
