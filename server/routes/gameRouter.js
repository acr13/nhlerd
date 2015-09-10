'use strict';

const router = require('express').Router();
const controller = require('../controllers/gameController');

router.get('/', controller.find);
router.get('/:gameId', controller.findByGameId);

module.exports = router;
