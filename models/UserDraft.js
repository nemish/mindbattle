const mongoose = require('mongoose');


const userDraftSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  userId: String,
  passwd: String,
  current_challenge_id: String,
  score: Number,
  challengesCompleted: Number
});


module.exports = mongoose.model('UserDraft', userDraftSchema);