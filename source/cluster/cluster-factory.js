'use strict'

const FactoryInterface = require('../factory-interface')
const isMaster = require('cluster').isMaster
const WorkerFactory = require('./worker/worker-factory')
const MasterFactory = require('./master/master-factory')

class ClusterFactory extends FactoryInterface {
  constructor () {
    super()
    this.masterFactory = new MasterFactory()
    this.workerFactory = new WorkerFactory()
  }

  create (logger) {
    return isMaster ? this.masterFactory.create(logger) : this.workerFactory.create(logger)
  }
}

module.exports = ClusterFactory
