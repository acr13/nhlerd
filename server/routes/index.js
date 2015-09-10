'use strict';

const apiRouter = require('./apiRouter');

module.exports = function nhlRouter(app) {
  app.use('/api/v1', apiRouter);
};
