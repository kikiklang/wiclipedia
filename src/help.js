'use strict'

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

    Examples
      $ wicli
      $ wicli --lang
      $ wicli --previous
      $ wicli --random
`
