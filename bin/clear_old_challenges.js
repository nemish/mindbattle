const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chalk = require('chalk');
const Challenge = require('../models/Challenge');

dotenv.load({ path: '.env.example' });

const mongoUrl = process.env.MONGODB_URI || process.env.MONGOLAB_URI;
console.log('Mongo connect url', mongoUrl);
mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

const ONE_HOUR = 60 * 60 * 1000;

console.log('Deletting old challenges');
Challenge.find({
    $or: [
        {timestamp: {$lt: new Date() - ONE_HOUR}},
        {timestamp: undefined}
    ],
    state: {$in: [Challenge.states.RUNNING, Challenge.states.INITIAL]}
}).exec((err, docs) => {
    console.log('Challenges to delete count', docs.length);
    docs.forEach(doc => {
        doc.remove();
        console.log(doc.timestamp, new Date() - ONE_HOUR, (doc.timestamp || 0) > new Date() - ONE_HOUR);
    });
    process.exit();
});
