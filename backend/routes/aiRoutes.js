const express = require('express');
const router = express.Router();
const { parseSellIntent, chatWithAI } = require('../controllers/aiService');
const { protect } = require('../middleware/auth');

router.post('/parse-intent', protect, parseSellIntent);
router.post('/chat', protect, chatWithAI);

module.exports = router;
