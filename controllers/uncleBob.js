const Challenge = require('../models/Challenge');

const ONE_HOUR = 60 * 60 * 1000;


export const clearChallenges = () => {
    console.log('clearChallenges');
    Challenge.find({
        $or: [
            {timestamp: {$lt: new Date() - ONE_HOUR}},
            {timestamp: undefined}
        ]
    }).exec((err, docs) => {
        docs.forEach(doc => {
            doc.remove();
            console.log(doc.timestamp, new Date() - ONE_HOUR, (doc.timestamp || 0) > new Date() - ONE_HOUR);
        });
    })
}

export const doJob = () => {
    clearChallenges();
    setInterval(() => {
        clearChallenges();
    }, ONE_HOUR);
}
