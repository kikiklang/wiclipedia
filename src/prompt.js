'use strict'

/// //////////////////////////////
/// PROMPT QOA OPTIONS          //
/// //////////////////////////////
const {bold} = require('kleur')

exports.langQuestion = [
  {
    type: 'input',
    query: bold().blue('- In which language do you want the articles to be displayed ?'),
    handle: 'lang'
  }
]

exports.topicQuestion = [
  {
    type: 'input',
    query: bold().blue(' - What are your looking for ?'),
    handle: 'userSearch'
  }
]

exports.topicInteractive = {
  type: 'interactive',
  query: bold().blue(' - Please refine your search...'),
  handle: 'userPick',
  symbol: '>',
  menu: []
}

exports.topicRedo = {
  type: 'confirm',
  query: bold().blue(' - Would you like to do another search ?'),
  handle: 'redo',
  accept: 'y',
  deny: 'n'
}

exports.historyInteractive = {
  type: 'interactive',
  query: bold().blue(' - you can pick one of your previous queries...'),
  handle: 'userPick',
  symbol: '>',
  menu: []
}
