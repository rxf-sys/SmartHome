const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { getDashboardData } = require('../controllers/dashboard.controller');

// Dashboard-Daten abrufen (geschützte Route)
router.get('/', auth, getDashboardData);

module.exports = router;