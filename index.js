#!/usr/bin/env node
'use strict'

const wiclipedia = require('./src/wiclipedia')

const wikipediaCLI = flags => {
  if (flags.lang) {
    return wiclipedia.setLang()
  }

  if (flags.previous) {
    return wiclipedia.showPreviousSearches()
  }

  if (flags.clear) {
    return wiclipedia.clearHistory()
  }

  return wiclipedia.launchProgram()
}

exports.wikipediaCLI = wikipediaCLI
