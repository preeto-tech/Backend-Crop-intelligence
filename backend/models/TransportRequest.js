const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
    farmerName: { type: String, required: true },
    crop: { type: String, required: true },
    quantity: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    phone: { type: String, required: true },
    preferredDate: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    driverName: { type: String, default: '' },
    vehicleNumber: { type: String, default: '' },
    eta: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('TransportRequest', transportSchema);
