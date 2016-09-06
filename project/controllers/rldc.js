var express = require('express');
var router = express.Router();
var Rldc = require('../models/rldc.js');

router.get('/', function (req, res) {
    Rldc.getAll(function (err, rows) {
        if (err) {
            res.json({'Error': err});
        }
        res.json({'rldcs': rows});
    });
});

module.exports = router;