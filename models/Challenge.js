const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  userId: String
});

module.exports = mongoose.model('Challenge', challengeSchema);