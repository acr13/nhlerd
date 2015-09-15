'use strict';

const database = require('../config/db');
const db = require('monk')(database.uri);
const rp = require('request-promise');
const Q = require('q');
const R = require('ramda');

// TODO: Will need to be updated with 2015 / 2016 URLs
const BASE_STATS_URL = 'http://www.nhl.com/stats/rest/grouped/goalies/season/goaliesummary?cayenneExp=seasonId=20142015%20and%20gameTypeId=2%20and%20playerPositionCode=%22G%22';
const EV_STATS_URL = 'http://www.nhl.com/stats/rest/grouped/goalies/season/goalieevenstrength?cayenneExp=seasonId=20142015%20and%20gameTypeId=2%20and%20playerPositionCode=%22G%22';
const PP_STATS_URL = 'http://www.nhl.com/stats/rest/grouped/goalies/season/goaliepowerplay?cayenneExp=seasonId=20142015%20and%20gameTypeId=2%20and%20playerPositionCode=%22G%22';
const PK_STATS_URL = 'http://www.nhl.com/stats/rest/grouped/goalies/season/goaliepenaltykill?cayenneExp=seasonId=20142015%20and%20gameTypeId=2%20and%20playerPositionCode=%22G%22';
const SO_STATS_URL = 'http://www.nhl.com/stats/rest/grouped/goalies/shootouts/season/goalieshootout?cayenneExp=seasonId=20142015%20and%20gameTypeId=2%20and%20playerPositionCode=%22G%22';

const goalieDb = db.get('goalieStats');
const goalieEvDb = db.get('goalieStatsEv');
const goaliePpDb = db.get('goalieStatsPp');
const goaliePkDb = db.get('goalieStatsPk');
const goalieSoDb = db.get('goalieStatsSo');

// Remove all old records
goalieDb.remove({});
goalieEvDb.remove({});
goaliePpDb.remove({});
goaliePkDb.remove({});
goalieSoDb.remove({});

// Get the stats, then parse the data
// insert into mongo
let parseStats = function (type, response) {
  return function (response) {
    var stats = JSON.parse(response);

    if (type === 'base') {
      R.map(insertGoalieToDb, stats.data);
    } else if (type === 'ev') {
      R.map(insertGoalieToEvDb, stats.data);
    } else if (type === 'pp') {
      R.map(insertGoalieToPpDb, stats.data);
    } else if (type === 'pk') {
      R.map(insertGoalieToPkDb, stats.data);
    } else if (type === 'so') {
      R.map(insertGoalieToSoDb, stats.data);
    } else {
      return Q.when(false);
    }

    return Q.when(true);
  }
};

let insertGoalieToDb = function (player) {
  goalieDb.insert(player);
};

let insertGoalieToEvDb = function (player) {
  goalieEvDb.insert(player);
};

let insertGoalieToPpDb = function (player) {
  goaliePpDb.insert(player);
};

let insertGoalieToPkDb = function (player) {
  goaliePkDb.insert(player);
};

let insertGoalieToSoDb = function (player) {
  goalieSoDb.insert(player);
};

let logSuccess = function (type) {
  console.log('Sucessfully parsed all goalie ' + type + ' data.');
  return Q.when(true);
};

let die = function () {
  process.exit(0);
}

rp(BASE_STATS_URL)
  .then(parseStats('base'))
  .then(logSuccess('stat'))
  .then(function (finished) {
    if (finished) {
      return rp(EV_STATS_URL);
    } else {
      die();
    }
  })
  .then(parseStats('ev'))
  .then(logSuccess('even strength'))
    .then(function (finished) {
    if (finished) {
      return rp(PP_STATS_URL);
    } else {
      die();
    }
  })
  .then(parseStats('pp'))
  .then(logSuccess('power play'))
    .then(function (finished) {
    if (finished) {
      return rp(PK_STATS_URL);
    } else {
      die();
    }
  })
  .then(parseStats('pk'))
  .then(logSuccess('penalty kill'))
    .then(function (finished) {
    if (finished) {
      return rp(SO_STATS_URL);
    } else {
      die();
    }
  })
  .then(parseStats('so'))
  .then(logSuccess('shootout'))
  .then(die);
