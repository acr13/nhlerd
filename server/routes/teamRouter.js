'use strict';

const router = require('express').Router();
const controller = require('../controllers/teamController');

router.get('/', controller.find);

module.exports = router;
