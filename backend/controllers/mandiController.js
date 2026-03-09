const { doc, getDoc, collection, query, where, getDocs } = require('firebase/firestore');
const { db } = require('../config/firebase');

const getMandiData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;

        // Grab state from query. Default to 100006 (Punjab) if not provided.
        const stateId = req.query.stateId || '100006';

        // Fetch data from Firestore cache
        const mandiPricesRef = collection(db, 'mandi_prices');
        const q = query(mandiPricesRef, where('state', '==', stateId));
        const querySnapshot = await getDocs(q);

        let allRecords = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.records && Array.isArray(data.records)) {
                allRecords = data.records;
            }
        });

        // Pagination logic
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedRecords = allRecords.slice(startIndex, endIndex);

        // Maintain exact same response structure as Agmarknet API
        res.json({
            status: "success",
            total_records: allRecords.length,
            page: page,
            limit: limit,
            records: paginatedRecords
        });
    } catch (error) {
        console.error('Error fetching mandi data from cache:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch mandi data from cache', error: error.message });
    }
};

const getMandiFilters = async (req, res) => {
    try {
        // Fetch filters from Firestore metadata
        const docRef = doc(db, 'mandi_metadata', 'filters');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            res.json(docSnap.data());
        } else {
            res.status(404).json({ status: 'error', message: 'Filters not found in cache' });
        }
    } catch (error) {
        console.error('Error fetching mandi filters from cache:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch filters from cache' });
    }
};

module.exports = { getMandiData, getMandiFilters };

