'use strict';

const cheerio = require('cheerio');
const rp = require('request-promise');
const shortForms = require('../utils/shortForms');
const R = require('ramda');

const BASE_GAMES_URL = 'http://www.nhl.com/ice/scores.htm';
const BASE_GAME_EXTENDED_URL = 'http://www.nhl.com/gamecenter/en/preview?id=';

let find = function (req, res) {
  rp(BASE_GAMES_URL)
    .then(getGamesFromHTML)
    .then(function (games) {
      res.send(games);
    });
};

let findByGameId = function (req, res) {
  var gameId = req.params.gameId;

  rp(BASE_GAME_EXTENDED_URL + gameId)
    .then(function (resp) {
      res.send('abc');
    })
};

let findByTeamId = function (req, res) {
  var teamName = shortForms[req.params.teamId];

  if (!teamName) {
    res.json({
      success: false,
      error: 'Invalid team name type'
    });
    return;
  }

  function filterGameByTeamName (game) {
    return game.homeTeam === teamName
      || game.awayTeam === teamName;
  }

  rp(BASE_GAMES_URL)
    .then(getGamesFromHTML)
    .then(R.filter(filterGameByTeamName))
    .then(function (games) {
      res.send(games);
    });
}

let getGamesFromHTML = function (html) {
  var $ = cheerio.load(html);
  var games = [];

  $(".gamebox").each(function (idx, ele) {
    var game = {
      gameId: $(this).find(".gcLinks a").attr("href").substr(-10),
      time: $(this).find("table th.left").text().replace(/<!--[\s\S]*?-->/g, ""),
      homeTeam: shortForms[$(this).find("tr.homeTeam td.team a").html()],
      homeScore: $(this).find("tr.homeTeam td.total").html(),
      awayTeam: shortForms[$(this).find("table td.team a").html()],
      awayScore: $(this).find("tr:not(.homeTeam) td.total").html(),
    };

    if (game.time.indexOf("FINAL") !== -1) {
      game.live = false;
    } else if (game.time.indexOf("ET") !== -1) {
      game.live = false;
    } else {
      game.live = true;
    }

    games.push(game);
  });

  return games;
};

exports.find = find;
exports.findByGameId = findByGameId;
exports.findByTeamId = findByTeamId;