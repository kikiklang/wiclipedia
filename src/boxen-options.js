'use strict'

/**
 * Returns an object of Boxen options for styling text in the terminal.
 *
 * @param {string} color - The border color. Default is 'blue'.
 * @returns {object} - The Boxen options object.
 */
exports.boxenOptions = (color = 'blue') => {
  // Basic validation
  if (typeof color !== 'string' || color.trim() === '') {
    throw new Error('Invalid color argument. It should be a non-empty string.')
  }

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
