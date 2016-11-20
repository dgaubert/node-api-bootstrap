'use strict'

const ListenerInterface = require('../listener-interface')

class LogCommandListener extends ListenerInterface {
  constructor (emitter) {
    super()
    this.emitter = emitter
  }

  listen (reopenFileStreams) {
    this.emitter.on('message', (command) => {
      if (command === 'logger:reopen-file-streams') {
        reopenFileStreams()
      }
    })
  }
}

module.exports = LogCommandListener
