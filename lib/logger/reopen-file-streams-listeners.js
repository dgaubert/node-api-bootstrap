'use strict'

class ReopenFileStreamsListeners extends Set {
  static get [Symbol.species] () {
    return Set
  }

  listen (reopenFileStreams) {
    for (let listener of this) {
      listener.listen(reopenFileStreams)
    }
  }
}

module.exports = ReopenFileStreamsListeners
