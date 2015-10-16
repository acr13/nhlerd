'use strict';

const database = require('../config/db');
const db = require('monk')(database.uri);
const rp = require('request-promise');
const R = require('ramda');

const BASE_STATS_URL = 'http://www.nhl.com/stats/rest/grouped/teams/season/teamsummary?cayenneExp=seasonId=20152016%20and%20gameTypeId=2';
const teamStatsDb = db.get('teamStats');
teamStatsDb.remove({});

// Get the stats, then parse the data
// insert into mongo
let parseStats = function (response) {
  var stats = JSON.parse(response);

  R.map(insertTeamToDb, stats.data);

  return true;
};

let insertTeamToDb = function (player) {
  teamStatsDb.insert(player);
};

rp(BASE_STATS_URL)
  .then(parseStats)
  .then(function (success) {
    if (success) {
      console.log('Sucessfully parsed all team stats data.');
      process.exit(0);
    } else {
      console.log('Unable to parse stats.');
      process.exit(1);
    }
  });