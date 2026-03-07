const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const connectDB = require('./config/db'); // Removed for Firestore


dotenv.config();
// Firebase initialized in config/firebase.js and used in controllers


const app = express();
app.use(cors({
    origin: true, // Dynamically allow the origin of the request
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/posts', require('./routes/communityRoutes'));
app.use('/api/mandi', require('./routes/mandiRoutes'));
app.use('/api/transport', require('./routes/transportRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/expert', require('./routes/expertRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5001;

// Create HTTP server instead of listening directly on Express app
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "*", // Or specify frontend URL
        methods: ["GET", "POST"]
    }
});

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a specific chat room (using transport request ID as the room)
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // Handle incoming messages and broadcast to the room
    socket.on('send_message', async (data) => {
        // data should contain { requestId, senderId, senderName, text, timestamp }
        io.to(data.requestId).emit('receive_message', data);

        // We will also save this to Firestore via the chatController later
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

app.get('/', (req, res) => res.json({ message: 'Crop Intelligence API is running 🌱 with WebSockets 🔌' }));

server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
