const { db } = require('../config/firebase');
const {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    orderBy
} = require('firebase/firestore');

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
        const newRequest = {
            farmerName,
            crop,
            quantity,
            pickupLocation,
            phone,
            preferredDate,
            userId: req.user.id,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'transportRequests'), newRequest);
        res.status(201).json({ id: docRef.id, ...newRequest });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/transport/my — farmer's own requests
const getMyRequests = async (req, res) => {
    try {
        const q = query(
            collection(db, 'transportRequests'),
            where('userId', '==', req.user.id),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/transport/all — admin all requests
const getAllRequests = async (req, res) => {
    try {
        const q = query(collection(db, 'transportRequests'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/transport/:id/accept
const acceptRequest = async (req, res) => {
    try {
        const requestRef = doc(db, 'transportRequests', req.params.id);
        const requestSnap = await getDoc(requestRef);
        if (!requestSnap.exists()) return res.status(404).json({ message: 'Request not found' });

        const driver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)];
        const updateData = {
            status: 'Accepted',
            driverName: driver.driverName,
            vehicleNumber: driver.vehicleNumber,
            eta: driver.eta
        };

        await updateDoc(requestRef, updateData);
        res.json({ id: requestSnap.id, ...requestSnap.data(), ...updateData });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/transport/:id/reject
const rejectRequest = async (req, res) => {
    try {
        const requestRef = doc(db, 'transportRequests', req.params.id);
        const requestSnap = await getDoc(requestRef);
        if (!requestSnap.exists()) return res.status(404).json({ message: 'Request not found' });

        await updateDoc(requestRef, { status: 'Rejected' });
        res.json({ id: requestSnap.id, ...requestSnap.data(), status: 'Rejected' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { submitRequest, getMyRequests, getAllRequests, acceptRequest, rejectRequest };

