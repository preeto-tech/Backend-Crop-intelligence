const express = require('express');
const router = express.Router();
const { parseSellIntent } = require('../controllers/aiService');
const { protect } = require('../middleware/auth');

router.post('/parse-intent', protect, parseSellIntent);

module.exports = router;
