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
    weatherLocation: String,
    bankingSettings: {
      refreshRate: {
        type: Number,
        default: 60 // minutes
      }
    },
    smartThingsSettings: {
      refreshRate: {
        type: Number,
        default: 30 // seconds
      }
    }
  }
});

module.exports = mongoose.model('User', UserSchema);