/**
 * GET /
 * Home page.
 */
const UserDraft = require('../models/UserDraft');
const sleep = require('sleep');


exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};



exports.challenge = (req, res) => {
    const initialVal = calcInt();
    const secondVal = calcInt();
    const eth = initialVal + secondVal;
    const options = [eth, eth - calcInt(10), eth - calcInt(10), eth - calcInt(10)];
    res.json({
        operation: `${initialVal} + ${secondVal}`,
        result: eth,
        options: shuffle(options)
    });
}


exports.checkUserName = (req, res) => {
    const { name } = req.body;
    console.log('checkUserName', req.body);
    if (name) {
        UserDraft.find({name: name}).exec(function (err, docs) {
            if (docs.length) {
                res.json({
                    status: 'occupied'
                })
            } else {
                u = new UserDraft({name: name});
                u.save();
                res.json({
                    status: 'ok',
                    item: {
                        name: u.name,
                        id: u._id
                    }
                });
            }
        });
    } else {
        res.json({status: 'empty_field'});
    }
}


exports.fetchCurrentUser = (req, res) => {
    const { id } = req.body;
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


function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}


const calcInt = rank => Math.floor(Math.random() * (rank || 100));