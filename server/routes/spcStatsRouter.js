'use strict';

const router = require('express').Router();
const controller = require('../controllers/spcStatsController');

router.get('/', controller.find);
router.get('/team/:teamId', controller.findByTeamId);

module.exports = router;
