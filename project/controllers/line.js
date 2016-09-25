var express = require('express');
var router = express.Router();
var Line = require('../models/line.js');

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

module.exports = router;
