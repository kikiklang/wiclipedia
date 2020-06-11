#!/usr/bin/env node
'use strict'

const meow = require('meow')
const help = require('./src/help')
const launch = require('./index')

const cli = meow(help, {
  flags: {
    help: {
      type: 'boolean',
      alias: 'h'
    },
    version: {
      type: 'boolean',
      alias: 'v'
    },
    lang: {
      type: 'boolean',
      alias: 'l'
    }
  }
})

launch.wikipediaCLI(cli.flags)

