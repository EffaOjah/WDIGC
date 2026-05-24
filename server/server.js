const express = require('express');
const cors = require('cors');
const path = require('path');
// Load environment variables directly from the same directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Path updated since server.js is now inside the server/ directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes - Paths simplified as we are inside the server/ directory
const authRoutes = require('./routes/authRoutes');
const sermonRoutes = require('./routes/sermonRoutes');
const eventRoutes = require('./routes/eventRoutes');
const testimonyRoutes = require('./routes/testimonyRoutes');
const formRoutes = require('./routes/formRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/sermons', sermonRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/testimonies', testimonyRoutes);
app.use('/api/forms', formRoutes);

// Simple Route
app.get('/', (req, res) => {
    res.send('WDIGC API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ success: false, message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
