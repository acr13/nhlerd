'use strict';

const router = require('express').Router();
const controller = require('../controllers/scrapeController');

router.get('/', controller.index);
router.get('/stats', controller.scrapeStats);

module.exports = router;
