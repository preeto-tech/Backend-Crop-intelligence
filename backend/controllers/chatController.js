const { db } = require('../config/firebase');
const { collection, addDoc, query, where, getDocs, orderBy } = require('firebase/firestore');

// Save a new message
const saveMessage = async (req, res) => {
    try {
        const { requestId, text } = req.body;

        if (!requestId || !text) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newMessage = {
            requestId,
            senderId: req.user.id,
            senderName: req.user.name,
            text,
            timestamp: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'transportChats'), newMessage);
        res.status(201).json({ id: docRef.id, ...newMessage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get chat history for a specific request
const getChatHistory = async (req, res) => {
    try {
        const { requestId } = req.params;

        const q = query(
            collection(db, 'transportChats'),
            where('requestId', '==', requestId),
            orderBy('timestamp', 'asc')
        );

        const querySnapshot = await getDocs(q);
        const messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { saveMessage, getChatHistory };
