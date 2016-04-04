'use strict';

const database = require('../config/db');
const db = require('monk')(database.uri);
const cheerio = require('cheerio');
const rp = require('request-promise');
const shortForms = require('../utils/shortForms');
const R = require('ramda');

const BASE_STATS_URL = 'http://www.nhl.com/stats/rest/grouped/skaters/season/skatersummary?cayenneExp=seasonId=20152016%20and%20gameTypeId=2';

// clear the DB first
const statsDb = db.get('stats');

let index = function (req, res) {
  res.send('scrape');
};

let count = 0;

// Get the stats, then parse the data
// insert into mongo
let scrapeStats = function (req, res) {
  statsDb.remove({});

  return rp(BASE_STATS_URL)
    .then(parseStats)
    .then(function (success) {
      if (success) {
        res.json({
          success: true,
          new_rows: count,
          message: 'Sucessfully parsed all stats data.'
        });
      } else {
        res.json({
          success: false,
          message: 'Unable to parse stats.'
        });
      }
    });
};

let parseStats = function (response) {
  var stats = JSON.parse(response);
  R.map(insertPlayerToDb, stats.data);
  return true;
};

let insertPlayerToDb = function (player) {
  statsDb.insert(player);
  count++;
};

exports.index = index;
exports.scrapeStats = scrapeStats;
