'use strict';

const router = require('express').Router();
const controller = require('../controllers/statsController');

router.get('/', controller.find);
router.get('/team/:teamId', controller.findByTeamId);
router.get('/goalies', controller.findGoalieStats);
router.get('/goalies/:type', controller.findGoalieStatsByType);

module.exports = router;
