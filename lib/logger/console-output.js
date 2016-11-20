'use strict'

const LoggerOutputInterface = require('./logger-output-interface')

class ConsoleOutput extends LoggerOutputInterface {
  constructor (enabled) {
    super()
    this.level = 'debug'
    this.stream = process.stdout
    this.enabled = enabled
  }

  isAvailable () {
    return this.enabled
  }
}

module.exports = ConsoleOutput
