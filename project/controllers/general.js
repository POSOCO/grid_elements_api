var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.redirect('/home');
});

router.get('/home', function (req, res) {
    //just for testing
    require('../models/element').creationSQL1("@name", "@description", "@sil", "@stabilityLimit", "@thermalLimit", "@typeName", "@typeId", "@voltage", "@voltageId");

    res.render('home', {user: req.user});
});

module.exports = router;