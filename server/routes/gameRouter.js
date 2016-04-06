'use strict';

const router = require('express').Router();
const controller = require('../controllers/gameController');

router.get('/', controller.find);
router.get('/id/:gameId', controller.findByGameId);
router.get('/team/:teamId', controller.findByTeamId);
router.get('/date', controller.findByDate);
router.get('/daterange', controller.findByDateRange);

module.exports = router;
