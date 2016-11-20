'use strict'

const MiddlewareInterface = require('./middleware-interface')
const responseTime = require('response-time')

class LogResponseMiddleware extends MiddlewareInterface {
  regist (app) {
    app.use(responseTime((req, res, time) => {
      req.metrics.timing('response_time', time)
      res.set('X-Response-Time', time)
      req.log.info({ res })
    }))
  }
}

module.exports = LogResponseMiddleware
