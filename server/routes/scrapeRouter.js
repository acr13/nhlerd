'use strict';

const router = require('express').Router();
const controller = require('../controllers/scrapeController');

router.get('/', controller.index);
router.get('/stats', controller.scrapeStats);
router.get('/stats/enh', controller.scrapeEnhStats);

module.exports = router;
