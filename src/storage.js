'use strict'

/// ///////////////////////////
/// WRITE / READ DATA        //
/// ///////////////////////////
const fs = require('fs')

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
  } catch (error) {
    console.log(error)
  }
}
