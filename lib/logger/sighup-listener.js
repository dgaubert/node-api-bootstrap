'use strict'

const ListenerInterface = require('../listener-interface')

class SighupListener extends ListenerInterface {
  constructor (emitter) {
    super()
    this.emitter = emitter
  }

  listen (reopenFileStreams) {
    this.emitter.on('SIGHUP', () => {
      reopenFileStreams()
    })
  }
}

module.exports = SighupListener
