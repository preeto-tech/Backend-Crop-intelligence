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

        // Find an available vehicle for this transporter (req.user)
        const q = query(
            collection(db, 'vehicles'),
            where('userId', '==', req.user.id)
        );
        const vSnap = await getDocs(q);
        if (vSnap.empty) return res.status(400).json({ message: 'You must add a vehicle first' });

        const vehicle = vSnap.docs[0].data();

        const updateData = {
            status: 'Accepted',
            driverId: req.user.id,
            driverName: req.user.name,
            vehicleNumber: vehicle.vehicleNumber,
            vehicleType: vehicle.type,
            acceptedAt: new Date().toISOString()
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


// GET /api/transport/nearby-vehicles
const getNearbyVehicles = async (req, res) => {
    try {
        const { location } = req.query;
        let q;
        if (location) {
            q = query(
                collection(db, 'vehicles'),
                where('currentLocation', '==', location)
            );
        } else {
            q = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'));
        }

        const querySnapshot = await getDocs(q);
        const vehicles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { submitRequest, getMyRequests, getAllRequests, acceptRequest, rejectRequest, getNearbyVehicles };


