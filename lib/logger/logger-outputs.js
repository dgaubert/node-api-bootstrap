'use strict'

class LoggerOutputs extends Set {
  static get [Symbol.species] () {
    return Set
  }

  add (output) {
    if (output.isAvailable()) {
      super.add(output)
    }

    return this
  }

  toArray () {
    return Array.from(this.values())
  }
}

module.exports = LoggerOutputs
