import Challenge from './Challenge';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');


const userDraftSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  userId: String,
  passwd: String,
  current_challenge_id: String,
  score: Number,
  challengesCompleted: Number
});


/**
 * Password hash middleware.
 */
userDraftSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('passwd')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.passwd, salt, null, (err, hash) => {
      if (err) { return next(err); }
      console.log('bcrypt.hash(user.passwd, salt', hash);
      user.passwd = hash;
      next();
    });
  });
});

function randomFromArray(items) {
    return items[Math.floor(Math.random()*items.length)];
}

userDraftSchema.methods.changeChallenge = function(ch, cb) {
    const { current_challenge_id } = this;
    Challenge.findById(current_challenge_id).exec((err, oldCh) => {
        if (err) {
            return cb();
        }

        if (oldCh) {
            if (oldCh.playersCount === 1) {
                oldCh.remove();
            } else {
                oldCh.players = oldCh.players.filter(user => user._id !== this._id);
                const newUser = randomFromArray(oldCh.players);
                oldCh.userId = newUser._id;
                oldCh.save();
            }
        }

        this.current_challenge_id = ch._id;
        this.save();
        return cb();
    });
};

/**
 * Helper method for validating user's password.
 */
userDraftSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.passwd, (err, isMatch) => {
    cb(err, isMatch);
  });
};


module.exports = mongoose.model('UserDraft', userDraftSchema);