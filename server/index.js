'use strict';

const express = require('express');

const app = express();
const port = process.env.PORT || 8000;

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200);
  }
  else {
    next();
  }

  next();
});

require('./routes')(app);

app.listen(port, function() {
  console.log('Node app is running on port', port);
});
