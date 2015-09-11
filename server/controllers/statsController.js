'use strict';

const database = require('../config/db');
const db = require('monk')(database.uri);
const rp = require('request-promise');
const shortForms = require('../utils/shortForms');
const R = require('ramda');

const BASE_STATS_URL = 'http://www.nhl.com/stats/rest/grouped/skaters/season/skatersummary?cayenneExp=seasonId=20142015%20and%20gameTypeId=2';
const statsDb = db.get('stats');

// Get all stats
let find = function (req, res) {
  statsDb.find({}, {sort: {points: -1}})
    .then(function (rows){
      res.json({
        data: rows,
        total_rows: rows.length,
        success: true
      });
    });
};

let findByTeamId = function (req, res) {
  const team = req.params.teamId || '';
  const find = {playerTeamsPlayedFor: team};
  const sort = {sort: {points: -1}};

  statsDb.find(find, sort)
    .then(function (rows) {
      res.json({
        data: rows,
        total_rows: rows.length,
        success: true
      })
    });
};

exports.find = find;
exports.findByTeamId = findByTeamId;