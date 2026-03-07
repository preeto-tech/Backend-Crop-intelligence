const express = require("express");
const router = express.Router();
const { getMandiData, getMandiFilters } = require("../controllers/mandiController");

// Get mandi filters (states, etc.)
router.get("/filters", getMandiFilters);

// Get mandi data (crops, districts, prices, trends)
router.get("/", getMandiData);

module.exports = router;

