'use strict';

const Listener = require('./listener');

class SigintListener extends Listener {
  constructor(logger) {
    super();
    this.logger = logger || console;
  }

  listen(exit) {
    this._listener = () => {
      this.logger.warn('SIGINT received on %s', process.pid);
      process.removeListener('SIGINT', this._listener);
      exit();
    };

    process.on('SIGINT', this._listener);
  }
}

module.exports = SigintListener;
