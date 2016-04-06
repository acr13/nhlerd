'use strict';

const cheerio = require('cheerio');
const rp = require('request-promise');
const shortForms = require('../utils/shortForms');
const R = require('ramda');
const moment = require('moment');

const BASE_GAMES_URL = 'https://statsapi.web.nhl.com/api/v1/schedule';

let find = function (req, res) {
  const today = moment().format('YYYY-MM-DD');

  return rp(BASE_GAMES_URL + '?startDate=' + today + '&endDate=' + today)
    .then(pluckGamesFromResponse)
    .then(function (response) {
      res.send(response);
    });
};

let findByGameId = function (req, res) {
  const gameId = parseInt(req.params.gameId);
  const today = moment().format('YYYY-MM-DD');

  return rp(BASE_GAMES_URL + '?startDate=' + today + '&endDate=' + today)
    .then(pluckGamesFromResponse)
    .then(function (response) {
      const game = response.games.filter((game) => {
        return gameId === game.gamePk;
      });

      return res.send(game);
    });
};

let findByTeamId = function (req, res) {
  const team = req.params.teamId;
  const today = moment().format('YYYY-MM-DD');

  return rp(BASE_GAMES_URL + '?startDate=' + today + '&endDate=' + today)
    .then(pluckGamesFromResponse)
    .then(function (response) {
      const game = response.games.filter((game) => {
        return team === game.teams.away.team.name ||
          team === game.teams.home.team.name;
      });

      return res.send(game);
    });
};


let findByDate = function (req, res) {
  const date = req.query.date;

  return rp(BASE_GAMES_URL + '?startDate=' + date + '&endDate=' + date)
    .then(pluckGamesFromResponse)
    .then(function (response) {
      res.send(response);
    });
};

let findByDateRange = function (req, res) {
  const start = req.query.startDate;
  const end = req.query.endDate;

  return rp(BASE_GAMES_URL + '?startDate=' + start + '&endDate=' + end)
    .then(function (response) {
      response = JSON.parse(response);
      res.send(response.dates);
    });
};

let pluckGamesFromResponse = function (response) {
  response = JSON.parse(response);

  if (response.dates.length > 0) {
    return R.head(response.dates);
  }

  return {
    date: 'invalid date',
    games: [],
    totalItems: 0
  };
};

exports.find = find;
exports.findByGameId = findByGameId;
exports.findByTeamId = findByTeamId;
exports.findByDate = findByDate;
exports.findByDateRange = findByDateRange;
