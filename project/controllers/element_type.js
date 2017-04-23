var express = require('express');
var router = express.Router();
var Element_type = require('../models/element_type.js');
var async = require("async");

router.get('/', function (req, res, next) {
    Element_type.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'types': rows});
    });
});

router.get('/get_by_type', function (req, res, next) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));
    Element_type.getByType(req.query.type, function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'el_type': rows});
    });
});

router.post('/', function (req, res, next) {
    var types = req.body["type"];
    //console.log("Voltage create post request body object is " + JSON.stringify(req.body));
    //console.log("Voltage name is " + types);
    Element_type.create(types, function (err, numberOfRowsInserted) {
        if (err) {
            return next(err);
        }
        res.json({'numTypesInserted': numberOfRowsInserted});
    });
});

router.post('/create_array', function (req, res, next) {
    var names = req.body["names[]"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log("Element Types are " + names);
    var elemTypeIterators = Array.apply(null, {length: names.length}).map(Function.call, Number);
    var getElemTypeId = function (elemTypeIterator, callback) {
        Element_type.getByTypeWithCreation(names[elemTypeIterator], function (err, rows) {
            if (err) {
                return callback(err);
            }
            var elemTypeId = rows[0].id;
            callback(null, elemTypeId);
        }, null)
    };
    //finding each owner Id
    async.mapSeries(elemTypeIterators, getElemTypeId, function (err, results) {
        if (err) return next(err);
        var elementTypeIds = results;
        res.json({elementTypeIds: elementTypeIds});
    });
});

module.exports = router;