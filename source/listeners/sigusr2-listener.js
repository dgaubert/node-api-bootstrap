'use strict';

const Listener = require('./listener');

class Sigusr2Listener extends Listener {
  constructor(logger) {
    super();
    this.logger = logger || console;
  }

  listen(run) {
    this._listener = () => {
      this.logger.warn('SIGUSR2 received on %s', process.pid);
      process.removeListener('SIGUSR2', this._listener);
      run();
    };

    process.on('SIGUSR2', this._listener);
  }
}

module.exports = Sigusr2Listener;
