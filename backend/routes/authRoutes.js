const express = require('express');
const router = express.Router();
const { signup, login, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getUserProfile);

module.exports = router;
