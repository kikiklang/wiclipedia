#!/usr/bin/env node
'use strict'

const meow = require('meow')
const updateNotifier = require('update-notifier')
const help = require('./src/help')
const pkg = require('./package.json')
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
    },
    previous: {
      type: 'boolean',
      alias: 'p'
    },
    clear: {
      type: 'boolean',
      alias: 'c'
    },
    random: {
      type: 'boolean',
      alias: 'r'
    }
  }
})

updateNotifier({pkg}).notify()

launch.wikipediaCLI(cli.flags)

