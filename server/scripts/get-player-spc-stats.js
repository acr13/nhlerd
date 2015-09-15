'use strict';

const database = require('../config/db');
const db = require('monk')(database.uri);
const Q = require('q');
const R = require('ramda');
const rp = require('request-promise');

const BASE_SPC_STATS_URL = 'http://www.nhl.com/stats/rest/grouped/skaters/season/powerplay?cayenneExp=seasonId=20142015%20and%20gameTypeId=2';
const spcStatsDb = db.get('spcStats');
spcStatsDb.remove({});

// Get the stats, then parse the data
// insert into mongo
let parseStats = function (response) {
  var stats = JSON.parse(response);

  R.map(insertPlayerToDb, stats.data);

  return true;
};

let insertPlayerToDb = function (player) {
  spcStatsDb.insert(player);
};

let logStatus = function (success) {
  if (success) {
    console.log('Sucessfully parsed all player special team stats data.');
  } else {
    console.log('Unable to parse player special team stats.');
  }

  return Q.when(true);
}

let die = function () {
  process.exit(0);
}

rp(BASE_SPC_STATS_URL)
  .then(parseStats)
  .then(logStatus)
  .then(die);