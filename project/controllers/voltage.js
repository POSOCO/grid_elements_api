var express = require('express');
var router = express.Router();
var Voltage = require('../models/voltage.js');
var async = require("async");

router.get('/', function (req, res, next) {
    Voltage.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'data': rows});
    });
});

router.get('/get_by_level', function (req, res, next) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));
    Voltage.getByLevel(req.query.level, function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'data': rows});
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

router.post('/create_array', function (req, res, next) {
    var names = req.body["names[]"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log("Region names are " + names);
    var voltIterators = Array.apply(null, {length: names.length}).map(Function.call, Number);
    var getVoltId = function (voltIterator, callback) {
        Voltage.getByLevelWithCreation(names[voltIterator], function (err, rows) {
            if (err) {
                return callback(err);
            }
            var voltId = rows[0].id;
            callback(null, voltId);
        }, null)
    };
    //finding each owner Id
    async.mapSeries(voltIterators, getVoltId, function (err, results) {
        if (err) return next(err);
        var voltIds = results;
        res.json({voltageIds: voltIds});
    });
});

module.exports = router;
