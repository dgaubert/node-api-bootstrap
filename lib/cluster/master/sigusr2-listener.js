'use strict'

const ListenerInterface = require('../../listener-interface')

class Sigusr2Listener extends ListenerInterface {
  constructor (emitter, logger) {
    super()
    this.emitter = emitter
    this.logger = logger
  }

  listen (reloadAllWorkers) {
    this.emitter.on('SIGUSR2', () => {
      this.logger.warn('SIGUSR2 received')
      reloadAllWorkers()
        .then(() => this.logger.info('All workers were loaded'))
        .catch(err => this.logger.error({ err }))
    })
  }
}

module.exports = Sigusr2Listener
