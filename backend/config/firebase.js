const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyCTj7e-sIlJY1MGBifF8gpX3uDd7_wtQ5Y",
    authDomain: "crop-intelligence.firebaseapp.com",
    projectId: "crop-intelligence",
    storageBucket: "crop-intelligence.firebasestorage.app",
    messagingSenderId: "406282270608",
    appId: "1:406282270608:web:2692263c953de04fc3e515",
    measurementId: "G-XEG87GYXH5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };
