'use strict'

const assert = require('assert')
const sinon = require('sinon')
const EventEmitter = require('events')
const LoggerInterface = require(__source + 'logger/logger-interface')
const Sigusr2Listener = require(__source + 'cluster/master/sigusr2-listener')

class Logger extends LoggerInterface {}

describe('sigusr2-listener', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.emitter = new EventEmitter()
    this.logger = new Logger()
    this.sigusr2Listener = new Sigusr2Listener(this.emitter, this.logger)
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('.listen() should attach listener to SIGUSR2 process event', () => {
    var loggerWarnStub = this.sandbox.stub(this.logger, 'warn')
    var listenerStub = this.sandbox.stub().returns(Promise.resolve())

    this.sigusr2Listener.listen(listenerStub)
    this.emitter.emit('SIGUSR2')

    assert.ok(loggerWarnStub.calledOnce)
    assert.ok(listenerStub.calledOnce)
  })
})
