'use strict'

const ArgumentParser = require('../argv/argument-parser')
const argv = ArgumentParser.parse()

module.exports = {
  name: argv.name,
  port: argv.port,
  cluster: {
    enabled: argv.cluster
  },
  logger: {
    enabled: argv.logger,
    console: argv.console,
    path: argv.logPath
  },
  metrics: {
    enabled: argv.metrics,
    host: 'localhost',
    port: 8125,
    interval: 5000
  }
}
