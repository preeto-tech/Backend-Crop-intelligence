const mongoose = require("mongoose");

const transportSchema = new mongoose.Schema(
  {
    driverName: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    pricePerKm: { type: Number, required: true },
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transport", transportSchema);