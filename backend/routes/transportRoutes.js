const express = require("express");
const router = express.Router();

// Book a transport request
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

    // Optional: Only use req.user if it exists (for backward compatibility or testing)
    const userId = req.user ? req.user._id : "mocked_user_id";

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