const { db } = require('../config/firebase');
const {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    doc,
    getDoc,
    deleteDoc,
    orderBy
} = require('firebase/firestore');

// @POST /api/vehicles
// @desc Add a new vehicle
const addVehicle = async (req, res) => {
    try {
        const { type, vehicleNumber, capacity, currentLocation, availableTime } = req.body;

        if (!type || !vehicleNumber || !capacity) {
            return res.status(400).json({ message: 'Missing required vehicle fields' });
        }

        const newVehicle = {
            userId: req.user.id,
            ownerName: req.user.name,
            type,
            vehicleNumber,
            capacity,
            currentLocation: currentLocation || '',
            availableTime: availableTime || '',
            createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'vehicles'), newVehicle);
        res.status(201).json({ id: docRef.id, ...newVehicle });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @GET /api/vehicles/my
// @desc Get vehicles owned by logged in transporter
const getMyVehicles = async (req, res) => {
    try {
        const q = query(
            collection(db, 'vehicles'),
            where('userId', '==', req.user.id),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const vehicles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @DELETE /api/vehicles/:id
// @desc Delete a vehicle
const deleteVehicle = async (req, res) => {
    try {
        const vehicleRef = doc(db, 'vehicles', req.params.id);
        const vehicleSnap = await getDoc(vehicleRef);

        if (!vehicleSnap.exists()) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        if (vehicleSnap.data().userId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this vehicle' });
        }

        await deleteDoc(vehicleRef);
        res.json({ message: 'Vehicle removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { addVehicle, getMyVehicles, deleteVehicle };


