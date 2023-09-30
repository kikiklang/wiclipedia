'use strict'

const boxen = require('boxen')
const options = require('./boxen-options')
const pkg = require('../package.json')
const {bold} = require('kleur')

/**
 * Logs the application name and version to the console.
 */
const logAppName = () => {
  const appNameWithVersion = bold(`WICLIPEDIA (v${pkg.version})`)
  const boxenOptions = options.boxenOptions('green')

  console.log(boxen(appNameWithVersion, boxenOptions))
}

module.exports = {
  logAppName
}
