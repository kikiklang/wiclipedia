'use strict'

/// /////////////////////////////////
/// APP NAME                       //
/// /////////////////////////////////

const boxen = require('boxen')
const options = require('./boxen-options')
const pkg = require('../package.json')
const { bold } = require('kleur')

exports.logAppName = () => {
  const appname = bold(`WICLIPEDIA (v${pkg.version})`)

  console.log(boxen(appname, options.boxenOptions('green')))
}
