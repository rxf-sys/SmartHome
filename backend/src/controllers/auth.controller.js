const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Benutzer existiert bereits' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    // Create JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    // Hier sollte der JWT_SECRET aus der Umgebungsvariable kommen
    const jwtSecret = process.env.JWT_SECRET;
    
    // Prüfen, ob der Secret existiert
    if (!jwtSecret) {
      console.error('JWT_SECRET not defined in environment variables');
      return res.status(500).json({ msg: 'Server configuration error' });
    }

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err.message);
          throw err;
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Ungültige Anmeldedaten' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Ungültige Anmeldedaten' });
    }

    // Create JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get user data
exports.getUser = async (req, res) => {
  try {
    // Get user data without password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};