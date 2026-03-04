const express = require("express");
const router = express.Router();

// Demo mandi data with full structure
router.get("/", (req, res) => {
  res.json({
    crops: ["Wheat", "Rice", "Tomato", "Cotton", "Potato"],
    districts: ["Pune", "Nashik", "Nagpur", "Mumbai"],
    priceTable: {
      Pune: { Wheat: 2100, Rice: 3500, Tomato: 1200, Cotton: 6000, Potato: 1500 },
      Nashik: { Wheat: 2150, Rice: 3400, Tomato: 1100, Cotton: 6200, Potato: 1400 },
    },
    trends: {
      Wheat: [2000, 2050, 2100],
      Rice: [3600, 3550, 3500],
      Tomato: [1000, 1100, 1200],
      Cotton: [5800, 5900, 6000],
      Potato: [1600, 1550, 1500],
    },
    months: ["Jan", "Feb", "Mar"],
  });
});

module.exports = router;
