'use strict';

const router = require('express').Router();

const gameRouter = require('./gameRouter');
const statsRouter = require('./statsRouter');
const enhStatsRouter = require('./enhStatsRouter');
const spcStatsRouter = require('./spcStatsRouter');
const scrapeRouter = require('./scrapeRouter');

router.get('/', function (req, res) {
  return res.send('NHLerd API 0.0.1');
});

router.use('/games', gameRouter);

// All player stats
router.use('/stats', statsRouter);
router.use('/enhstats', enhStatsRouter);
router.use('/spcstats', spcStatsRouter);

router.use('/scrape', scrapeRouter);

module.exports = router;
