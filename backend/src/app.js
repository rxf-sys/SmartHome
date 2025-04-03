const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const weatherRoutes = require('./routes/weather.routes');
const bankingRoutes = require('./routes/banking.routes');
const smartThingsRoutes = require('./routes/smartThings.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/banking', bankingRoutes);
app.use('/api/smartthings', smartThingsRoutes);
app.use('/api/dashboard', dashboardRoutes); // Neue Dashboard-Route

// Root route
app.get('/', (req, res) => {
  res.send('Smart Home API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;