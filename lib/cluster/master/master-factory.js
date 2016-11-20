'use strict'

const cluster = require('cluster')
const FactoryInterface = require('../../factory-interface')
const WorkerManager = require('./worker-manager')
const Sigusr2Listener = require('./sigusr2-listener')
const SighupListener = require('./sighup-listener')
const WorkerExitListener = require('./worker-exit-listener')
const Master = require('./master')

class MasterFactory extends FactoryInterface {
  static create (metrics, logger) {
    const sigusr2Listener = new Sigusr2Listener(process, logger)
    const workerExitListener = new WorkerExitListener(process, logger)
    const sighupListener = new SighupListener(process, logger)
    const workerManager = new WorkerManager(cluster, sigusr2Listener, workerExitListener, sighupListener, logger)

    return new Master(workerManager, logger)
  }

  static shouldCreate (clusterOn) {
    return Master.is(clusterOn)
  }
}

module.exports = MasterFactory
