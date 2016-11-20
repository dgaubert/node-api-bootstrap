'use strict'

const ParserInterface = require('./parser-interface')
const meow = require('meow')
const path = require('path')
const readPkgUp = require('read-pkg-up')

class ArgumentParser extends ParserInterface {
  static parse () {
    const pkg = readPkgUp.sync({
      cwd: process.cwd(),
      normalize: false
    }).pkg

    const options = {
      alias: {
        c: 'cluster',
        p: 'port',
        l: 'logPath',
        o: 'console',
        v: 'version'
      },
      boolean: [ // options that are always boolean
        'cluster',
        'metrics',
        'logger',
        'console'
      ],
      default: {
        name: pkg.name,
        cluster: false,
        metrics: true,
        logger: true,
        port: 3000,
        logPath: path.join(process.cwd(), pkg.name + '.log'),
        console: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined)
      }
    }
    const help = `
      Usage:
        $ npm start [-- <options>]

      Options:
        -c, --cluster   Enable cluster mode (default: disable)
        -p, --port      Specific listening port (default: 3000)
        -l, --log-path  Path to log (default: current working directory)
        -o, --console   Include stdout as log output (true if NODE_ENV is undefined or 'development', otherwise false)
        --no-logger     Disable logger
        --no-metrics    Disable metrics

      Examples
        $ npm start -- -c -p 8000
    `
    const processOptions = meow({ help, pkg }, options)

    return processOptions.flags
  }
}

module.exports = ArgumentParser
