'use strict';

const database = require('../config/db');
const db = require('monk')(database.uri);
const cheerio = require('cheerio');
const rp = require('request-promise');
const shortForms = require('../utils/shortForms');
const R = require('ramda');

const BASE_STATS_URL = 'http://www.nhl.com/stats/rest/grouped/skaters/season/skatersummary?cayenneExp=seasonId=20152016%20and%20gameTypeId=2';
const BASE_ENH_STATS_URL = 'http://www.nhl.com/stats/rest/grouped/skaters/enhanced/season/skatersummaryshooting?cayenneExp=seasonId=20152016%20and%20gameTypeId=2';

// clear the DB first
const statsDb = db.get('stats');
const enhStatsDb = db.get('enhStats');

let index = function (req, res) {
  res.send('scrape');
};

// Get the stats, then parse the data
// insert into mongo
let scrapeStats = function (req, res) {
  return statsDb.remove({})
    .then(function () {
      rp(BASE_STATS_URL)
        .then(function (resp) {
          return parseStats(resp, statsDb);
        })
        .then(function (count) {
          if (count) {
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
    });
};

let scrapeEnhStats = function (req, res) {
  return enhStatsDb.remove({})
    .then(function () {
      rp(BASE_ENH_STATS_URL)
        .then(function (resp) {
          return parseStats(resp, enhStatsDb);
        })
        .then(function (count) {
          if (count) {
            res.json({
              success: true,
              new_rows: count,
              message: 'Sucessfully parsed all enh stats data.'
            });
          } else {
            res.json({
              success: false,
              message: 'Unable to parse enh stats.'
            });
          }
        });
    });
};

let parseStats = function (response, db) {
  var stats = JSON.parse(response);

  R.map(function (player) {
    db.insert(player);
  }, stats.data);

  return stats.data.length;
};

exports.index = index;
exports.scrapeStats = scrapeStats;
exports.scrapeEnhStats = scrapeEnhStats;
