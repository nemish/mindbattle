/**
 * GET /
 * Home page.
 */
const UserDraft = require('../models/UserDraft');
const Challenge = require('../models/Challenge');
const sleep = require('sleep');


exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};


const createQuestion = () => {
    const initialVal = calcInt();
    const secondVal = calcInt();
    const eth = initialVal + secondVal;
    const options = [eth, eth - calcInt(10), eth - calcInt(10), eth - calcInt(10)];
    return {
        operation: `${initialVal} + ${secondVal}`,
        result: eth,
        options: shuffle(options)
    }
}



exports.challenge = (req, res) => {
    const { id } = req.params
    Challenge.findById(id).exec((err, ch) => {
        res.json(ch);
    });
}


exports.checkUserName = (req, res) => {
    const { name } = req.body;
    if (name) {
        UserDraft.find({name: name}).exec(function (err, docs) {
            if (docs.length) {
                res.json({
                    status: 'occupied'
                })
            } else {
                res.json({
                    status: 'ok'
                })
            }
        });
    } else {
        res.json({status: 'empty_field'});
    }
}


exports.login = (req, res) => {
    const { name, passwd } = req.body;
    if (name && passwd) {
        UserDraft.find({name: name}).exec(function (err, docs) {
            if (docs.length) {
                const u = docs[0];
                if (u.passwd == passwd) {
                    res.json({
                        status: 'ok',
                        item: u
                    })
                } else {
                    res.json({
                        status: 'error',
                        msg: 'Wrong name or password'
                    })
                }
            }
        });
    } else {
        res.json({status: 'empty_field'});
    }
}


exports.registerUser = (req, res) => {
    const { name, passwd } = req.body;
    if (name && passwd) {
        UserDraft.find({name: name}).exec(function (err, docs) {
            if (docs.length) {
                const u = docs[0];
                if (u.passwd == passwd) {
                    res.json({
                        status: 'ok',
                        item: u
                    })
                } else {
                    res.json({
                        status: 'error',
                        msg: 'Wrong name or password'
                    })
                }
            } else {
                u = new UserDraft({name, passwd});
                u.save();
                res.json({
                    status: 'ok',
                    item: u
                });
            }
        });
    } else {
        res.json({status: 'empty_field'});
    }
}


exports.fetchCurrentUser = (req, res) => {
    const { id } = req.params;
    if (id) {
        UserDraft.findById(id).exec(function (err, doc) {
            res.json({
                status: 'ok',
                item: doc
            });
        });
    } else {
        res.json({
            status: 'not_found'
        });
    }
}


exports.createChallenge = (req, res) => {
    const { user_id, access } = req.body;
    UserDraft.findById(user_id).exec((err, user) => {
        const questionsCount = 10;
        const ch = new Challenge({
            userId: user._id,
            maxPlayers: 10,
            state: Challenge.states.INITIAL,
            access: access,
            currentQuestion: 0,
            questions: [...Array(questionsCount).keys()].map(createQuestion),
            answers: []
        });
        ch.save();
        user.current_challenge_id = ch._id;
        user.save();
        res.json(ch);
    })
}


function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}


const calcInt = rank => Math.floor(Math.random() * (rank || 100));