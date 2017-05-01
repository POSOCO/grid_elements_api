var express = require('express');
var router = express.Router();
var BusReactor = require('../models/bus_reactor.js');
var async = require("async");

router.post('/create_from_csv', function (req, res, next) {
    //var name = req.body["name"];
    var name = req.body["name"];
    var voltage = req.body["voltage"];
    var mvar = req.body["mvar"];
    var owner_names = req.body["owner_names[]"];
    var regions = req.body["regions"];
    var states = req.body["states"];
    var substation_names = req.body["substation_names[]"];
    var substation_voltages = req.body["substation_voltages[]"];
    if (!Array.isArray(owner_names)) {
        owner_names = [owner_names];
    }
    owner_names = getDefaultIfNotDesired(owner_names, []);
    regions = getDefaultIfNotDesired(regions, []);
    states = getDefaultIfNotDesired(states, []);
    substation_names = getDefaultIfNotDesired(substation_names, []);
    substation_voltages = getDefaultIfNotDesired(substation_voltages, []);

    //console.log(JSON.stringify(req.body));
    //res.json({message: "Please wait"});
    BusReactor.create(name, "No Description", voltage, 0, mvar, owner_names, regions, states, substation_names, substation_voltages, true, function (err, rows) {
        if (err) {
            return next(err);
        }
        //console.log("ROWS BY SUBSTATION INSERT ARE \n" + rows);
        var resultObject = rows[rows.length - 1][0];
        console.log("RESULT FROM BUS REACTOR CREATION IS => " + JSON.stringify(resultObject));
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
    var busReactors = req.body["busReactors"];
    //console.log("BusReactors create post request body object is " + JSON.stringify(req.body));
    //console.log(busReactors);
    var busReactorIterators = Array.apply(null, {length: busReactors.length}).map(Function.call, Number);
    var getBusReactorId = function (busReactorIterator, callback) {
        //function (name, description, sil, stabilityLimit, thermalLimit, voltage, elem_num, ownerNames, regions, states, substationNames, substationVoltages, mvar, done, conn)
        BusReactor.getWithCreation(busReactors[busReactorIterator]["name"], busReactors[busReactorIterator]["description"], busReactors[busReactorIterator]["sil"], busReactors[busReactorIterator]["stability_limit"], busReactors[busReactorIterator]["thermal_limit"], busReactors[busReactorIterator]["voltage"], busReactors[busReactorIterator]["elem_num"], busReactors[busReactorIterator]["ownerName"].split("/"), busReactors[busReactorIterator]["region"].split("/"), busReactors[busReactorIterator]["state"].split("/"), [busReactors[busReactorIterator]["substation"]], [busReactors[busReactorIterator]["voltage"]], busReactors[busReactorIterator]["mvar"], function (err, rows) {
            if (err) {
                return callback(err);
            }
            var busReactorId = rows[0].id;
            //console.log(busReactorId);
            callback(null, busReactorId);
        }, null)
    };
    //finding each bus reactor Id
    async.mapSeries(busReactorIterators, getBusReactorId, function (err, results) {
        if (err) return next(err);
        var busReactorIds = results;
        res.json({busReactorIds: busReactorIds});
    });
});

module.exports = router;
