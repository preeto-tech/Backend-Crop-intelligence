const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in your .env file');
        }
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB is unreachable
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        if (error.message.includes('ECONNREFUSED') || error.message.includes('getaddrinfo')) {
            console.error('💡 Hint: Make sure MongoDB is running locally, OR update MONGO_URI in .env to use MongoDB Atlas.');
        }
        process.exit(1);
    }
};

module.exports = connectDB;
