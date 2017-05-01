var express = require('express');
var router = express.Router();
var Line = require('../models/line.js');
var async = require("async");

router.post('/create_from_csv', function (req, res, next) {
    //var name = req.body["name"];
    var voltage = req.body["voltage"];
    var conductor_type = req.body["conductor_type"];
    var sil = req.body["sil"];
    var line_number = req.body["line_number"];
    var line_length = req.body["line_length"];
    var no_load_mvar = req.body["no_load_mvar"];
    var owner_names = req.body["owner_names[]"];
    var regions = req.body["regions"];
    var states = req.body["states"];
    var substation_names = req.body["substation_names[]"];
    var substation_voltages = req.body["substation_voltages[]"];
    substation_names.sort();
    var name = substation_names.join(" - ");
    if (!Array.isArray(owner_names)) {
        owner_names = [owner_names];
    }
    sil = getDefaultIfNotDesired(sil, 0, true);
    line_number = getDefaultIfNotDesired(line_number, 0, true);
    line_length = getDefaultIfNotDesired(line_length, 0, true);
    no_load_mvar = getDefaultIfNotDesired(no_load_mvar, 0, true);
    owner_names = getDefaultIfNotDesired(owner_names, []);
    regions = getDefaultIfNotDesired(regions, []);
    states = getDefaultIfNotDesired(states, []);

    //console.log(JSON.stringify(req.body));
    //res.json({message: "Please wait"});

    Line.create(name, "No Descrripton", voltage, conductor_type, sil, line_number, line_length, no_load_mvar, owner_names, regions, states, substation_names, substation_voltages, true, function (err, rows) {
        if (err) {
            return next(err);
        }
        //console.log("ROWS BY SUBSTATION INSERT ARE \n" + rows);
        var resultObject = rows[rows.length - 1][0];
        console.log("RESULT FROM LINE CREATION IS => " + JSON.stringify(resultObject));
        res.json(resultObject);
    });
});

function getDefaultIfNotDesired(x, desired, convert_to_number) {
    if (x == null || x == undefined) {
        return desired;
    }
    else if (!Array.isArray(x) && (isNaN(x) || isNaN(parseInt(x))) && x.trim() == "") {
        return desired;
    }
    if (convert_to_number) {
        if (!Array.isArray(x)) {
            if (isNaN(x)) {
                return 0;
            } else {
                return parseInt(x);
            }
        }
    }
    return x;
}

router.post('/create_array', function (req, res, next) {
    var lines = req.body["lines"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log(substations);
    var lineIterators = Array.apply(null, {length: lines.length}).map(Function.call, Number);
    var getLineId = function (lineIterator, callback) {
        //function (name, description, sil, stabilityLimit, thermalLimit, voltage, elem_num, ownerNames, regions, states, substationNames, substationVoltages, cond_type, line_len, no_load_mvar, done, conn) {
        Line.getWithCreation(lines[lineIterator]["name"], lines[lineIterator]["description"], lines[lineIterator]["sil"], lines[lineIterator]["stability_limit"], lines[lineIterator]["thermal_limit"], lines[lineIterator]["voltage"], lines[lineIterator]["elem_num"], lines[lineIterator]["ownerName"].split('/'), lines[lineIterator]["region"].split('/'), lines[lineIterator]["state"].split('/'), lines[lineIterator]["substation_names"], lines[lineIterator]["substation_voltages"], lines[lineIterator]["cond_type"], lines[lineIterator]["line_len"], lines[lineIterator]["no_load_mvar"], function (err, rows) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            var lineId = rows[0].id;
            //console.log(lineId);
            callback(null, lineId);
        }, null)
    };
    //finding each substation Id
    async.mapSeries(lineIterators, getLineId, function (err, results) {
        if (err) return next(err);
        var lineIds = results;
        res.json({lineIds: lineIds});
    });
});

module.exports = router;
