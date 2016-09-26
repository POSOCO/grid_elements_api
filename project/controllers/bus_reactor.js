var express = require('express');
var router = express.Router();
var BusReactor = require('../models/bus_reactor.js');

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

module.exports = router;
