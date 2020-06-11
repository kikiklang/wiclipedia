'use strict'

/// /////////////////////////
/// BOXEN OPTIONS          //
/// /////////////////////////

exports.boxenOptions = color => {
  return {
    padding: 1,
    margin: {
      top: 1,
      bottom: 1
    },
    borderStyle: 'round',
    borderColor: color
  }
}
