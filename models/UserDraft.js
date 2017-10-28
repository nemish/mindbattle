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
      user.passwd = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userDraftSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.passwd, (err, isMatch) => {
    cb(err, isMatch);
  });
};


module.exports = mongoose.model('UserDraft', userDraftSchema);