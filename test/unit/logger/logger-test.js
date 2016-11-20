'use strict'

const assert = require('assert')
const sinon = require('sinon')
const LoggerInterface = require(__source + 'logger/logger-interface')
const ListenerInterface = require(__source + 'listener-interface')
const Logger = require(__source + 'logger/logger')

class LoggerProvider extends LoggerInterface {}
class SighupListener extends ListenerInterface {}

describe('logger', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.provider = new LoggerProvider()
    this.sighupListener = new SighupListener()
    this.sighupListenerListenStub = this.sandbox.stub(this.sighupListener, 'listen')
    this.logger = new Logger(this.provider, this.sighupListener)
  })

  afterEach(() => {
    assert.ok(this.sighupListenerListenStub.calledOnce)
    this.sandbox.restore()
  })

  it('.debug() should log at debug level', () => {
    const loggerLogStub = this.sandbox.stub(this.provider, 'debug')
    const args = [ 'debug', 'wadus message' ]

    this.logger.debug(...args)

    assert.ok(loggerLogStub.calledWithExactly(...args))
  })

  it('.log() should log', () => {
    const loggerLogStub = this.sandbox.stub(this.provider, 'info')
    const args = [ 'info', 'wadus message' ]

    this.logger.log(...args)

    assert.ok(loggerLogStub.calledWithExactly(...args))
  })

  it('.info() should log at info level', () => {
    const loggerInfoStub = this.sandbox.stub(this.provider, 'info')
    const args = [ 'wadus message' ]

    this.logger.info(...args)

    assert.ok(loggerInfoStub.calledWithExactly(...args))
  })

  it('.warn() should log at warn level', () => {
    const loggerWarnStub = this.sandbox.stub(this.provider, 'warn')
    const args = [ 'wadus message' ]

    this.logger.warn(...args)

    assert.ok(loggerWarnStub.calledWithExactly(...args))
  })

  it('.error() should log at error level', () => {
    const loggerErrorStub = this.sandbox.stub(this.provider, 'error')
    const args = [ 'wadus message' ]

    this.logger.error(...args)

    assert.ok(loggerErrorStub.calledWithExactly(...args))
  })
})
