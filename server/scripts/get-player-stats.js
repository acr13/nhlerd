const database = require('../config/db');
const db = require('monk')(database.uri);
const rp = require('request-promise');
const R = require('ramda');

const BASE_STATS_URL = 'http://www.nhl.com/stats/rest/grouped/skaters/season/skatersummary?cayenneExp=seasonId=20152016%20and%20gameTypeId=2';

const statsDb = db.get('stats');
statsDb.remove({});

// Get the stats, then parse the data
// insert into mongo
let parseStats = function (response) {
  var stats = JSON.parse(response);

  R.map(insertPlayerToDb, stats.data);

  return true;
};

let insertPlayerToDb = function (player) {
  statsDb.insert(player);
};

rp(BASE_STATS_URL)
  .then(parseStats)
  .then(function (success) {
    if (success) {
      console.log('Sucessfully parsed all stats data.');
      process.exit(0);
    } else {
      console.log('Unable to parse stats.');
      process.exit(1);
    }
  });
