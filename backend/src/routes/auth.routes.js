const express = require('express');
const router = express.Router();
const { register, login, getUser } = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get user data (protected route)
router.get('/me', auth, getUser);

module.exports = router;