const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  preferences: {
    // Wetter-Einstellungen
    weatherLocation: String,
    weatherLocationLat: Number,
    weatherLocationLon: Number,
    
    // Banking-Einstellungen
    bankingSettings: {
      refreshRate: {
        type: Number,
        default: 60 // Minuten
      }
    },
    
    // SmartThings-Einstellungen
    smartThingsSettings: {
      refreshRate: {
        type: Number,
        default: 30 // Sekunden
      }
    }
  }
});

module.exports = mongoose.model('User', UserSchema);