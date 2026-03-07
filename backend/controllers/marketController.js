const { db } = require('../config/firebase');
const { collection, addDoc, getDocs, query, where } = require('firebase/firestore');

const createListing = async (req, res) => {
    try {
        const { crop, quantity, location, price, isAIGenerated } = req.body;
        const farmerId = req.user.id || req.user._id;
        const farmerName = req.user.name;

        if (!crop || !quantity || !location) {
            return res.status(400).json({ message: 'Crop, quantity, and location are required' });
        }

        const listingData = {
            farmerId,
            farmerName,
            crop,
            quantity,
            location,
            price: price || null,
            isAIGenerated: isAIGenerated || false,
            status: 'Active',
            createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'market_listings'), listingData);

        res.status(201).json({
            id: docRef.id,
            ...listingData
        });
    } catch (error) {
        console.error('Error creating market listing:', error);
        res.status(500).json({ message: 'Server error while creating market listing' });
    }
};

const getMyListings = async (req, res) => {
    try {
        const farmerId = req.user.id || req.user._id;
        const q = query(collection(db, 'market_listings'), where('farmerId', '==', farmerId));
        const snapshot = await getDocs(q);

        const listings = [];
        snapshot.forEach((doc) => listings.push({ id: doc.id, ...doc.data() }));

        res.json(listings);
    } catch (error) {
        console.error('Error fetching market listings:', error);
        res.status(500).json({ message: 'Server error while fetching my listings' });
    }
}

const getAllActiveListings = async (req, res) => {
    try {
        const q = query(
            collection(db, 'market_listings'),
            where('status', '==', 'Active')
        );
        const snapshot = await getDocs(q);

        const listings = [];
        snapshot.forEach((doc) => listings.push({ id: doc.id, ...doc.data() }));

        // Sort manually by createdAt (descending) since Firebase requires composite index for query sorting with 'where'
        listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(listings);
    } catch (error) {
        console.error('Error fetching active market listings:', error);
        res.status(500).json({ message: 'Server error while fetching active listings' });
    }
};

const initiateOrder = async (req, res) => {
    try {
        const { listingId } = req.body;
        const buyerId = req.user.id || req.user._id;
        const buyerName = req.user.name;

        // Verify listing exists
        const listingSnap = await getDocs(query(collection(db, 'market_listings'), where('__name__', '==', listingId))); // Or use doc() directly but we need the data
        // Actually best way to get a doc is using doc() and getDoc()
        const { doc, getDoc } = require('firebase/firestore');
        const listingRef = doc(db, 'market_listings', listingId);
        const listingDoc = await getDoc(listingRef);

        if (!listingDoc.exists()) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const listingData = listingDoc.data();

        // Check if an order already exists for this buyer and this listing
        const existingOrderQuery = query(
            collection(db, 'market_orders'),
            where('listingId', '==', listingId),
            where('buyerId', '==', buyerId)
        );
        const existingOrderSnap = await getDocs(existingOrderQuery);

        if (!existingOrderSnap.empty) {
            // Return existing order to continue chat
            const existingId = existingOrderSnap.docs[0].id;
            return res.status(200).json({ id: existingId, ...existingOrderSnap.docs[0].data() });
        }

        // Create new order
        const newOrder = {
            listingId,
            buyerId,
            buyerName,
            farmerId: listingData.farmerId,
            farmerName: listingData.farmerName,
            crop: listingData.crop,
            quantity: listingData.quantity,
            price: listingData.price,
            status: 'Negotiating',
            createdAt: new Date().toISOString()
        };

        const orderRef = await addDoc(collection(db, 'market_orders'), newOrder);

        res.status(201).json({ id: orderRef.id, ...newOrder });
    } catch (error) {
        console.error('Error initiating market order:', error);
        res.status(500).json({ message: 'Server error while initiating order' });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const buyerId = req.user.id || req.user._id;
        const q = query(
            collection(db, 'market_orders'),
            where('buyerId', '==', buyerId)
        );
        const snapshot = await getDocs(q);

        const orders = [];
        snapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));

        res.json(orders);
    } catch (error) {
        console.error('Error fetching buyer orders:', error);
        res.status(500).json({ message: 'Server error while fetching orders' });
    }
};

const getFarmerOrders = async (req, res) => {
    try {
        const farmerId = req.user.id || req.user._id;
        const q = query(
            collection(db, 'market_orders'),
            where('farmerId', '==', farmerId)
        );
        const snapshot = await getDocs(q);

        const orders = [];
        snapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));

        res.json(orders);
    } catch (error) {
        console.error('Error fetching farmer orders:', error);
        res.status(500).json({ message: 'Server error while fetching orders' });
    }
};

module.exports = { createListing, getMyListings, getAllActiveListings, initiateOrder, getMyOrders, getFarmerOrders };
