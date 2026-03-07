const express = require('express');
const router = express.Router();
const { createListing, getMyListings, getAllActiveListings, initiateOrder, getMyOrders, getFarmerOrders } = require('../controllers/marketController');
const { protect } = require('../middleware/auth');

router.post('/sell', protect, createListing);
router.get('/my-listings', protect, getMyListings);
router.get('/all', protect, getAllActiveListings);
router.post('/order', protect, initiateOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/farmer-orders', protect, getFarmerOrders);

module.exports = router;
