const express = require("express");
const router = express.Router();
const { getMandiData } = require("../controllers/mandiController");

// Get mandi data (crops, districts, prices, trends)
router.get("/", getMandiData);

module.exports = router;

