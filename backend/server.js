const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/posts', require('./routes/communityRoutes'));
app.use('/api/mandi', require('./routes/mandiRoutes'));
app.use('/api/transport', require('./routes/transportRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));

app.get('/', (req, res) => res.json({ message: 'Crop Intelligence API is running 🌱' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
app.use('/api/weather', require('./routes/weatherRoutes'));
