'use strict';

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;

require('./routes')(app);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(port, function() {
  console.log('Node app is running on port', port);
});
