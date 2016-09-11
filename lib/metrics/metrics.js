'use strict'

const MetricsInterface = require('./metrics-interface')

class Metrics extends MetricsInterface {
  constructor (metrics, logger) {
    super()
    this.provider = metrics
    this.logger = logger
  }

  logOnError () {
    this.provider.socket.on('error', err => {
      this.logger.error('Error sending stats:', err)
    })
  }

  gaugeMemory (interval) {
    this.memoryInterval = setInterval(() => {
      const memoryUsage = process.memoryUsage()
      Object.keys(memoryUsage).forEach(property => {
        this.gauge('memory.' + property, memoryUsage[property])
      })
    }, interval)
  }

  timing () {
    this.provider.timing(...arguments)
  }

  gauge () {
    this.provider.gauge(...arguments)
  }

  increment () {
    this.provider.increment(...arguments)
  }
}

module.exports = Metrics