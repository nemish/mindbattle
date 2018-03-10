/**
 * GET /
 * Home page.
 */
const { challengeTotal, calcScore } = require('../client/src/utils/challenge');
const UserDraft = require('../models/UserDraft');
const Challenge = require('../models/Challenge');
const sleep = require('sleep');
const passport = require('passport');
const utils = require('../utils');


// exports.index = (req, res) => {
//   res.render('home', {
//     title: 'Home'
//   });
// };


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


const OPERATIONS_MAP = {
    '+': (prev, next) => prev + next,
    '*': (prev, next) => prev * next,
    '-': (prev, next) => prev - next,
    '/': (prev, next) => prev / next,
}


const OPERATORS = ['+', '-', '*', '/'];


const makeQuestionConf = () => {
    const numArgs = getRandomInt(2, 4)
    const values = Array(numArgs).fill().map(() => {
        return calcInt(50);
    });
    let operations = [];
    let operation = '';
    values.forEach((value, index) => {
        let op = OPERATORS[getRandomInt(0, 3)];

        if (index === numArgs - 1) {
            operation += value.toString();
        } else {
            const curOp = {
                id: index,
                op: op,
                current: value
            }
            operations.push(curOp);
            operation += value.toString() + ' ' + op + ' ';
        }

        if (index > 0) {
            operations[index-1].next = value;
        }
    });

    return {
        type: 'math',
        result: Math.floor(eval(operation)),
        operation,
        operations
    };
}


const createQuestion = () => {
    let conf = createArithmeticsQuestion();
    if (Math.random() > 0.5) {
        conf = createGraphQuestion();
    }
    return conf;
}


const calcGraphValue = (fnStr, first, second, index) => {
    return Math[fnStr](index) * first + second;
}


const graphFuncs = ['cos', 'sin', 'exp', 'tan']


const getRandomGraphFn = excludeFns => {
    let funcs = graphFuncs;
    if (excludeFns) {
        funcs = funcs.filter(fnStr => excludeFns.indexOf(fnStr) === -1)
    }
    return funcs[getRandomInt(0, funcs.length-1)]
};


const createFnString = (fnStr, first, second) => {
    return `y = ${first > 1 ? first : ''}${fnStr}(x)${second > 0 ? (' + ' + second) : (second < 0 ? ' - ' + second : '')}`;
}


const createGraphQuestion = () => {
    const fnStr = graphFuncs[getRandomInt(0, graphFuncs.length-1)];
    let options = [];
    let fnStrs = [];
    let firstFirst = null;
    let firstSecond = null;
    [...Array(4).keys()].forEach(() => {
        let first = getRandomInt(1, 5);
        let second = getRandomInt(-10, 10);
        if (!firstFirst && ! firstSecond) {
            firstFirst = first;
            firstSecond = second;
        }
        let tmpFnStr = getRandomGraphFn(fnStrs);
        options.push(createFnString(tmpFnStr, first, second));
        fnStrs.push(tmpFnStr);
    });



    return {
        type: 'spline',
        data: [...Array(10).keys()].map((val, index) => calcGraphValue(fnStrs[0], firstFirst, firstSecond, index)),
        result: options[0],
        options: shuffle(options)
    }
}


const createArithmeticsQuestion = () => {
    let conf = makeQuestionConf();
    while (conf.result == 0) {
        conf = makeQuestionConf();
    }
    let { result, operations, operation } = conf;

    const initialVal = calcInt();
    const secondVal = calcInt();
    const eth = initialVal + secondVal;
    const options = [
        result,
        result - (result / 2) + getRandomInt(-100, 100),
        result + (result / 2) + getRandomInt(-100, 100),
        result * 2 + getRandomInt(-100, 100)
    ];
    return {
        type: 'arithmetics',
        operation: operation,
        result: result,
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
        UserDraft.find({name: name.toLowerCase()}).exec(function (err, docs) {
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


exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(403).send({
            status: 'error',
            msg: 'Password check error'
        })
      }

      if (!user) {
        return res.status(403).send({
            status: 'error',
            msg: 'Wrong name or password'
        })
      }

        const token = utils.generateToken(user);

        res.json({
            status: 'ok',
            item: user,
            token
        });
    })(req, res, next);
}


exports.fetchPlayers = (req, res) => {
    const { id } = req.params;
    Challenge.findById(id).exec((err, doc) => {
        UserDraft.find({_id: {$in: doc.players}}).exec((err, docs) => {
            res.json({
                items: docs
            });
        })
    })
}


exports.registerUser = (req, res, next) => {
  const { name, passwd } = req.body;
  if (!name || !passwd) {
    return res.status(400).send({
        msg: 'empty name or passwd'
    });
  }

  const user = new UserDraft({
      name: name.toLowerCase(), passwd
  });

  UserDraft.findOne({ name }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
        res.json({
            status: 'occupied'
        });
    } else {
        user.save((err) => {
            if (err) {
                return next(err);
            }
            const token = utils.generateToken(user);
            res.json({
                status: 'ok',
                item: user,
                token
            });
        });
    }
  });
}


exports.fetchCurrentUser = (req, res) => {
    res.json({
        status: 'ok',
        item: req.user
    });
}


let challengeWatchers = {};


const runChallengeWatcher = (id, socket) => {
    if (!challengeWatchers[id]) {
        challengeWatchers[id] = setInterval(() => {
            Challenge.findById(id).exec((err, ch) => {
                const needClear = err
                                  || !ch
                                  || ch.state == Challenge.states.FINISHED
                                  || ch.timestamp < (new Date() - 60 * 10 * 10000);
                if (needClear) {
                    clearInterval(challengeWatchers[id]);
                    return;
                }

                if (ch.currentRoundStartTime < (new Date() - 11000)) {
                    const answersData = ch.answers[ch.currentQuestion] || {};
                    ch.players.forEach(player => {
                        if (!answersData[player._id]) {
                            answersData[player._id] = {
                                option: null,
                                elapsed: 10000,
                                timestamp: new Date()
                            }
                        }
                    });

                    ch.answers[ch.currentQuestion] = answersData;
                    ch.currentRoundStartTime = new Date();
                    if (ch.isFinish()) {
                        clearInterval(challengeWatchers[id]);
                    } else {
                        ch.currentQuestion = ch.currentQuestion + 1;
                    }
                    exports.updateChallenge({
                        data: ch
                    }, socket);
                }
            });
        }, 1000)
    }
}


exports.updateChallenge = (data, socket) => {
    if (!data || !data.data) {
        return;
    }
    const { start } = data.data;
    delete data.data.start;
    const { _id } = data.data;

    if (start) {
        runChallengeWatcher(_id, socket);
    }

    Challenge.findById(_id).exec((err, ch) => {
        if (ch.changer) {
            if (ch.changer.playersUpdateById) {
                const { _id, data } = ch.changer.playersUpdateById;
                ch.players = ch.players.map(player => {
                    if (player._id == _id) {
                        return Object.assign({}, player, data);
                    }
                    return player
                });
            }
        }
        Object.keys(data.data).forEach(key => {
            const val = data.data[key];
            let chVal = ch[key];
            if (key == 'answers') {
                let anss = ch.answers[ch.currentQuestion] || {};
                let newAnss = val[ch.currentQuestion] || {};
                Object.keys(newAnss).forEach(k => anss[k] = newAnss[k]);
                let items = ch.answers.slice(0, ch.currentQuestion)
                items.push(anss);
                ch[key] = items;
            } else {
                ch[key] = val;
            }
        });
        const isFinish = ch.isFinish();

        if (start) {
            ch.currentRoundStartTime = new Date();
        }

        if (isFinish) {
            ch.state = Challenge.states.FINISHED;
            const total = challengeTotal(ch);
            UserDraft.find({_id: {$in: ch.players.map(pl => pl._id)}}).exec((err, docs) => {
                docs.forEach(doc => {
                    doc.current_challenge_id = null;
                    const score = calcScore(ch, total, doc._id)
                    doc.score = (doc.score || 0) + score;
                    doc.challengesCompleted = (doc.challengesCompleted || 0) + 1;
                    doc.save()
                })
            });
        }
        ch.save();
        socket.emit('challenge_update', {data: ch});
    });
}


exports.fetchChallengesInfo = (req, res) => {
}


exports.challengeList = (req, res) => {
    const query = {
        playersCount: {$gt: 0},
        timestamp: { $ne: null },
        access: 'public',
        state: {$in: [Challenge.states.INITIAL, Challenge.states.RUNNING]}
    };

    Challenge.find(query).sort('-state').exec(function (err, docs) {
        if (!docs.length) {
            res.json({
                status: 'ok',
                items: []
            })
            return;
        }
        const usersIds = docs.map(doc => doc.userId);
        UserDraft.find({_id: {$in: usersIds}}).exec(function (err, users) {
            let usersMap = {};
            users.forEach(user => {
                usersMap[user._id] = user;
            });
            res.json({
                status: 'ok',
                items: docs.map(item => {
                    const { userId, timestamp, playersCount, maxPlayers, _id, state } = item;
                    return {
                        _id,
                        userId,
                        state,
                        userName: usersMap[userId].name,
                        timestamp,
                        playersCount,
                        maxPlayers
                    }
                })
            });
        });
    });
}


exports.joinChallenge = (req, res) => {
    const { user_id, id } = req.body;
    UserDraft.findById(user_id).exec((err, user) => {
        Challenge.findById(id).exec((err, ch) => {
            if (ch.players.filter(player => player._id == user_id).length) {
                res.json(ch);
                return;
            }
            if (ch.players.length == ch.players.maxPlayers) {
                res.status = 400
                res.json({
                    msg: 'Players limit reached',
                    item: ch
                })
                return;
            }

            const { _id, name } = user;
            ch.players.push({
                _id, name
            });
            ch.save()
            refreshPreviousChallenge(user);
            user.current_challenge_id = ch._id;
            user.save();
            res.json(ch);
        });
    });
}


const refreshPreviousChallenge = user => {
    const { current_challenge_id } = user;
    if (current_challenge_id) {
        Challenge.findById(current_challenge_id).exec((err, challenge) => {
            if (challenge) {
                challenge.players = challenge.players.filter(player => player._id == user._id);
                challenge.save();
            }
            if (challenge && !challenge.players.length && challenge.state != Challenge.states.FINISHED) {
                challenge.remove();
            }
        })
    }
}


export const handleCreateChallenge = ({userId, access, errCb}, cb) => {
    UserDraft.findById(userId).exec((err, user) => {
        console.log(err, user);
        if ((err || !user) && errCb) {
            return errCb();
        }

        const questionsCount = 10;
        const { name, _id } = user;
        const ch = new Challenge({
            userId: user._id,
            maxPlayers: 10,
            timestamp: new Date(),
            state: Challenge.states.INITIAL,
            access: access,
            currentQuestion: null,
            questions: [...Array(questionsCount).keys()].map(createQuestion),
            answers: [],
        });
        ch.addPlayer(user);
        ch.save().then(() => {
            refreshPreviousChallenge(user);
            user.current_challenge_id = ch._id;
            user.save();
            console.log('save', ch._id, user.current_challenge_id);
            if (cb) {
                return cb(ch)
            }
        });
    })
}


export const handleStartChallenge = ({id, errCb}, cb) => {
    Challenge.findById(id).exec((err, ch) => {
        if ((err || !ch) && errCb) {
            return errCb();
        }
        ch.state = Challenge.states.RUNNING;
        ch.currentQuestion = 0;
        ch.save();
        if (cb) {
            return cb(ch);
        }
    });
}

export const handleExitChallenge = ({id, userId, errCb}, cb) => {
    console.log('handleExitChallenge', id, userId);
    Challenge.findById(id).exec((err, ch) => {
        if ((err || !ch) && errCb) {
            return errCb();
        }
        UserDraft.findById(userId).exec((err, user) => {
            if ((err || !ch) && errCb) {
                return errCb();
            }

            refreshPreviousChallenge({current_challenge_id: id});
            user.current_challenge_id = null;
            user.save();
            if (cb) {
                return cb({
                    status: 'success'
                })
            }
        })
    });
}


export const handleJoinChallenge = ({challengeId, userId, errCb}, cb) => {
    console.log('handleExitChallenge', id, userId);
    Challenge.findById(challengeId).exec((err, ch) => {
        if ((err || !ch) && errCb) {
            return errCb();
        }
        UserDraft.findById(userId).exec((err, user) => {
            if ((err || !ch) && errCb) {
                return errCb();
            }

            ch.addPlayer(user);
            ch.save();
            if (cb) {
                return cb(ch);
            }
        })
    });
}


exports.createChallenge = (req, res) => {
    handleCreateChallenge(req.body, ch => res.json(ch));
}


function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}


const calcInt = rank => Math.floor(Math.random() * (rank || 100));