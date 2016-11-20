'use strict'

class WorkerManager {
  constructor (cluster, sigusr2Listener, workerExitListener, sighupListener, logger) {
    this.cluster = cluster
    this.logger = logger
    sigusr2Listener.listen(() => this.reloadAllWorkers())
    workerExitListener.listen((worker, code) => this.refork(worker, code))
    sighupListener.listen(() => this.reopenAllLogFileStreams())
  }

  reopenAllLogFileStreams () {
    this.logger.info('Reopen all log file streams')

    const workerKeys = Object.keys(this.cluster.workers)
    const reopens = workerKeys.map((workerKey) => this.reopenLogFileStreams(workerKey))

    return Promise.all(reopens)
  }

  reopenLogFileStreams (workerId) {
    const worker = this.cluster.workers[workerId]

    return new Promise((resolve, reject) => {
      worker.send({ cmd: 'logger:reopen-file-streams' }, (err) => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    })
  }

  reloadAllWorkers () {
    this.logger.info('Reload all workers')

    const workerKeys = Object.keys(this.cluster.workers)
    const reloads = workerKeys.map((workerKey) => this.reloadWorker(workerKey))

    return Promise.all(reloads)
  }

  refork (worker, code) {
    if (code > 0 && !worker.exitedAfterDisconnect) {
      this.fork()
    }
  }

  fork () {
    this.logger.info('Fork worker')
    this.cluster.fork()
  }

  reloadWorker (workerId) {
    return new Promise((resolve, reject) => {
      const worker = this.cluster.workers[workerId]

      worker.disconnect()

      worker.once('exit', () => {
        if (!worker.exitedAfterDisconnect) {
          return reject(new Error('Worker exited accidentaly'))
        }

        const newWorker = this.fork()

        newWorker.once('listening', () => {
          resolve()
        })

        newWorker.once('error', (err) => {
          reject(err)
        })
      })
    })
  }
}

module.exports = WorkerManager
