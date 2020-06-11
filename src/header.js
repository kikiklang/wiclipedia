'use strict'

/// /////////////////////////////////
/// APP NAME                       //
/// /////////////////////////////////

const boxen = require('boxen')
const options = require('./boxen-options')
const pjson = require('../package.json')
const chalk = require('chalk')

exports.logAppName = () => {
  const appname = chalk.white.bold(`WICLIPEDIA (v${pjson.version})`)

  console.log(boxen(appname, options.boxenOptions('green')))
}
