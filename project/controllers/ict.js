var express = require('express');
var router = express.Router();
var Ict = require('../models/ict.js');
var async = require("async");

router.post('/create_array', function (req, res, next) {
    var elements = req.body["elements"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log(substations);
    var elementIterators = Array.apply(null, {length: elements.length}).map(Function.call, Number);
    var getElementId = function (elementIterator, callback) {
        //name, description, voltage, ownerNames, regions, states
        var ownerRegions = Array.apply(null, {length: elements[elementIterator]["ownerName"].split("/").length}).map(function (obj) {
            return "NA";
        });
        //function (name, description, sil, stabilityLimit, thermalLimit, voltage, elem_num, ownerNames, ownerMetadatas, ownerRegions, regions, states, substationNames, substationVoltages, done, conn)
        Ict.getWithCreation(elements[elementIterator]["name"], elements[elementIterator]["description"], elements[elementIterator]["sil"], elements[elementIterator]["stability_limit"], elements[elementIterator]["thermal_limit"], elements[elementIterator]["voltage"], elements[elementIterator]["elem_num"], elements[elementIterator]["ownerName"].split("/"), elements[elementIterator]["ownerName"].split("/"), ownerRegions, elements[elementIterator]["region"].split("/"), elements[elementIterator]["state"].split("/"), elements[elementIterator]["substations"], elements[elementIterator]["substationVoltages"], function (err, rows) {
            if (err) {
                return callback(err);
            }
            var elementId = rows[0].id;
            //console.log(elementId);
            callback(null, elementId);
        }, null)
    };
    //finding each element Id
    async.mapSeries(elementIterators, getElementId, function (err, results) {
        if (err) {
            console.log(err);
            return next(err);
        }
        var elementIds = results;
        res.json({elementIds: elementIds});
    });
});

module.exports = router;
