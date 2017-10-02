const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  timestamp: Date,
  userId: String,
  state: String,
  access: String,
  maxPlayers: Number,
  players: Array,
  playersCount: Number,
  questions: Array,
  answers: Array,
  currentQuestion: Number
});

challengeSchema.pre('save', function(next) {
    this.playersCount = this.players.length;
    next()
});

const Challenge = mongoose.model('Challenge', challengeSchema);

Challenge.states = {
    INITIAL: 'INITIAL',
    RUNNING: 'RUNNING',
    FINISHED: 'FINISHED'
}

module.exports = Challenge;