/**
 * GET /
 * Home page.
 */
const User = require('../models/User');
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
    res.json({status: 'ok'});
    // res.json({status: 'empty_field'});
    // if (!req.params.name) {
    //     res.json({status: 'empty_field'});
    // }
    // User.find({name: req.params.name}).exec(function (err, docs) {
    //     console.log('users', req.params, req.params.name, docs.length);
    //     res.json({status: 'ok'});
    // });
    // sleep.sleep(1);
}


exports.handshake = (req, res) => {
    // console.log('csrfToken', req.csrfToken());
    res.json({
        status: 'ok',
        token: req.csrfToken()
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