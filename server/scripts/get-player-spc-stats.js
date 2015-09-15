'use strict';

const database = require('../config/db');
const db = require('monk')(database.uri);
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

rp(BASE_SPC_STATS_URL)
  .then(parseStats)
  .then(function (success) {
    if (success) {
      console.log('Sucessfully parsed all special teams stats data.');
    } else {
      console.log('Unable to parse special teams stats.');
    }
  });