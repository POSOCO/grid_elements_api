var express = require('express');
var router = express.Router();
var Region = require('../models/region.js');
var async = require("async");

router.get('/', function (req, res, next) {
    Region.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'regions': rows});
    });
});

router.get('/get_by_name', function (req, res, next) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));
    Region.getByName(req.query.name, function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'region': rows});
    });
});

router.post('/', function (req, res, next) {
    var names = req.body["name"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log("States name is " + names);
    Region.replace(names, function (err, numberOfRowsInserted) {
        if (err) {
            return next(err);
        }
        res.json({'numRegionsInserted': numberOfRowsInserted});
    });
});

router.post('/create_array', function (req, res, next) {
    var names = req.body["names[]"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log("Region names are " + names);
    var regionIterators = Array.apply(null, {length: names.length}).map(Function.call, Number);
    var getRegionId = function (regionIterator, callback) {
        Region.getByNameWithCreation(names[regionIterator], function (err, rows) {
            if (err) {
                return callback(err);
            }
            var regionId = rows[0].id;
            callback(null, regionId);
        }, null)
    };
    //finding each owner Id
    async.mapSeries(regionIterators, getRegionId, function (err, results) {
        if (err) return next(err);
        var regionIds = results;
        res.json({regionIds: regionIds});
    });
});

module.exports = router;