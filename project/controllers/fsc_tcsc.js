var express = require('express');
var router = express.Router();
var Fsc = require('../models/fsc_tcsc.js');
var async = require("async");

router.post('/create_array', function (req, res, next) {
    var fscs = req.body["fscs"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log(substations);
    var fscIterators = Array.apply(null, {length: fscs.length}).map(Function.call, Number);
    var getFscId = function (fscIterator, callback) {
        //(name, description, sil, stabilityLimit, thermalLimit, elem_num, ownerNames, regions, states, substationNames, substationVoltages, line_name, line_volt, line_num, mvar, is_switchable, done, conn)
        Fsc.getWithCreation(fscs[fscIterator]["name"], fscs[fscIterator]["description"], fscs[fscIterator]["type"], fscs[fscIterator]["sil"], fscs[fscIterator]["stability_limit"], fscs[fscIterator]["thermal_limit"], fscs[fscIterator]["elem_num"], fscs[fscIterator]["ownerName"].split('/'), fscs[fscIterator]["region"].split('/'), fscs[fscIterator]["state"].split('/'), fscs[fscIterator]["substation_names"], fscs[fscIterator]["substation_voltages"], fscs[fscIterator]["line_substations"], fscs[fscIterator]["line_voltage"], fscs[fscIterator]["line_elem_num"], fscs[fscIterator]["comp"], function (err, rows) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            var fscId = rows[0].id;
            //console.log(fscId);
            callback(null, fscId);
        }, null)
    };
    //finding each substation Id
    async.mapSeries(fscIterators, getFscId, function (err, results) {
        if (err) return next(err);
        var fscIds = results;
        res.json({fscIds: fscIds});
    });
});

module.exports = router;
