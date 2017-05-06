var express = require('express');
var router = express.Router();
var LineReactor = require('../models/line_reactor.js');
var async = require("async");

router.post('/create_array', function (req, res, next) {
    var lineReactors = req.body["lineReactors"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log(substations);
    var lineReactorIterators = Array.apply(null, {length: lineReactors.length}).map(Function.call, Number);
    var getLineReactorId = function (lineReactorIterator, callback) {
        //stub
        //(name, description, sil, stabilityLimit, thermalLimit, elem_num, ownerNames, regions, states, substationNames, substationVoltages, line_name, line_volt, line_num, mvar, is_switchable, done, conn)
        LineReactor.getWithCreation(lineReactors[lineReactorIterator]["name"], lineReactors[lineReactorIterator]["description"], lineReactors[lineReactorIterator]["sil"], lineReactors[lineReactorIterator]["stability_limit"], lineReactors[lineReactorIterator]["thermal_limit"], lineReactors[lineReactorIterator]["elem_num"], lineReactors[lineReactorIterator]["ownerName"].split('/'), lineReactors[lineReactorIterator]["region"].split('/'), lineReactors[lineReactorIterator]["state"].split('/'), lineReactors[lineReactorIterator]["substation_names"], lineReactors[lineReactorIterator]["substation_voltages"], lineReactors[lineReactorIterator]["line_name"], lineReactors[lineReactorIterator]["line_substations"], lineReactors[lineReactorIterator]["voltage"], lineReactors[lineReactorIterator]["line_elem_num"], lineReactors[lineReactorIterator]["mvar"], lineReactors[lineReactorIterator]["is_switchable"], function (err, rows) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            var lineReactorId = rows[0].id;
            //console.log(lineReactorId);
            callback(null, lineReactorId);
        }, null)
    };
    //finding each substation Id
    async.mapSeries(lineReactorIterators, getLineReactorId, function (err, results) {
        if (err) return next(err);
        var lineReactorIds = results;
        res.json({lineReactorIds: lineReactorIds});
    });
});

module.exports = router;
