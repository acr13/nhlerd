'use strict';

const express = require('express');
const path = require('path');

const app = express();
const database = require('./config/db');
const port = process.env.PORT || 8000;

require('./routes')(app);

app.listen(port, function() {
  console.log('Node app is running on port', port);
});
