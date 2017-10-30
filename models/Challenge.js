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
  currentRoundStartTime: Date,
  currentQuestion: Number
});

challengeSchema.pre('save', function(next) {
    this.playersCount = this.players.length;
    next()
});


challengeSchema.methods.isFinish = function () {
    let isFinish = false;
    if (this.currentQuestion == this.questions.length - 1 && this.state == Challenge.states.RUNNING) {
        const answers = this.answers[this.currentQuestion] || {};
        if (Object.keys(answers).length == this.playersCount) {
            isFinish = true;
        }
    }
    return isFinish
}

const Challenge = mongoose.model('Challenge', challengeSchema);

Challenge.states = {
    INITIAL: 'INITIAL',
    RUNNING: 'RUNNING',
    FINISHED: 'FINISHED'
}

module.exports = Challenge;