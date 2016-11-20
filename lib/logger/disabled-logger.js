'use strict'

const LoggerInterface = require('./logger-interface')

class DisabledLogger extends LoggerInterface {
  constructor (providerDisabled = false) {
    super()

    if (!providerDisabled) {
      this.provider = new DisabledLogger(!providerDisabled)
    }
  }

  reopenFileStreams () {}

  child () {}

  debug () {}

  log () {}

  info () {}

  warn () {}

  error () {}
}

module.exports = DisabledLogger
