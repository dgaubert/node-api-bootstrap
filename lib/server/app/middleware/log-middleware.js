'use strict'

const MiddlewareInterface = require('./middleware-interface')

class LogMiddleware extends MiddlewareInterface {
  constructor (logger) {
    super()
    this.logger = logger
  }

  regist (app) {
    app.use((req, res, next) => {
      req.log = this.logger.child(req.requestId)
      next()
    })
  }
}

module.exports = LogMiddleware
