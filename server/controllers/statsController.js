'use strict';

const database = require('../config/db');
const db = require('monk')(database.uri);
const rp = require('request-promise');
const shortForms = require('../utils/shortForms');
const Q = require('q');
const R = require('ramda');

const BASE_STATS_URL = 'http://www.nhl.com/stats/rest/grouped/skaters/season/skatersummary?cayenneExp=seasonId=20142015%20and%20gameTypeId=2';

const statsDb = db.get('stats');
const goalieDb = db.get('goalieStats');
const goalieEvDb = db.get('goalieStatsEv');
const goaliePpDb = db.get('goalieStatsPp');
const goaliePkDb = db.get('goalieStatsPk');
const goalieSoDb = db.get('goalieStatsSo');

const VALID_STAT_TYPES = ['ev', 'pp', 'pk', 'so'];

// Get all stats
let find = function (req, res) {
  statsDb.find({}, {sort: {points: -1}})
    .then(dataResponder(res));
};

let findByTeamId = function (req, res) {
  const team = req.params.teamId || '';
  const find = {playerTeamsPlayedFor: team};
  const sort = {sort: {points: -1}};

  statsDb.find(find, sort)
    .then(dataResponder(res));
};

let findGoalieStats = function (req, res) {
  goalieDb.find({}, {sort: {savePctg: -1}})
    .then(dataResponder(res));
};

let findGoalieStatsByType = function (req, res) {
  const type = req.params.type || false;

  if (!type || R.indexOf(type, VALID_STAT_TYPES) === -1) {
    res.json({
      success: false,
      error: 'Invalid stats type'
    });
    return;
  }

  getProperDb(type)
    .then(function (db) {
      db.name.find({}, db.sort)
        .then(dataResponder(res));
    });
};

let getProperDb = function (type) {
  if (type === 'ev') {
    return Q.when({
      name: goalieEvDb,
      sort: {sort: {evSavePctg: -1}}
    });
  } else if (type === 'pp') {
    return Q.when({
      name: goaliePpDb,
      sort: {sort: {ppSavePctg: -1}}
    });
  } else if (type === 'pk') {
    return Q.when({
      name: goaliePkDb,
      sort: {sort: {shSavePctg: -1}}
    });
  } else if (type === 'so') {
    return Q.when({
      name: goalieSoDb,
      sort: {sort: {shootoutSavePctg: -1}}
    });
  } else {
    // shouldn't get here, just incase
    return Q.when({
      name: goalieDb,
      sort: {sort: {savePctg: -1}}
    });
  }
};

let dataResponder = function (res) {
  return function (rows) {
    res.json({
      data: rows,
      total_rows: rows.length
    });
  };
};

exports.find = find;
exports.findByTeamId = findByTeamId;
exports.findGoalieStats = findGoalieStats;
exports.findGoalieStatsByType = findGoalieStatsByType;