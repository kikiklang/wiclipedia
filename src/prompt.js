'use strict'

/// //////////////////////////////
/// PROMPT QOA OPTIONS          //
/// //////////////////////////////
const chalk = require('chalk')

exports.langQuestion = [
  {
    type: 'input',
    query: chalk.blue.bold(
      ' - In which language do you want the articles to be displayed (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)?'
    ),
    handle: 'lang'
  }
]

exports.topicQuestion = [
  {
    type: 'input',
    query: chalk.blue.bold(' - What are your looking for ?'),
    handle: 'userSearch'
  }
]

exports.topicInteractive = {
  type: 'interactive',
  query: chalk.blue.bold(' - Please refine your search...'),
  handle: 'userPick',
  symbol: '>',
  menu: []
}

exports.topicRedo = {
  type: 'confirm',
  query: chalk.blue.bold(' - Would you like to do another search ?'),
  handle: 'redo',
  accept: 'y',
  deny: 'n'
}

exports.historyInteractive = {
  type: 'interactive',
  query: chalk.blue.bold(' - you can pick one of your previous queries...'),
  handle: 'userPick',
  symbol: '>',
  menu: []
}
