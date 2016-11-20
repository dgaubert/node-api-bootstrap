'use strict'

const ListenerInterface = require('../../listener-interface')

class SighupListener extends ListenerInterface {
  constructor (emitter, logger) {
    super()
    this.emitter = emitter
    this.logger = logger
  }

  listen (reopenAllLogFileStreams) {
    this.emitter.on('SIGHUP', () => {
      this.logger.info('SIGHUP received')
      reopenAllLogFileStreams()
        .then(() => this.logger.info('All log files were reopened'))
        .catch((err) => this.logger.error({ err }))
    })
  }
}

module.exports = SighupListener
