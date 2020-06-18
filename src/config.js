'use strict'

/// /////////////////////////////
/// WRITE / READ CONFIG        //
/// /////////////////////////////
const fs = require('fs')
const pkg = require('../package.json')
const ISO6391 = require('iso-639-1')

exports.checkLang = () => {
  const jsonString = fs.readFileSync('../package.json')
  const pkg = JSON.parse(jsonString)

  return pkg.configuration.wikiLanguage
}

exports.storeLanguage = lang => {
  if (ISO6391.getName(lang)) {
    pkg.configuration.wikiLanguage = lang
    const json = JSON.stringify(pkg, null, 2)

    fs.writeFileSync('../package.json', json)

    return {
      name: ISO6391.getName(lang),
      nativeName: ISO6391.getNativeName(lang)
    }
  }

  console.log('Your code is unknown, please select another one')
  process.exit(1)
}
