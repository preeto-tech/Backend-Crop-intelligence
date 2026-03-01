const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    transport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transport",
      required: true
    },
    from: String,
    to: String,
    cropType: String,
    status: {
      type: String,
      default: "Booked"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);