'use strict'

const sinon = require('sinon')
const RunnerInterface = require(__source + 'runner-interface')
const LoggerInterface = require(__source + 'logger-interface')
const Worker = require(__source + 'cluster/worker/worker')

describe('worker', function () {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.server = new RunnerInterface()
    this.logger = new LoggerInterface()
    this.worker = new Worker(this.server, this.logger)
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('should be a runner instance', () => {
    this.worker.should.instanceof(RunnerInterface)
  })

  it('.run() should run server successfully', () => {
    var serverRunStub = this.sandbox.stub(this.server, 'run').returns(Promise.resolve())
    var loggerInfoStub = this.sandbox.stub(this.logger, 'info')

    return this.worker.run()
      .then(() => {
        serverRunStub.calledOnce.should.be.equal(true)
        loggerInfoStub.calledOnce.should.be.equal(true)
      })
  })

  it('.run() should exit with error when server fails on running', () => {
    var workerExitStub = this.sandbox.stub(this.worker, 'exit')
    var serverRunStub = this.sandbox.stub(this.server, 'run').returns(Promise.reject(new Error('irrelevant')))
    var loggerErrorStub = this.sandbox.stub(this.logger, 'error')

    return this.worker.run()
      .then(() => {
        serverRunStub.calledOnce.should.equal(true)
        loggerErrorStub.calledOnce.should.equal(true)
        workerExitStub.calledWithExactly(1).should.equal(true)
      })
  })

  it('.exit() should stop server and exit successfully', () => {
    var serverRunStub = this.sandbox.stub(this.server, 'exit').returns(Promise.resolve())
    var loggerWarnStub = this.sandbox.stub(this.logger, 'warn')
    var processExitStub = this.sandbox.stub(process, 'exit')

    return this.worker.exit()
      .then(() => {
        loggerWarnStub.calledOnce.should.equal(true)
        processExitStub.calledWithExactly(0).should.equal(true)
        serverRunStub.calledOnce.should.equal(true)
      })
  })

  it('.exit(1) should stop server and exit succesfully with error', () => {
    var serverRunStub = this.sandbox.stub(this.server, 'exit').returns(Promise.resolve())
    var loggerWarnStub = this.sandbox.stub(this.logger, 'warn')
    var processExitStub = this.sandbox.stub(process, 'exit')

    return this.worker.exit(1)
      .then(() => {
        loggerWarnStub.calledOnce.should.equal(true)
        processExitStub.calledWithExactly(1).should.equal(true)
        serverRunStub.calledOnce.should.equal(true)
      })
  })

  it('.exit() should stop server and exit with error when server fails in stop', () => {
    var serverRunStub = this.sandbox.stub(this.server, 'exit').returns(Promise.reject(new Error('irrelevant')))
    var loggerErrorStub = this.sandbox.stub(this.logger, 'error')
    var processExitStub = this.sandbox.stub(process, 'exit')

    return this.worker.exit()
      .then(() => {
        loggerErrorStub.calledOnce.should.equal(true)
        processExitStub.calledWithExactly(1).should.equal(true)
        serverRunStub.calledOnce.should.equal(true)
      })
  })
})
