var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.redirect('/query');
});

router.get('/home', function (req, res) {
    res.render('home', {user: req.user});
});

router.get('/query', function (req, res) {
    res.render('query-home', {user: req.user});
});

router.get('/query-lines', function (req, res) {
    res.render('query-lines', {user: req.user});
});

module.exports = router;