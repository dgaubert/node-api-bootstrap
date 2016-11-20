'use strict'

const LoggerOutputInterface = require('./logger-output-interface')

class FileOutput extends LoggerOutputInterface {
  constructor (path) {
    super()
    this.level = 'info'
    this.path = path
  }

  isAvailable () {
    return (process.env.NODE_ENV !== 'development')
  }
}

module.exports = FileOutput
