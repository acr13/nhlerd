'use strict';

let cheerio = require('cheerio');
let rp = require('request-promise');
let shortForms = require('../utils/shortForms');

const BASE_GAMES_URL = 'http://www.nhl.com/ice/scores.htm?date=09/20/2015&season=20152016';
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

  console.log(gameId);

  rp(BASE_GAME_EXTENDED_URL + gameId)
    .then(function (resp) {
      console.log(resp);
      res.send('wtf');
    })
};

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