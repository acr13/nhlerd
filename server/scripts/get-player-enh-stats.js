'use strict';

const database = require('../config/db');
const db = require('monk')(database.uri);
const Q = require('q');
const R = require('ramda');
const rp = require('request-promise');

const BASE_ENH_STATS_URL = 'http://www.nhl.com/stats/rest/grouped/skaters/enhanced/season/skatersummaryshooting?cayenneExp=seasonId=20142015%20and%20gameTypeId=2';
const enhStatsDb = db.get('enhStats');
enhStatsDb.remove({});

// Get the stats, then parse the data
// insert into mongo
let parseStats = function (response) {
  var stats = JSON.parse(response);

  R.map(insertPlayerToDb, stats.data);

  return true;
};

let insertPlayerToDb = function (player) {
  enhStatsDb.insert(player);
};

let logStatus = function (success) {
  if (success) {
    console.log('Sucessfully parsed all player enhanced stats data.');
  } else {
    console.log('Unable to parse player enhanced stats.');
  }

  return Q.when(true);
}

let die = function () {
  process.exit(0);
}

rp(BASE_ENH_STATS_URL)
  .then(parseStats)
  .then(logStatus)
  .then(die);