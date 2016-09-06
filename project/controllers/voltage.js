var express = require('express');
var router = express.Router();
var Voltage = require('../models/voltage.js');

router.get('/', function (req, res, next) {
    Voltage.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'voltages': rows});
    });
});

router.get('/get_by_level', function (req, res, next) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));
    Voltage.getByLevel(req.query.level, function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'voltage': rows});
    });
});

router.post('/', function (req, res, next) {
    var levels = req.body["level"];
    //console.log("Voltage create post request body object is " + JSON.stringify(req.body));
    //console.log("Voltage name is " + levels);
    Voltage.create(levels, function (err, numberOfRowsInserted) {
        if (err) {
            return next(err);
        }
        res.json({'numVoltagesInserted': numberOfRowsInserted});
    });
});

module.exports = router;
