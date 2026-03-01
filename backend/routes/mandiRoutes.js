const express = require("express");
const router = express.Router();

// demo mandi data
router.get("/", (req, res) => {
  res.json({
    message: "Mandi API working 🚀"
  });
});

module.exports = router;
