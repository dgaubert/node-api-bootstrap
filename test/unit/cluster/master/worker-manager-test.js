'use strict'

const assert = require('assert')
const sinon = require('sinon')
const EventEmitter = require('events')
const LoggerInterface = require(__source + 'logger/logger-interface')
const ListenerInterface = require(__source + 'listener-interface')
const WorkerManager = require(__source + 'cluster/master/worker-manager')

class Logger extends LoggerInterface {}
class Sigusr2Listener extends ListenerInterface {}
class WorkerExitListener extends ListenerInterface {}
class SighupListener extends ListenerInterface {}
class Cluster extends EventEmitter {
  fork () {}
}

describe('worker-manager', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.cluster = new Cluster()
    this.logger = new Logger()

    this.sigusr2Listener = new Sigusr2Listener()
    this.sigusr2ListenerListenInfoStub = this.sandbox.stub(this.sigusr2Listener, 'listen')

    this.workerExitListener = new WorkerExitListener()
    this.workerExitListenerListenInfoStub = this.sandbox.stub(this.workerExitListener, 'listen')

    this.sighupListener = new SighupListener()
    this.sighupListenerListenInfoStub = this.sandbox.stub(this.sighupListener, 'listen')

    this.workerManager = new WorkerManager(
      this.cluster,
      this.sigusr2Listener,
      this.workerExitListener,
      this.sighupListener,
      this.logger
    )
  })

  afterEach(() => {
    assert.ok(this.sigusr2ListenerListenInfoStub.calledOnce)
    assert.ok(this.workerExitListenerListenInfoStub.calledOnce)
    assert.ok(this.sighupListenerListenInfoStub.calledOnce)

    this.sandbox.restore()
  })

  it('.fork() should create a new worker', () => {
    var loggerInfoStub = this.sandbox.stub(this.logger, 'info')
    var forkStub = this.sandbox.stub(this.cluster, 'fork')

    this.workerManager.fork()

    assert.ok(forkStub.calledOnce)
    assert.ok(loggerInfoStub.calledOnce)
  })

  it('.refork() should create a new worker if the previous one crashed', () => {
    var workerManagerForkStub = this.sandbox.stub(this.workerManager, 'fork')
    var workerStub = {
      exitedAfterDisconnect: false,
      process: {
        pid: 1
      }
    }

    this.workerManager.refork(workerStub, 1)

    assert.ok(workerManagerForkStub.calledOnce)
  })

  it('.refork() should not create a new worker if the previous one made away with itself', () => {
    var loggerInfoStub = this.sandbox.stub(this.logger, 'info')
    var workerManagerForkStub = this.sandbox.stub(this.workerManager, 'fork')
    var workerStub = {
      exitedAfterDisconnect: true,
      process: {
        pid: 1
      }
    }

    this.workerManager.refork(workerStub, 1)

    assert.ok(!loggerInfoStub.calledOnce)
    assert.ok(!workerManagerForkStub.calledOnce)
  })

  it('.refork() should not create a new worker if the previous one exited', () => {
    var loggerInfoStub = this.sandbox.stub(this.logger, 'info')
    var workerManagerForkStub = this.sandbox.stub(this.workerManager, 'fork')
    var workerStub = {
      exitedAfterDisconnect: true,
      process: {
        pid: 1
      }
    }

    this.workerManager.refork(workerStub, 0)

    assert.ok(!loggerInfoStub.calledOnce)
    assert.ok(!workerManagerForkStub.calledOnce)
  })

  it('.reloadAllWorkers() should restart all workers', () => {
    var loggerInfoStub = this.sandbox.stub(this.logger, 'info')

    this.cluster.workers = {
      '1': {},
      '2': {}
    }

    var workerManagerReloadStub = this.sandbox.stub(this.workerManager, 'reloadWorker')
    workerManagerReloadStub.returns(Promise.resolve())

    return this.workerManager.reloadAllWorkers()
      .then(() => {
        assert.ok(loggerInfoStub.calledOnce)
        assert.ok(!workerManagerReloadStub.calledOnce)
      })
  })

  it('.reloadWorker() should restart one worker', () => {
    var newWorkerFake = new EventEmitter()
    this.workerManager.fork = function () {
      return newWorkerFake
    }

    var workerFake = new EventEmitter()
    workerFake.exitedAfterDisconnect = true
    workerFake.disconnect = function () {
      process.nextTick(() => {
        workerFake.emit('exit')
        newWorkerFake.emit('listening')
      })
    }
    this.cluster.workers = {
      '1': workerFake
    }

    return this.workerManager.reloadWorker('1')
  })

  it('.reloadWorker() should fail due to worker did not fork successfully', () => {
    var newWorkerFake = new EventEmitter()
    this.workerManager.fork = function () {
      return newWorkerFake
    }

    var workerFake = new EventEmitter()
    workerFake.exitedAfterDisconnect = true
    workerFake.disconnect = function () {
      process.nextTick(() => {
        workerFake.emit('exit')
        newWorkerFake.emit('error', new Error('Irrelevant error'))
      })
    }
    this.cluster.workers = {
      '1': workerFake
    }

    return this.workerManager.reloadWorker('1')
      .catch((err) => {
        assert.equal(err.message, 'Irrelevant error')
      })
  })

  it('.reloadWorker() should fail due to worker did not make away with itself', () => {
    var workerFake = new EventEmitter()
    workerFake.exitedAfterDisconnect = false
    workerFake.disconnect = function () {
      process.nextTick(() => {
        workerFake.emit('exit')
      })
    }
    this.cluster.workers = {
      '1': workerFake
    }

    return this.workerManager.reloadWorker('1')
      .catch((err) => {
        assert.equal(err.message, 'Worker exited accidentaly')
      })
  })
})
