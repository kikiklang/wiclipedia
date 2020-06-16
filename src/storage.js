'use strict'

/// ///////////////////////////
/// WRITE / READ DATA        //
/// ///////////////////////////
const fs = require('fs')
const ISO6391 = require('iso-639-1')

function _readData() {
  const jsonString = fs.readFileSync('./data/data.json')
  const data = JSON.parse(jsonString)

  return data
}

function _writeData(data) {
  const json = JSON.stringify(data, null, 2)
  fs.writeFileSync('./data/data.json', json)
}

exports.checkLang = () => {
  try {
    const data = _readData()
    if (!data.wikiLanguage) {
      return false
    }

    return data.wikiLanguage
  } catch (error) {
    console.log(error)
  }
}

exports.storeLanguage = lang => {
  try {
    const data = _readData()
    data.wikiLanguage = lang

    _writeData(data)

    return {
      name: ISO6391.getName(lang),
      nativeName: ISO6391.getNativeName(lang)
    }
  } catch (error) {
    console.log(error)
  }
}
