const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

// Book a transport request
router.post("/book", protect, async (req, res) => {
  try {
    const {
      farmerName,
      crop,
      quantity,
      pickupLocation,
      phone,
      preferredDate
    } = req.body;

    const userId = req.user._id;

    // For now, let's return a success message and the data back
    res.status(201).json({
      message: "Transport request created successfully! 🚛",
      request: {
        farmerName,
        crop,
        quantity,
        pickupLocation,
        phone,
        preferredDate,
        userId
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Booking failed",
      error: error.message
    });
  }
});

module.exports = router;