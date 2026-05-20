const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'server/uploads')));

// Routes
const authRoutes = require('./server/routes/authRoutes');
const sermonRoutes = require('./server/routes/sermonRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/sermons', sermonRoutes);

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
