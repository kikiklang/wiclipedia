#!/usr/bin/env node
'use strict'

const wiclipedia = require('./src/wiclipedia')

const wikipediaCLI = flags => {
  if (flags.lang) {
    return wiclipedia.setLang()
  }

  if (flags.previous) {
    return wiclipedia.displayPreviousSearches()
  }

  if (flags.clear) {
    return wiclipedia.clearHistory()
  }

  if (flags.random) {
    return wiclipedia.displayRandomArticlesList()
  }

  if (flags.top) {
    return wiclipedia.mostViewedYesterday()
  }

  return wiclipedia.launchProgram()
}

exports.wikipediaCLI = wikipediaCLI
