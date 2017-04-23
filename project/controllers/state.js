var express = require('express');
var router = express.Router();
var State = require('../models/state.js');
var async = require("async");

router.get('/', function (req, res, next) {
    State.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'states': rows});
    });
});

router.get('/get_by_name', function (req, res, next) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));
    State.getByName(req.query.name, function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'state': rows});
    });
});

router.post('/', function (req, res, next) {
    var names = req.body["name"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log("States name is " + names);
    State.create(names, function (err, numberOfRowsInserted) {
        if (err) {
            return next(err);
        }
        res.json({'numStatesInserted': numberOfRowsInserted});
    });
});

router.post('/create_array', function (req, res, next) {
    var names = req.body["names[]"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    console.log("State names are " + names);
    var stateIterators = Array.apply(null, {length: names.length}).map(Function.call, Number);
    var getRegionId = function (stateIterator, callback) {
        State.getByNameWithCreation(names[stateIterator], function (err, rows) {
            if (err) {
                return callback(err);
            }
            var stateId = rows[0].id;
            callback(null, stateId);
        }, null)
    };
    //finding each owner Id
    async.mapSeries(stateIterators, getRegionId, function (err, results) {
        if (err) return next(err);
        var stateIds = results;
        res.json({stateIds: stateIds});
    });
});

module.exports = router;