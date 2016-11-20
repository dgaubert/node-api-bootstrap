'use strict'

const MiddlewareInterface = require('./middleware-interface')

class LogMiddleware extends MiddlewareInterface {
  regist (app) {
    app.use((req, res, next) => {
      req.log.info({ req })
      next()
    })
  }
}

module.exports = LogMiddleware
