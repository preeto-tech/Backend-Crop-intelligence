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
        const { name, email, password, role, location, phone } = req.body;

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
            location: location || '',
            phone: phone || '',
            createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(usersRef, newUser);

        res.status(201).json({
            user: {
                _id: docRef.id,
                name,
                email,
                role: newUser.role,
                location: newUser.location,
                phone: newUser.phone,
            },
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

        // Hardcoded Expert Login
        if (email.toLowerCase() === 'expert@agrimail.com' && password === 'password123') {
            const expertId = 'expert-hardcoded-id';
            return res.json({
                user: {
                    _id: expertId,
                    name: 'Agri Expert',
                    email: 'expert@agrimail.com',
                    role: 'expert',
                    location: 'System Center',
                },
                token: generateToken(expertId),
            });
        }

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
            user: {
                _id: userDoc.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                location: userData.location || '',
                phone: userData.phone || '',
            },
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
        const expertId = 'expert-hardcoded-id';
        if (req.user.id === expertId) {
            return res.json({
                _id: expertId,
                name: 'Agri Expert',
                email: 'expert@agrimail.com',
                role: 'expert',
                location: 'System Center'
            });
        }
        const userRef = doc(db, 'users', req.user.id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            res.json({
                _id: userSnap.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                location: userData.location || '',
                phone: userData.phone || '',
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { signup, login, getUserProfile };

