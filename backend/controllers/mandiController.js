const { doc, getDoc, collection, query, where, getDocs } = require('firebase/firestore');
const { db } = require('../config/firebase');

const getMandiData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;
        const stateId = req.query.stateId || '100006';

        // Fetch cached data from Firestore
        const docRef = doc(db, 'mandi_prices', `state_${stateId}`);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res.json({
                status: "success",
                message: "No data found for this state.",
                pagination: { total_count: 0, total_pages: 0, current_page: page, next_page: null, previous_page: null, items_per_page: limit },
                data: { columns: [], records: [], count: {} }
            });
        }

        const cached = docSnap.data();
        const allRecords = cached.records || [];
        const columns = cached.columns || [];

        // Pagination logic
        const totalCount = allRecords.length;
        const totalPages = Math.ceil(totalCount / limit);
        const startIndex = (page - 1) * limit;
        const paginatedRecords = allRecords.slice(startIndex, startIndex + limit);

        // Return in exact same structure as the original Agmarknet API
        res.json({
            status: "success",
            message: "Data fetched successfully.",
            pagination: {
                total_count: totalCount,
                total_pages: totalPages,
                current_page: page,
                next_page: page < totalPages ? `page=${page + 1}` : null,
                previous_page: page > 1 ? `page=${page - 1}` : null,
                items_per_page: limit,
            },
            data: {
                columns: columns,
                records: paginatedRecords,
                count: {},
            }
        });
    } catch (error) {
        console.error('Error fetching mandi data from cache:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch mandi data from cache', error: error.message });
    }
};

const getMandiFilters = async (req, res) => {
    try {
        const docRef = doc(db, 'mandi_metadata', 'filters');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            res.json(docSnap.data());
        } else {
            res.status(404).json({ status: 'error', message: 'Filters not found in cache. Please run the sync script first.' });
        }
    } catch (error) {
        console.error('Error fetching mandi filters from cache:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch filters from cache' });
    }
};

module.exports = { getMandiData, getMandiFilters };
