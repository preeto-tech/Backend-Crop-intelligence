const express = require('express');
const router = express.Router();
const { getAIAdvice } = require('../controllers/expertController');
const { protect } = require('../middleware/auth');

router.post('/advise', protect, getAIAdvice);

module.exports = router;
