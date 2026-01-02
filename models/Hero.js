const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  profileImage: {
    type: String,
    required: true
  },
  socialLinks: [{
    platform: {
      type: String,
      required: true,
      enum: ['github', 'linkedin']
    },
    url: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Hero', heroSchema);