const { db } = require('../config/firebase');
const { collection, query, where, getDocs, addDoc, doc, getDoc } = require('firebase/firestore');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @POST /api/auth/signup
const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user in Firestore
        const newUser = {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role || 'farmer',
            createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(usersRef, newUser);

        res.status(201).json({
            _id: docRef.id,
            name,
            email,
            role: newUser.role,
            token: generateToken(docRef.id),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Verify password
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: userDoc.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            token: generateToken(userDoc.id),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @GET /api/auth/profile
// @access Private
const getUserProfile = async (req, res) => {
    try {
        const userRef = doc(db, 'users', req.user.id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            res.json({
                _id: userSnap.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { signup, login, getUserProfile };

