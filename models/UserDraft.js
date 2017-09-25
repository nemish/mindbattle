const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');


const userDraftSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  userId: String
});


module.exports = mongoose.model('UserDraft', userDraftSchema);