var express = require('express');
var router = express.Router();
var Substation = require('../models/substation.js');
var async = require("async");

router.get('/', function (req, res, next) {
    Substation.getAll(function (err, rows) {
        if (err) {
            return next(err);
        }
        res.json({'substations': rows});
    });
});

router.get('/get_by_name', function (req, res, next) {
    //console.log("get req params for get single are " + JSON.stringify(req.query));

});

router.post('/create_from_csv', function (req, res, next) {
    var name = req.body["name"];
    var voltage = req.body["voltage"];
    var element_type = "Substation";
    var owner = req.body["owner[]"];
    var metadata = "Not Yet";
    if (!Array.isArray(owner)) {
        owner = [owner];
    }
    for (var i = 0; i < owner.length; i++) {
        if (owner[i] == null || owner[i].trim() == "") {
            owner[i] = "NA";
        }
    }
    console.log("Creating (" + name + ", " + owner + ", " + voltage + ")");

    /*
     Substation.create_from_scratch(name, element_type, voltage, owner, "NOT KNOWN", metadata, function (err, rows) {
     if (err) {
     return next(err);
     }
     //console.log("ROWS BY SUBSTATION INSERT ARE \n" + rows);
     var resultObject = rows[rows.length - 1][0];
     console.log("RESULT FROM SUBSTATION CREATION IS => " + JSON.stringify(resultObject));
     res.json(resultObject);
     });
     */

    Substation.create(name, "No Description", voltage, owner, [], [], true, function (err, rows) {
        if (err) {
            return next(err);
        }
        //console.log("ROWS BY SUBSTATION INSERT ARE \n" + rows);
        var resultObject = rows[rows.length - 1][0];
        console.log("RESULT FROM SUBSTATION CREATION IS => " + JSON.stringify(resultObject));
        res.json(resultObject);
    });
});

router.post('/create_array', function (req, res, next) {
    var substations = req.body["substations"];
    //console.log("States create post request body object is " + JSON.stringify(req.body));
    //console.log(substations);
    var substationIterators = Array.apply(null, {length: substations.length}).map(Function.call, Number);
    var getSubstationId = function (substationIterator, callback) {
        //name, description, voltage, ownerNames, regions, states
        Substation.getWithCreation(substations[substationIterator]["name"],substations[substationIterator]["description"], substations[substationIterator]["voltage"], substations[substationIterator]["ownerName"].split("/"), substations[substationIterator]["region"].split("/"), substations[substationIterator]["state"].split("/"), function (err, rows) {
            if (err) {
                return callback(err);
            }
            var substationId = rows[0].id;
            //console.log(substationId);
            callback(null, substationId);
        }, null)
    };
    //finding each substation Id
    async.mapSeries(substationIterators, getSubstationId, function (err, results) {
        if (err) return next(err);
        var substationIds = results;
        res.json({substationIds: substationIds});
    });
});

module.exports = router;
