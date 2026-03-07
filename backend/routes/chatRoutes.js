const express = require('express');
const router = express.Router();
const { saveMessage, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.post('/', protect, saveMessage);
router.get('/:requestId', protect, getChatHistory);

module.exports = router;
