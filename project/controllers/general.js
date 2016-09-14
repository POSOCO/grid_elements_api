var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.redirect('/home');
});

router.get('/home', function (req, res) {
    //just for testing
    //require('../models/substation').create("sudrr",null);

    res.render('home', {user: req.user});
});

module.exports = router;