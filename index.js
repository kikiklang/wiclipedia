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

  return wiclipedia.launchProgram()
}

exports.wikipediaCLI = wikipediaCLI
