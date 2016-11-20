'use strict'

const FactoryInterface = require('../factory-interface')
const Logger = require('./logger')
const DisabledLogger = require('./disabled-logger')
const LoggerOutputs = require('./logger-outputs')
const ConsoleOutput = require('./console-output')
const FileOutput = require('./file-output')
const Role = require('../cluster/role')
const Bunyan = require('bunyan')
const SighupListener = require('./sighup-listener')
const LogCommandListener = require('./log-command-listener')
const ReopenFileStreamsListeners = require('./reopen-file-streams-listeners')

class LoggerFactory extends FactoryInterface {
  static create (options) {
    if (!options.logger.enabled) {
      return new DisabledLogger()
    }

    const name = options.name
    const role = Role.get(options.cluster.enabled)
    const path = options.logger.path
    const consoleEnabled = options.logger.console

    const loggerOutputs = new LoggerOutputs()
      .add(new ConsoleOutput(consoleEnabled))
      .add(new FileOutput(path))

    const bunyan = Bunyan.createLogger({
      name: name,
      role: role,
      streams: loggerOutputs.toArray(),
      serializers: Bunyan.stdSerializers
    })

    const reopenFileStreamsListeners = new ReopenFileStreamsListeners()
      .add(new SighupListener(process))
      .add(new LogCommandListener(process))

    return new Logger(bunyan, reopenFileStreamsListeners)
  }
}

module.exports = LoggerFactory
