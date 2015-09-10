'use strict';

const router = require('express').Router();

const gameRouter = require('./gameRouter');
const statsRouter = require('./statsRouter');
const enhStatsRouter = require('./enhStatsRouter');

router.get('/', function (req, res) {
  return res.send('NHLerd API');
});

router.use('/games', gameRouter);

// All player stats
router.use('/stats', statsRouter);
router.use('/enhstats', enhStatsRouter);

module.exports = router;
