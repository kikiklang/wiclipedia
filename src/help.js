'use strict'

/**
 * Provides help text for the CLI, including usage, options, and examples.
 * @module help
 */
module.exports = `
  Usage
    $ wicli [<options> ...]

    Options
        none              launch wiclipedia
      --version, -v       print app version
      --lang, -l          set language for wikipedia articles (english by default)
      --previous, -p      display and use previous searches
      --clear, -c         clear search history
      --random, -r        suggest random articles
      --top, -t           find most viewed articles yesterday (english only)

    Examples
      $ wicli
      $ wicli --lang
      $ wicli --previous
      $ wicli --random
      $ wicli --top
`
