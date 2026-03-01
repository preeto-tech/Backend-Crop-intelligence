const TransportRequest = require('../models/TransportRequest');

const mockDrivers = [
    { driverName: 'Ramesh Kumar', vehicleNumber: 'MH-12-AB-4521', eta: '2 hours' },
    { driverName: 'Suresh Patil', vehicleNumber: 'MH-09-CD-7832', eta: '3 hours' },
    { driverName: 'Vijay Singh', vehicleNumber: 'MH-15-EF-1234', eta: '1.5 hours' },
    { driverName: 'Anand Sharma', vehicleNumber: 'MH-04-GH-9876', eta: '2.5 hours' },
];

// POST /api/transport — submit new request
const submitRequest = async (req, res) => {
    try {
        const { farmerName, crop, quantity, pickupLocation, phone, preferredDate } = req.body;
        const request = await TransportRequest.create({
            farmerName, crop, quantity, pickupLocation, phone, preferredDate,
            userId: req.user._id,
            status: 'Pending',
        });
        res.status(201).json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/transport/my — farmer's own requests
const getMyRequests = async (req, res) => {
    try {
        const requests = await TransportRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/transport/all — admin all requests
const getAllRequests = async (req, res) => {
    try {
        const requests = await TransportRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/transport/:id/accept
const acceptRequest = async (req, res) => {
    try {
        const request = await TransportRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        const driver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)];
        request.status = 'Accepted';
        request.driverName = driver.driverName;
        request.vehicleNumber = driver.vehicleNumber;
        request.eta = driver.eta;
        await request.save();
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/transport/:id/reject
const rejectRequest = async (req, res) => {
    try {
        const request = await TransportRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        request.status = 'Rejected';
        await request.save();
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { submitRequest, getMyRequests, getAllRequests, acceptRequest, rejectRequest };
