var express = require('express');
var router = express.Router();
var ConductorType = require('../models/conductor_type.js');
var async = require("async");

router.get('/', function (req, res, next) {
    ConductorType.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'types': rows});
    });
});

router.get('/get_by_name', function (req, res, next) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));
    ConductorType.getByName(req.query.name, function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'con_type': rows});
    });
});

router.post('/', function (req, res, next) {
    var types = req.body["type"];
    //console.log("Voltage create post request body object is " + JSON.stringify(req.body));
    //console.log("Voltage name is " + types);
    ConductorType.create(types, function (err, numberOfRowsInserted) {
        if (err) {
            return next(err);
        }
        res.json({'numTypesInserted': numberOfRowsInserted});
    });
});

router.post('/create_array', function (req, res, next) {
    var names = req.body["names[]"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log("Region names are " + names);
    var condTypeIterators = Array.apply(null, {length: names.length}).map(Function.call, Number);
    var getCondTypeId = function (condTypeIterator, callback) {
        ConductorType.getByNameWithCreation(names[condTypeIterator], function (err, rows) {
            if (err) {
                return callback(err);
            }
            var condTypeId = rows[0].id;
            callback(null, condTypeId);
        }, null)
    };
    //finding each conductorType Id
    async.mapSeries(condTypeIterators, getCondTypeId, function (err, results) {
        if (err) return next(err);
        var condTypeIds = results;
        res.json({conductorTypeIds: condTypeIds});
    });
});

module.exports = router;
