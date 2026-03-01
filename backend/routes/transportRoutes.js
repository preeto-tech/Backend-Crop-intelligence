const express = require("express");
const router = express.Router();   // 👈 YE LINE missing hai

const TransportRequest = require("../models/Transport");


router.post("/book", async (req, res) => {
  try {
    const {
      farmerName,
      crop,
      quantity,
      pickupLocation,
      phone,
      preferredDate
    } = req.body;

    const request = await TransportRequest.create({
      farmerName,
      crop,
      quantity,
      pickupLocation,
      phone,
      preferredDate,
      userId: req.user._id
    });

    res.status(201).json({
      message: "Transport request created",
      request
    });

  } catch (error) {
    res.status(500).json({
      message: "Booking failed",
      error: error.message
    });
  }
});

router.post("/book", async (req, res) => {
  try {
    const {
      farmerName,
      crop,
      quantity,
      pickupLocation,
      phone,
      preferredDate
    } = req.body;

    const request = await TransportRequest.create({
      farmerName,
      crop,
      quantity,
      pickupLocation,
      phone,
      preferredDate,
      userId: req.user._id
    });

    res.status(201).json({
      message: "Transport request created",
      request
    });

  } catch (error) {
    res.status(500).json({
      message: "Booking failed",
      error: error.message
    });
  }
});

module.exports = router;