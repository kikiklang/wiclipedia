'use strict'

/// /////////////////////////////
/// WRITE / READ CONFIG        //
/// /////////////////////////////
const Configstore = require('configstore')
const pkg = require('../package.json')
const ISO6391 = require('iso-639-1')

exports.model = new Configstore(pkg.name, {
  appLanguage: '',
  wikiLanguage: 'en'
})

exports.checkLang = () => {
  return this.model.get('wikiLanguage')
}

exports.storeLanguage = lang => {
  if (ISO6391.getName(lang)) {
    this.model.set('wikiLanguage', lang)

    return {
      name: ISO6391.getName(lang),
      nativeName: ISO6391.getNativeName(lang)
    }
  }

  console.log('Your code is unknown, please select another one')
  process.exit(1)
}
