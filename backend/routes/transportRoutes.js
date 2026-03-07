const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { submitRequest, getMyRequests, getAllRequests, acceptRequest, rejectRequest, getNearbyVehicles } = require("../controllers/transportController");

// Book a transport request
router.post("/book", protect, submitRequest);

// Get my requests
router.get("/my", protect, getMyRequests);

// Get nearby vehicles
router.get("/nearby", protect, getNearbyVehicles);

// Admin: Get all requests
router.get("/all", protect, getAllRequests);

// Admin: Accept/Reject
router.patch("/:id/accept", protect, acceptRequest);
router.patch("/:id/reject", protect, rejectRequest);

module.exports = router;
