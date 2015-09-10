'use strict';

const router = require('express').Router();
const controller = require('../controllers/statsController');

router.get('/', controller.find);
//router.get('/:gameId', controller.findByGameId);
router.get('/team/:teamId', controller.findByTeamId);

module.exports = router;
